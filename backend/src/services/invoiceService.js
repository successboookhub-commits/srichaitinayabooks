import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const invoicesDir = path.resolve(__dirname, '../../invoices');

if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir, { recursive: true });
}

export class InvoiceService {
  static getInvoicePath(orderCode) {
    return path.join(invoicesDir, `${orderCode}.pdf`);
  }

  static async generateInvoice(order, items, customer) {
    const filePath = this.getInvoicePath(order.order_code);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('SRI CHAITANYA BOOK CENTRE', { align: 'center', bold: true });
      doc.fontSize(9).text('Konark Theatre Ln, opp. ICICI ATM, Dilsukhnagar, Hyderabad, Telangana - 500060', { align: 'center' });
      doc.text('Phone: 09177110134 | Email: srichaitanyabookcentre@gmail.com', { align: 'center' });
      doc.moveDown();
      doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke('#333333');
      doc.moveDown();

      // Invoice & Customer Info in two columns
      const startY = doc.y;
      doc.fontSize(10).font('Helvetica-Bold').text('INVOICE TO:', 40, startY);
      doc.font('Helvetica').fontSize(9);
      doc.text(customer.name || '-');
      if (customer.phone) doc.text(`Phone: ${customer.phone}`);
      if (customer.door_no) doc.text(`D.No: ${customer.door_no}`);
      if (customer.address) doc.text(customer.address);
      const loc = [customer.mandal, customer.district, customer.state].filter(Boolean).join(', ');
      if (loc) doc.text(loc);
      if (customer.pincode) doc.text(`PIN: ${customer.pincode}`);

      doc.fontSize(10).font('Helvetica-Bold').text('ORDER DETAILS:', 340, startY);
      doc.font('Helvetica').fontSize(9);
      doc.text(`Invoice No: ${order.order_code}`, 340);
      const dateStr = new Date(order.created_at || Date.now()).toLocaleDateString('en-GB');
      doc.text(`Date: ${dateStr}`, 340);
      doc.text(`Payment Status: ${order.status || 'Paid'}`, 340);
      if (order.razorpay_payment_id) {
        doc.text(`Transaction ID: ${order.razorpay_payment_id}`, 340);
      }

      doc.moveDown(2);
      const tableTop = Math.max(doc.y, startY + 95);

      // Table Header
      doc.rect(40, tableTop, 515, 20).fill('#f0f0f0');
      doc.fillColor('#000').font('Helvetica-Bold').fontSize(9);
      doc.text('Item Description', 50, tableTop + 5);
      doc.text('Price (INR)', 330, tableTop + 5, { width: 70, align: 'right' });
      doc.text('Qty', 410, tableTop + 5, { width: 40, align: 'center' });
      doc.text('Total (INR)', 460, tableTop + 5, { width: 85, align: 'right' });

      let yPos = tableTop + 24;
      doc.font('Helvetica').fontSize(9);

      for (const item of items) {
        const itemTotal = (parseFloat(item.price) * parseInt(item.qty, 10)).toFixed(2);
        doc.text(item.product_name, 50, yPos, { width: 270 });
        doc.text(parseFloat(item.price).toFixed(2), 330, yPos, { width: 70, align: 'right' });
        doc.text(String(item.qty), 410, yPos, { width: 40, align: 'center' });
        doc.text(itemTotal, 460, yPos, { width: 85, align: 'right' });

        yPos += 20;
      }

      doc.moveTo(40, yPos).lineTo(555, yPos).stroke('#dddddd');
      yPos += 10;

      // Totals
      doc.font('Helvetica').fontSize(9);
      doc.text('Subtotal:', 350, yPos, { width: 100, align: 'right' });
      doc.text(`Rs. ${parseFloat(order.subtotal).toFixed(2)}`, 460, yPos, { width: 85, align: 'right' });
      yPos += 16;

      doc.text('Shipping Charge:', 350, yPos, { width: 100, align: 'right' });
      doc.text(`Rs. ${parseFloat(order.shipping).toFixed(2)}`, 460, yPos, { width: 85, align: 'right' });
      yPos += 16;

      doc.font('Helvetica-Bold').fontSize(11);
      doc.text('Grand Total:', 350, yPos, { width: 100, align: 'right' });
      doc.text(`Rs. ${parseFloat(order.total).toFixed(2)}`, 460, yPos, { width: 85, align: 'right' });

      // Footer
      doc.font('Helvetica').fontSize(8).fillColor('#666666');
      doc.text('Thank you for choosing Sri Chaitanya Book Centre. This is a computer-generated tax invoice.', 40, 750, { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    });
  }
}

