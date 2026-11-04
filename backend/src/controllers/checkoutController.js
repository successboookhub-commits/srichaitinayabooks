import crypto from 'crypto';
import Razorpay from 'razorpay';
import { query, getConnection } from '../config/db.js';
import { ShippingCalculator } from '../services/shippingCalculator.js';
import { InvoiceService } from '../services/invoiceService.js';
import { WhatsAppService } from '../services/whatsappService.js';

// In-memory cache for pending checkout sessions (auto-expires in 45 min)
const pendingCheckouts = new Map();

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY || 'rzp_live_SIJDGxy85sgrKV',
    key_secret: process.env.RAZORPAY_SECRET || 'gj9CI3Dq9wKU5dapQR61Vyo3',
  });
};

export class CheckoutController {
  // Live calculation of cart totals
  static async calculateTotals(req, res) {
    try {
      const { cart = [] } = req.body;
      const totals = ShippingCalculator.calculate(cart);
      return res.json({ success: true, ...totals });
    } catch (error) {
      console.error('Calculate totals error:', error);
      return res.status(500).json({ success: false, message: 'Calculation failed.' });
    }
  }

  // Step 1: Create Razorpay Order
  static async createOrder(req, res) {
    try {
      const { cart = [], checkoutData = {} } = req.body;

      if (!cart.length) {
        return res.status(400).json({ success: false, message: 'Your cart is empty.' });
      }

      // Validate stock availability
      for (const item of cart) {
        const products = await query('SELECT id, name, quantity, is_active FROM products WHERE id = ? LIMIT 1', [item.id]);
        if (!products.length || !products[0].is_active) {
          return res.status(400).json({ success: false, message: `"${item.name}" is currently unavailable.` });
        }
        if (products[0].quantity < (item.qty || 1)) {
          return res.status(400).json({ success: false, message: `Only ${products[0].quantity} unit(s) of "${item.name}" are in stock.` });
        }
      }

      const calc = ShippingCalculator.calculate(cart);
      const amountInPaise = Math.round(calc.total * 100);

      const razorpay = getRazorpayInstance();
      const receipt = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const razorOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
      });

      // Cache pending checkout state
      pendingCheckouts.set(razorOrder.id, {
        cart,
        checkoutData,
        calc,
        createdAt: Date.now(),
      });

      // Auto-clean cache after 45 minutes
      setTimeout(() => pendingCheckouts.delete(razorOrder.id), 45 * 60 * 1000);

      return res.json({
        success: true,
        order_id: razorOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY || 'rzp_live_SIJDGxy85sgrKV',
      });
    } catch (error) {
      console.error('Create Razorpay order error:', error);
      return res.status(500).json({ success: false, message: 'Failed to initiate payment.' });
    }
  }

  // Step 2: Verify Razorpay Payment & Finalize Order
  static async verifyPayment(req, res) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment signature details.' });
    }

    // Verify HMAC-SHA256 signature
    const secret = process.env.RAZORPAY_SECRET || 'gj9CI3Dq9wKU5dapQR61Vyo3';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Please contact support with Payment ID: ' + razorpay_payment_id,
      });
    }

    // Avoid double-processing
    const existingOrders = await query('SELECT id, order_code FROM orders WHERE razorpay_payment_id = ? LIMIT 1', [razorpay_payment_id]);
    if (existingOrders.length) {
      return res.json({
        success: true,
        message: 'Order already confirmed.',
        orderId: existingOrders[0].id,
        orderCode: existingOrders[0].order_code,
      });
    }

    const cached = pendingCheckouts.get(razorpay_order_id);
    if (!cached) {
      return res.status(400).json({
        success: false,
        message: 'Checkout session expired. If money was deducted, contact support with Payment ID: ' + razorpay_payment_id,
      });
    }

    const { cart, checkoutData, calc } = cached;
    const conn = await getConnection();

    try {
      await conn.beginTransaction();

      // Customer Deduplication
      const phone = String(checkoutData.phone || '').trim();
      const existingCustomers = await conn.query('SELECT id FROM customers WHERE phone = ? LIMIT 1', [phone]);

      let customerId;
      if (existingCustomers[0].length) {
        customerId = existingCustomers[0][0].id;
        await conn.query(
          `UPDATE customers SET 
            name = ?, email = ?, state = ?, district = ?, mandal = ?, door_no = ?, address = ?, pincode = ?, updated_at = NOW() 
          WHERE id = ?`,
          [
            checkoutData.name,
            checkoutData.email || '',
            checkoutData.state,
            checkoutData.district,
            checkoutData.mandal || '',
            checkoutData.door_no || '',
            checkoutData.address,
            checkoutData.pincode,
            customerId,
          ]
        );
      } else {
        const [customerResult] = await conn.query(
          `INSERT INTO customers 
            (name, email, phone, country, state, district, mandal, door_no, address, pincode, created_at, updated_at) 
          VALUES (?, ?, ?, 'India', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            checkoutData.name,
            checkoutData.email || '',
            phone,
            checkoutData.state,
            checkoutData.district,
            checkoutData.mandal || '',
            checkoutData.door_no || '',
            checkoutData.address,
            checkoutData.pincode,
          ]
        );
        customerId = customerResult.insertId;
      }

      // Generate Collision-Proof Order Code
      const d = new Date();
      const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
      let orderCode;
      let exists = true;
      while (exists) {
        orderCode = `ORD${ym}${Math.floor(1000 + Math.random() * 9000)}`;
        const [check] = await conn.query('SELECT id FROM orders WHERE order_code = ? LIMIT 1', [orderCode]);
        if (!check.length) exists = false;
      }

      // Insert Order
      const [orderResult] = await conn.query(
        `INSERT INTO orders 
          (customer_id, order_code, subtotal, shipping, total, status, order_status, razorpay_payment_id, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, 'Paid', 'Ordered', ?, NOW(), NOW())`,
        [
          customerId,
          orderCode,
          calc.subtotal,
          calc.shipping,
          calc.total,
          razorpay_payment_id,
        ]
      );
      const orderId = orderResult.insertId;

      // Insert Order Items & Decrement Inventory
      for (const item of cart) {
        const qty = parseInt(item.qty || 1, 10);
        const price = parseFloat(item.price || 0);

        await conn.query(
          `INSERT INTO order_items 
            (order_id, product_id, product_name, price, qty, total, created_at, updated_at) 
          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [orderId, item.id || null, item.name, price, qty, price * qty]
        );

        if (item.id) {
          await conn.query('UPDATE products SET quantity = GREATEST(0, quantity - ?) WHERE id = ?', [qty, item.id]);
        }
      }

      await conn.commit();
      pendingCheckouts.delete(razorpay_order_id);

      // Async: Generate PDF Invoice & Send WhatsApp
      (async () => {
        try {
          const orderObj = { id: orderId, order_code: orderCode, subtotal: calc.subtotal, shipping: calc.shipping, total: calc.total, status: 'Paid', razorpay_payment_id };
          await InvoiceService.generateInvoice(orderObj, cart, checkoutData);

          const invoicePublicUrl = `${process.env.APP_URL || 'http://localhost:5000'}/api/invoices/${orderCode}.pdf`;
          await WhatsAppService.sendOrderConfirmation(phone, orderObj, invoicePublicUrl);
        } catch (err) {
          console.error('Post-order invoice/WhatsApp async failed:', err.message);
        }
      })();

      return res.json({
        success: true,
        message: 'Order placed successfully!',
        orderId,
        orderCode,
      });

    } catch (error) {
      await conn.rollback();
      console.error('Verify payment & create order error:', error);
      return res.status(500).json({ success: false, message: 'Failed to process order.' });
    } finally {
      conn.release();
    }
  }

  // Webhook for asynchronous payment capture
  static async webhook(req, res) {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_SECRET;
      const signature = req.headers['x-razorpay-signature'];

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ status: 'invalid signature' });
      }

      const event = req.body.event;
      if (event === 'payment.captured' || event === 'order.paid') {
        const payment = req.body.payload.payment.entity;
        console.log(`Razorpay Webhook: Payment confirmed for ID ${payment.id}`);
      }

      return res.json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ status: 'error' });
    }
  }
}

