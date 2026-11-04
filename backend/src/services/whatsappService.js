import axios from 'axios';

const ENDPOINT = 'https://bhashsms.com/api/sendmsgutil.php';

export class WhatsAppService {
  static async sendOrderConfirmation(phone, order, invoicePublicUrl) {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;

      const dateStr = new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const params = [
        order.order_code,
        parseFloat(order.total).toFixed(2),
        order.status || 'Paid',
        dateStr,
      ].join(',');

      const queryParams = {
        user: process.env.BHASHSMS_USER || 'Azsofttech_BW',
        pass: process.env.BHASHSMS_PASS || '12345678',
        sender: process.env.BHASHSMS_SENDER || 'BUZWAP',
        phone: formattedPhone,
        text: process.env.BHASHSMS_TEMPLATE || 'ord_ch01',
        priority: 'wa',
        stype: 'normal',
        Params: params,
        htype: 'document',
        fname: `Invoice ${order.order_code}`,
        url: invoicePublicUrl,
      };

      const response = await axios.get(ENDPOINT, {
        params: queryParams,
        timeout: 8000,
      });

      console.log('BhashSMS response:', response.data);
      return true;
    } catch (error) {
      console.error('WhatsApp send failed:', error.message);
      return false;
    }
  }
}

