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

  static async generateInvoice(order, items, customer = {}) {
    const filePath = this.getInvoicePath(order.order_code);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      const custName = (customer.name || order.customer_name || 'Customer').toUpperCase();
      const custPhone = customer.phone || order.customer_phone || '-';
      const pincode = customer.pincode || order.pincode || '-';
      const badgeText = (order.status === 'Paid') ? 'PREPAID' : 'POSTAL PARCEL';
      const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

      const door = (customer.door_no || order.door_no || '').trim();
      const addr = (customer.address || order.address || '').trim();
      const mandal = (customer.mandal || order.mandal || '').trim();
      const city = (customer.city || order.city || '').trim();
      const district = (customer.district || order.district || '').trim();
      const state = (customer.state || order.state || 'Telangana / Andhra Pradesh').trim();

      const line1 = [door ? `D.No: ${door}` : '', addr].filter(Boolean).join(', ');
      const line2 = [mandal, city && city !== mandal ? city : '', district].filter(Boolean).join(', ');
      const addressLines = [line1, line2, state].filter(Boolean);

      const totalQty = (items || []).reduce((s, it) => s + (parseInt(it.qty || it.quantity || 1, 10)), 0);

      // Outer Box (x=40, width=515)
      const startX = 40;
      const boxWidth = 515;
      let currY = 40;

      // 1. Header Box
      doc.rect(startX, currY, boxWidth, 48).stroke('#000000');
      doc.fillColor('#000000').font('Helvetica-Bold').fontSize(14).text('SRI CHAITANYA BOOK CENTRE', startX + 12, currY + 10);
      doc.fontSize(7.5).text('ESTD. 1986 | DILSUKHNAGAR, HYDERABAD - COMPETITIVE EXAM BOOKS', startX + 12, currY + 28);
      // Badge pill
      doc.rect(startX + boxWidth - 85, currY + 14, 75, 20).stroke('#000000');
      doc.font('Helvetica-Bold').fontSize(9).text(badgeText, startX + boxWidth - 85, currY + 19, { width: 75, align: 'center' });
      currY += 48;

      // 2. Order ID Strip
      doc.rect(startX, currY, boxWidth, 26).stroke('#000000');
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#64748b').text('ORDER NO: ', startX + 12, currY + 8, { continued: true });
      doc.font('Courier-Bold').fontSize(12).fillColor('#000000').text(order.order_code || `ORD${order.id}`);
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#334155').text(`Booking Date: ${orderDate}`, startX + boxWidth - 160, currY + 8, { width: 148, align: 'right' });
      currY += 26;

      // 3. Deliver To / Consignee
      const deliverStartY = currY;
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#475569').text('DELIVER TO / SHIP TO:', startX + 12, currY + 8);
      doc.fontSize(7.5).text('[CONSIGNEE]', startX + boxWidth - 90, currY + 8, { width: 78, align: 'right' });
      currY += 22;

      doc.font('Helvetica-Bold').fontSize(13).fillColor('#000000').text(custName, startX + 12, currY);
      currY += 16;

      doc.font('Helvetica-Bold').fontSize(8).text('TEL / MOB: ', startX + 12, currY, { continued: true });
      doc.font('Courier-Bold').fontSize(10.5).text(custPhone);
      currY += 15;

      doc.font('Helvetica').fontSize(9.5).fillColor('#0f172a');
      for (const line of addressLines) {
        doc.text(line, startX + 12, currY, { width: boxWidth - 24 });
        currY += 13;
      }
      currY += 4;
      doc.moveTo(startX + 12, currY).lineTo(startX + boxWidth - 12, currY).stroke('#e2e8f0');
      currY += 6;
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#334155').text('PIN CODE:', startX + 12, currY);
      doc.font('Courier-Bold').fontSize(13).fillColor('#000000').text(pincode, startX + boxWidth - 110, currY - 2, { width: 98, align: 'right' });
      currY += 18;

      doc.rect(startX, deliverStartY, boxWidth, currY - deliverStartY).stroke('#000000');

      // 4. Return If Undelivered To
      const returnStartY = currY;
      doc.fillColor('#f8fafc').rect(startX, currY, boxWidth, 68).fill();
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#475569').text('RETURN IF UNDELIVERED TO (BOOK STORE):', startX + 12, currY + 8);
      doc.fontSize(7.5).text('Postal Reg ID: 1879696070', startX + boxWidth - 140, currY + 8, { width: 128, align: 'right' });
      currY += 20;

      doc.font('Helvetica-Bold').fontSize(10).fillColor('#000000').text('SRI CHAITANYA BOOK CENTRE', startX + 12, currY);
      currY += 12;
      doc.font('Helvetica').fontSize(8).fillColor('#1e293b').text('Konark Theatre Lane, opp. ICICI ATM, Dilsukhnagar, Hyderabad, Telangana - 500060', startX + 12, currY);
      currY += 12;
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#000000').text('Helpline / WhatsApp: 09177110134', startX + 12, currY);
      currY += 16;
      doc.rect(startX, returnStartY, boxWidth, currY - returnStartY).stroke('#000000');

      // 5. Book Description Manifest
      const manifestStartY = currY;
      const countTitles = (items || []).length || 1;
      const titleWord = countTitles > 1 ? 'TITLES' : 'TITLE';
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#334155').text(`BOOK DESCRIPTION (${countTitles} ${titleWord})`, startX + 12, currY + 8);
      doc.fontSize(8).text(`TOTAL QTY: ${totalQty}`, startX + boxWidth - 100, currY + 8, { width: 88, align: 'right' });
      currY += 22;

      for (let i = 0; i < (items || []).length; i++) {
        const it = items[i];
        const rawTitle = it.product_name || it.name || it.book_title || 'Competitive Book';
        const cleanTitle = rawTitle.replace(/\.{2,}$/, '').trim();
        const qty = it.qty || it.quantity || 1;

        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#000000').text(`${i + 1}. ${cleanTitle}`, startX + 12, currY, { width: boxWidth - 70 });
        doc.font('Courier-Bold').fontSize(8.5).text(`x${qty}`, startX + boxWidth - 50, currY, { width: 38, align: 'right' });
        currY += 16;
      }
      doc.rect(startX, manifestStartY, boxWidth, Math.max(40, currY - manifestStartY + 10)).stroke('#000000');

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    });
  }
}
