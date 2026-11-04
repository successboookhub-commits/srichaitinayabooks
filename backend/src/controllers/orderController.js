import { query } from '../config/db.js';

export class OrderController {
  // Admin: Paginated list of orders
  static async list(req, res) {
    try {
      const { search, status, date_from, date_to, page = 1, limit = 15 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause = ' WHERE 1=1';
      const params = [];

      if (status) {
        whereClause += ' AND o.order_status = ?';
        params.push(status);
      }

      if (date_from) {
        const fromVal = date_from.includes(':') ? date_from : `${date_from} 00:00:00`;
        whereClause += ' AND o.created_at >= ?';
        params.push(fromVal);
      }

      if (date_to) {
        const toVal = date_to.includes(':') ? date_to : `${date_to} 23:59:59`;
        whereClause += ' AND o.created_at <= ?';
        params.push(toVal);
      }

      const hasSearch = Boolean(search && search.trim());
      if (hasSearch) {
        const term = `%${search.trim()}%`;
        whereClause += ` AND (o.id = ? OR o.order_code LIKE ? OR c.name LIKE ? OR c.phone LIKE ? OR c.district LIKE ? OR c.mandal LIKE ? OR i.product_name LIKE ?)`;
        params.push(isNaN(search.trim()) ? 0 : Number(search.trim()), term, term, term, term, term, term);
      }

      const joinSql = hasSearch
        ? `FROM orders o 
           LEFT JOIN customers c ON o.customer_id = c.id 
           LEFT JOIN order_items i ON o.id = i.order_id`
        : `FROM orders o 
           LEFT JOIN customers c ON o.customer_id = c.id`;

      const countSql = `SELECT COUNT(DISTINCT o.id) as total ${joinSql} ${whereClause}`;
      const totalResult = await query(countSql, params);
      const total = totalResult[0]?.total || 0;

      const sql = `
        SELECT o.id, o.order_code, o.total, o.subtotal, o.shipping, o.status, o.order_status, o.created_at,
               COALESCE(c.name, 'Customer') as customer_name,
               COALESCE(c.phone, '-') as customer_phone,
               c.district, c.mandal, c.address, c.door_no, c.state, c.pincode
        ${joinSql}
        ${whereClause}
        GROUP BY o.id, o.order_code, o.total, o.subtotal, o.shipping, o.status, o.order_status, o.created_at,
                 c.name, c.phone, c.district, c.mandal, c.address, c.door_no, c.state, c.pincode
        ORDER BY o.id DESC
        LIMIT ? OFFSET ?
      `;

      const orders = await query(sql, [...params, Number(limit), offset]);

      return res.json({
        success: true,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        orders,
      });
    } catch (error) {
      console.error('Admin order list error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
  }

  // Admin: View single order
  static async show(req, res) {
    try {
      const { id } = req.params;
      const orders = await query(
        `SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, 
                c.country, c.state, c.district, c.mandal, c.door_no, c.address, c.pincode
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         WHERE o.id = ? LIMIT 1`,
        [id]
      );

      if (!orders.length) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      const items = await query('SELECT * FROM order_items WHERE order_id = ?', [id]);

      return res.json({
        success: true,
        order: orders[0],
        items,
      });
    } catch (error) {
      console.error('Admin order show error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch order details.' });
    }
  }

  // Admin: Update single order status
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const order_status = req.body.order_status || req.body.status;

      if (!order_status) {
        return res.status(400).json({ success: false, message: 'Status is required.' });
      }

      await query('UPDATE orders SET order_status = ?, updated_at = NOW() WHERE id = ?', [order_status, id]);
      return res.json({ success: true, message: 'Order status updated successfully.' });
    } catch (error) {
      console.error('Update status error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update order status.' });
    }
  }

  // Admin: Bulk update status for selected orders
  static async bulkUpdateStatus(req, res) {
    try {
      const { order_ids = [] } = req.body;
      const order_status = req.body.order_status || req.body.status;

      if (!order_ids.length || !order_status) {
        return res.status(400).json({ success: false, message: 'Order IDs and status are required.' });
      }

      const placeholders = order_ids.map(() => '?').join(',');
      await query(`UPDATE orders SET order_status = ?, updated_at = NOW() WHERE id IN (${placeholders})`, [
        order_status,
        ...order_ids,
      ]);

      return res.json({ success: true, message: `${order_ids.length} order(s) updated to "${order_status}".` });
    } catch (error) {
      console.error('Bulk update status error:', error);
      return res.status(500).json({ success: false, message: 'Bulk status update failed.' });
    }
  }

  // Admin: Bulk update status by date range
  static async bulkUpdateByDate(req, res) {
    try {
      const { date_from, date_to, order_status } = req.body;

      if (!date_from || !date_to || !order_status) {
        return res.status(400).json({ success: false, message: 'Date range and status are required.' });
      }

      const fromVal = date_from.includes(':') ? date_from : `${date_from} 00:00:00`;
      const toVal = date_to.includes(':') ? date_to : `${date_to} 23:59:59`;
      const result = await query(
        'UPDATE orders SET order_status = ?, updated_at = NOW() WHERE created_at >= ? AND created_at <= ?',
        [order_status, fromVal, toVal]
      );

      return res.json({ success: true, message: `${result.affectedRows} order(s) updated to "${order_status}".` });
    } catch (error) {
      console.error('Bulk update by date error:', error);
      return res.status(500).json({ success: false, message: 'Bulk status update failed.' });
    }
  }

  // Admin: Barcode Courier Lookup (High-speed TSV format)
  static async scanCourier(req, res) {
    try {
      const code = String(req.query.code || '').trim();
      if (!code) {
        return res.status(200).type('text/plain').send('ERROR\tNo barcode provided');
      }

      const orders = await query(
        `SELECT o.order_code, c.name, c.phone, c.door_no, c.address, c.mandal, c.district, c.state, c.pincode
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         WHERE o.order_code = ? LIMIT 1`,
        [code]
      );

      if (!orders.length) {
        return res.status(200).type('text/plain').send(`ERROR\tNo order found for barcode: ${code}`);
      }

      const o = orders[0];
      const clean = (val) => String(val || '').replace(/[\t\r\n]/g, ' ').trim();

      const fullAddress = clean(
        [o.door_no, o.address, o.mandal, o.district, o.state, o.pincode].filter(Boolean).join(', ')
      );

      const fields = [
        'OK',
        clean(o.order_code),
        clean(o.pincode),
        clean(o.name),
        fullAddress,
        clean(o.phone),
      ];

      return res.status(200).type('text/plain').send(fields.join('\t'));
    } catch (error) {
      console.error('Scan courier error:', error);
      return res.status(200).type('text/plain').send('ERROR\tInternal error');
    }
  }

  // Admin: Process batch scans from Web UI or handheld terminal
  static async processBatchScan(req, res) {
    try {
      const { scans, status = 'Shipped' } = req.body;
      if (!scans) {
        return res.status(400).json({ success: false, message: 'No barcodes or codes provided' });
      }

      const lines = scans.split(/[\r\n]+/).map((s) => s.trim()).filter(Boolean);
      const updated = [];
      const not_found = [];

      for (const rawLine of lines) {
        const code = rawLine.split(/\t/)[0].trim();
        if (!code) continue;

        const orders = await query(
          'SELECT id, order_code FROM orders WHERE order_code = ? OR id = ? LIMIT 1',
          [code, isNaN(code) ? 0 : Number(code)]
        );

        if (orders.length > 0) {
          const ord = orders[0];
          await query('UPDATE orders SET order_status = ?, updated_at = NOW() WHERE id = ?', [
            status,
            ord.id,
          ]);
          updated.push(ord.order_code);
        } else {
          not_found.push(code);
        }
      }

      return res.json({
        success: true,
        total_scanned: lines.length,
        updated,
        not_found,
        status,
      });
    } catch (error) {
      console.error('Process batch scan error:', error);
      return res.status(500).json({ success: false, message: 'Failed to process scans.' });
    }
  }

  // Admin: Get orders for shipping labels
  static async printLabels(req, res) {
    try {
      const { ids, date_from, date_to } = req.query;

      let sql = `
        SELECT o.id, o.order_code, o.created_at,
               c.name as customer_name, c.phone as customer_phone, c.door_no, c.address, c.mandal, c.district, c.state, c.pincode
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
      `;
      const params = [];

      if (ids) {
        const idList = ids.split(',').map(Number).filter(Boolean);
        const placeholders = idList.map(() => '?').join(',');
        sql += ` WHERE o.id IN (${placeholders}) ORDER BY o.id ASC`;
        params.push(...idList);
      } else if (date_from || date_to) {
        sql += ' WHERE 1=1';
        if (date_from) {
          sql += ' AND o.created_at >= ?';
          params.push(date_from);
        }
        if (date_to) {
          sql += ' AND o.created_at <= ?';
          params.push(date_to);
        }
        sql += ' ORDER BY o.created_at ASC';
      } else {
        return res.status(400).json({ success: false, message: 'Select orders or date range.' });
      }

      const orders = await query(sql, params);

      // Fetch items for each order
      for (const order of orders) {
        order.items = await query('SELECT product_name, qty FROM order_items WHERE order_id = ?', [order.id]);
      }

      return res.json({ success: true, count: orders.length, orders });
    } catch (error) {
      console.error('Print labels error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch label orders.' });
    }
  }

  // Admin: Export all orders or filtered orders to Excel / CSV with single click
  static async exportOrders(req, res) {
    try {
      const { search, status, date_from, date_to, format = 'csv' } = req.query;

      let whereClause = ' WHERE 1=1';
      const params = [];

      if (status) {
        whereClause += ' AND o.order_status = ?';
        params.push(status);
      }

      if (date_from) {
        const fromVal = date_from.includes(':') ? date_from : `${date_from} 00:00:00`;
        whereClause += ' AND o.created_at >= ?';
        params.push(fromVal);
      }

      if (date_to) {
        const toVal = date_to.includes(':') ? date_to : `${date_to} 23:59:59`;
        whereClause += ' AND o.created_at <= ?';
        params.push(toVal);
      }

      const hasSearch = Boolean(search && search.trim());
      if (hasSearch) {
        const term = `%${search.trim()}%`;
        whereClause += ` AND (o.id = ? OR o.order_code LIKE ? OR c.name LIKE ? OR c.phone LIKE ? OR c.district LIKE ? OR c.mandal LIKE ?)`;
        params.push(isNaN(search.trim()) ? 0 : Number(search.trim()), term, term, term, term, term);
      }

      const sql = `
        SELECT o.id, o.order_code, o.total, o.subtotal, o.shipping, o.status, o.order_status, 
               o.razorpay_payment_id, o.created_at,
               c.name as customer_name, c.email as customer_email, c.phone as customer_phone,
               c.door_no, c.address, c.mandal, c.district, c.state, c.pincode
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ${whereClause}
        ORDER BY o.id DESC
      `;

      const orders = await query(sql, params);

      if (!orders.length) {
        return res.status(404).json({ success: false, message: 'No orders found matching criteria to export.' });
      }

      // Fetch items for these orders in one batch query
      const orderIds = orders.map((o) => o.id);
      const idPlaceholders = orderIds.map(() => '?').join(',');
      const allItems = await query(
        `SELECT order_id, product_name, qty, price, total FROM order_items WHERE order_id IN (${idPlaceholders})`,
        orderIds
      );

      const itemsByOrderId = {};
      for (const it of allItems) {
        if (!itemsByOrderId[it.order_id]) itemsByOrderId[it.order_id] = [];
        itemsByOrderId[it.order_id].push(it);
      }

      // Format date helper
      const formatDate = (dateStr) => {
        if (!dateStr) return { date: '-', time: '-' };
        const d = new Date(dateStr);
        return {
          date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        };
      };

      // Sanitize text for CSV
      const cleanCsv = (val) => {
        if (val === null || val === undefined) return '';
        let str = String(val).replace(/[\r\n\t]+/g, ' ').trim();
        return str.replace(/"/g, '""');
      };

      const nowStr = new Date().toISOString().split('T')[0];
      const filename = `SriChaitanya_Orders_${date_from ? date_from + '_to_' + (date_to || nowStr) : 'All_' + nowStr}`;

      if (format === 'xls') {
        // Generate Excel XML 2003 (.xls)
        let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11" ss:FontName="Calibri"/>
   <Interior ss:Color="#D72C35" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A31C24"/>
   </Borders>
  </Style>
  <Style ss:ID="Text">
   <Font ss:Size="10" ss:FontName="Calibri"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Center">
   <Font ss:Size="10" ss:FontName="Calibri"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Currency">
   <Font ss:Size="10" ss:FontName="Calibri"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="₹#,##0.00"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Sri Chaitanya Orders">
  <Table>
   <Row ss:Height="28">
    <Cell ss:StyleID="Header"><Data ss:Type="String">S.No</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Order ID</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Order Code</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Order Date</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Order Time</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Order Status</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Payment Status</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Payment Method</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Transaction / Razorpay ID</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Customer Phone</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Customer Email</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Door / House No</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Street / Area Address</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Mandal / Town</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">District</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">State</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">PIN Code</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Complete Shipping Address</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Total Items Count</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Items Ordered (Title &amp; Qty)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Subtotal (₹)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Shipping Fee (₹)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Grand Total (₹)</Data></Cell>
   </Row>`;

        orders.forEach((o, index) => {
          const { date, time } = formatDate(o.created_at);
          const items = itemsByOrderId[o.id] || [];
          const totalQty = items.reduce((sum, it) => sum + (Number(it.qty) || 1), 0);
          const itemsSummary = items.map((it) => `${it.product_name || 'Book'} (Qty: ${it.qty || 1})`).join(' | ');
          const fullAddress = [o.door_no, o.address, o.mandal, o.district, o.state, o.pincode].filter(Boolean).join(', ');
          const payMethod = o.razorpay_payment_id ? 'Online (Razorpay)' : (o.status?.toLowerCase() === 'paid' ? 'Online' : 'Cash on Delivery');
          const cleanXml = (val) => String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

          xml += `
   <Row ss:Height="20">
    <Cell ss:StyleID="Center"><Data ss:Type="Number">${index + 1}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="Number">${o.id}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${cleanXml(o.order_code)}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${date}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${time}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${cleanXml(o.order_status || 'Ordered')}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${cleanXml(o.status || 'Pending')}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${payMethod}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.razorpay_payment_id || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.customer_name || 'Customer')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.customer_phone || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.customer_email || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.door_no || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.address || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.mandal || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.district || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(o.state || 'Telangana')}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="String">${cleanXml(o.pincode || '-')}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(fullAddress || '-')}</Data></Cell>
    <Cell ss:StyleID="Center"><Data ss:Type="Number">${totalQty}</Data></Cell>
    <Cell ss:StyleID="Text"><Data ss:Type="String">${cleanXml(itemsSummary || '-')}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${parseFloat(o.subtotal || o.total || 0).toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${parseFloat(o.shipping || 0).toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${parseFloat(o.total || 0).toFixed(2)}</Data></Cell>
   </Row>`;
        });

        xml += `
  </Table>
 </Worksheet>
</Workbook>`;

        res.setHeader('Content-Type', 'application/vnd.ms-excel');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.xls"`);
        return res.send(xml);
      }

      // Default format: High-Compatibility Excel UTF-8 BOM CSV
      const headers = [
        'S.No',
        'Order ID',
        'Order Code',
        'Order Date',
        'Order Time',
        'Order Status',
        'Payment Status',
        'Payment Method',
        'Transaction / Razorpay ID',
        'Customer Name',
        'Customer Phone',
        'Customer Email',
        'Door / House No',
        'Street / Area Address',
        'Mandal / Town',
        'District',
        'State',
        'PIN Code',
        'Complete Shipping Address',
        'Total Items Count',
        'Items Ordered (Title & Qty)',
        'Subtotal (Rs)',
        'Shipping Fee (Rs)',
        'Grand Total (Rs)',
      ];

      const rows = [headers.map((h) => `"${h}"`).join(',')];

      orders.forEach((o, index) => {
        const { date, time } = formatDate(o.created_at);
        const items = itemsByOrderId[o.id] || [];
        const totalQty = items.reduce((sum, it) => sum + (Number(it.qty) || 1), 0);
        const itemsSummary = items.map((it) => `${it.product_name || 'Book'} (Qty: ${it.qty || 1})`).join(' | ');
        const fullAddress = [o.door_no, o.address, o.mandal, o.district, o.state, o.pincode].filter(Boolean).join(', ');
        const payMethod = o.razorpay_payment_id
          ? 'Online (Razorpay)'
          : o.status?.toLowerCase() === 'paid'
          ? 'Online'
          : 'Cash on Delivery';

        // Format phone and pincode with ="..." so Excel opens them as text without scientific notation or losing zeros
        const phoneFormatted = o.customer_phone ? `="${cleanCsv(o.customer_phone)}"` : '""';
        const pincodeFormatted = o.pincode ? `="${cleanCsv(o.pincode)}"` : '""';

        const row = [
          index + 1,
          o.id,
          `"${cleanCsv(o.order_code)}"`,
          `"${date}"`,
          `"${time}"`,
          `"${cleanCsv(o.order_status || 'Ordered')}"`,
          `"${cleanCsv(o.status || 'Pending')}"`,
          `"${cleanCsv(payMethod)}"`,
          `"${cleanCsv(o.razorpay_payment_id || '-')}"`,
          `"${cleanCsv(o.customer_name || 'Customer')}"`,
          phoneFormatted,
          `"${cleanCsv(o.customer_email || '-')}"`,
          `"${cleanCsv(o.door_no || '-')}"`,
          `"${cleanCsv(o.address || '-')}"`,
          `"${cleanCsv(o.mandal || '-')}"`,
          `"${cleanCsv(o.district || '-')}"`,
          `"${cleanCsv(o.state || 'Telangana')}"`,
          pincodeFormatted,
          `"${cleanCsv(fullAddress || '-')}"`,
          totalQty,
          `"${cleanCsv(itemsSummary || '-')}"`,
          parseFloat(o.subtotal || o.total || 0).toFixed(2),
          parseFloat(o.shipping || 0).toFixed(2),
          parseFloat(o.total || 0).toFixed(2),
        ];

        rows.push(row.join(','));
      });

      // Prepend UTF-8 BOM (\uFEFF) so Excel opens UTF-8 without character corruption
      const csvContent = '\uFEFF' + rows.join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.status(200).send(csvContent);
    } catch (error) {
      console.error('Export orders error:', error);
      return res.status(500).json({ success: false, message: 'Failed to export orders to Excel.' });
    }
  }
}

