import { query } from '../config/db.js';
import { InvoiceService } from '../services/invoiceService.js';
import fs from 'fs';

export class OrderHistoryController {
  // Lookup all orders by mobile number or order code
  static async lookup(req, res) {
    try {
      const inputQuery = String(req.query.query || req.query.phone || '').trim();
      if (!inputQuery) {
        return res.status(400).json({ success: false, message: 'Please enter a 10-digit mobile number or Order Code.' });
      }

      // 1. Try finding by phone number first
      const cleanPhone = inputQuery.replace(/\D/g, '');
      let orders = [];

      if (cleanPhone.length >= 10) {
        const sql = `
          SELECT 
            o.id, 
            o.order_code, 
            o.total, 
            o.subtotal,
            o.shipping,
            o.status, 
            o.order_status, 
            o.razorpay_payment_id,
            o.created_at,
            c.name as customer_name,
            c.phone as customer_phone,
            c.door_no,
            c.address,
            c.mandal,
            c.district,
            c.state,
            c.pincode
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          WHERE c.phone = ? OR c.phone LIKE ?
          ORDER BY o.id DESC
        `;
        orders = await query(sql, [cleanPhone, `%${cleanPhone.slice(-10)}%`]);
      }

      // 2. If no orders found yet and input might be an Order Code (e.g. ORD... or contains letters)
      if (!orders.length) {
        const sql = `
          SELECT 
            o.id, 
            o.order_code, 
            o.total, 
            o.subtotal,
            o.shipping,
            o.status, 
            o.order_status, 
            o.razorpay_payment_id,
            o.created_at,
            c.name as customer_name,
            c.phone as customer_phone,
            c.door_no,
            c.address,
            c.mandal,
            c.district,
            c.state,
            c.pincode
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          WHERE o.order_code = ? OR o.order_code LIKE ?
          ORDER BY o.id DESC
        `;
        orders = await query(sql, [inputQuery, `%${inputQuery}%`]);
      }

      if (!orders.length) {
        return res.json({ success: true, count: 0, orders: [] });
      }

      // 3. Attach order_items with product images for rich visual tracking cards
      const orderIds = orders.map((o) => o.id);
      const placeholders = orderIds.map(() => '?').join(',');
      const itemsSql = `
        SELECT 
          oi.id,
          oi.order_id,
          oi.product_id,
          oi.product_name,
          oi.price,
          oi.qty,
          oi.total,
          p.main_photo,
          p.slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${placeholders})
      `;
      const allItems = await query(itemsSql, orderIds);

      // Group items by order_id
      const itemsByOrderId = {};
      for (const item of allItems) {
        if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
        itemsByOrderId[item.order_id].push({
          id: item.id,
          name: item.product_name,
          book_title: item.product_name,
          price: parseFloat(item.price),
          quantity: item.qty,
          total: parseFloat(item.total),
          image: item.main_photo,
          slug: item.slug,
        });
      }

      // Format response
      const populatedOrders = orders.map((o) => ({
        id: o.id,
        order_code: o.order_code,
        total_amount: parseFloat(o.total).toFixed(2),
        subtotal: parseFloat(o.subtotal || o.total).toFixed(2),
        shipping_fee: o.shipping ? parseFloat(o.shipping).toFixed(2) : '0.00',
        status: o.status,
        order_status: o.order_status || 'Ordered',
        payment_method: o.razorpay_payment_id ? 'Online (Razorpay)' : 'Cash on Delivery (COD)',
        created_at: o.created_at,
        customer_name: o.customer_name,
        customer_phone: o.customer_phone,
        door_no: o.door_no,
        address: o.address,
        mandal: o.mandal,
        district: o.district,
        state: o.state,
        pincode: o.pincode,
        items: itemsByOrderId[o.id] || [],
        total_items: (itemsByOrderId[o.id] || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
      }));

      return res.json({
        success: true,
        count: populatedOrders.length,
        orders: populatedOrders,
      });
    } catch (error) {
      console.error('Order lookup error:', error);
      return res.status(500).json({ success: false, message: 'Failed to look up orders.' });
    }
  }

  // Get single order details with phone security check
  static async getDetails(req, res) {
    try {
      const { orderCode } = req.params;
      const phone = String(req.query.phone || '').trim();

      const orders = await query(
        `SELECT o.*, c.name as customer_name, c.phone as customer_phone, c.door_no, c.address, c.mandal, c.district, c.state, c.pincode
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         WHERE o.order_code = ? LIMIT 1`,
        [orderCode]
      );

      if (!orders.length) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      const order = orders[0];

      // Security check: Phone must match unless authenticated admin
      const isAdmin = req.user?.role === 'admin';
      if (!isAdmin && (!phone || order.customer_phone !== phone)) {
        return res.status(403).json({ success: false, message: 'Unauthorized. The phone number does not match this order.' });
      }

      const items = await query(`
        SELECT oi.*, p.main_photo, p.slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);

      return res.json({
        success: true,
        order: {
          ...order,
          total_amount: parseFloat(order.total).toFixed(2),
        },
        items,
      });
    } catch (error) {
      console.error('Get order details error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load order details.' });
    }
  }

  // Download PDF Invoice
  static async downloadInvoice(req, res) {
    try {
      const { orderCode } = req.params;

      const orders = await query(
        `SELECT o.*, c.phone as customer_phone
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         WHERE o.order_code = ? LIMIT 1`,
        [orderCode]
      );

      if (!orders.length) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      const order = orders[0];
      const filePath = await InvoiceService.generateInvoice(order.id);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'Invoice file could not be generated.' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Invoice-${order.order_code}.pdf"`);
      return fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error('Invoice download error:', error);
      return res.status(500).json({ success: false, message: 'Failed to download invoice.' });
    }
  }
}
