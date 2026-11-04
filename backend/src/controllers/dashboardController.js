import { query } from '../config/db.js';

export class DashboardController {
  static async getStats(req, res) {
    try {
      // 1. Core catalog and customer counts
      const [bookCount] = await query(`
        SELECT 
          COUNT(*) as count, 
          COALESCE(SUM(quantity), 0) as totalStock, 
          COUNT(CASE WHEN quantity <= 5 THEN 1 END) as lowStock 
        FROM products
      `);
      const [categoryCount] = await query('SELECT COUNT(*) as count FROM categories');
      const [pubCount] = await query('SELECT COUNT(*) as count FROM publications');
      const [customerCount] = await query('SELECT COUNT(*) as count FROM customers');

      // 2. Real Order metrics & revenue breakdown
      const [orderStats] = await query(`
        SELECT 
          COUNT(*) as totalOrders,
          COALESCE(SUM(total), 0) as totalRevenue,
          COALESCE(AVG(total), 0) as avgOrderValue,
          COUNT(CASE WHEN order_status = 'Delivered' THEN 1 END) as deliveredOrders,
          COUNT(CASE WHEN order_status = 'Shipped' THEN 1 END) as shippedOrders,
          COUNT(CASE WHEN order_status = 'Processing' THEN 1 END) as processingOrders,
          COUNT(CASE WHEN order_status = 'Ordered' THEN 1 END) as pendingOrders
        FROM orders
      `);

      // 3. Real Monthly sales chart data (actual months with real store transactions)
      const monthlySql = `
        SELECT 
          DATE_FORMAT(created_at, '%b') as month,
          DATE_FORMAT(created_at, '%b %Y') as month_label,
          MONTH(created_at) as month_num,
          YEAR(created_at) as year,
          COUNT(*) as count,
          COALESCE(SUM(total), 0) as total
        FROM orders
        WHERE created_at IS NOT NULL
        GROUP BY year, month_num, month, month_label
        ORDER BY year ASC, month_num ASC
      `;
      const monthlyRows = await query(monthlySql);

      const chartData = monthlyRows.map((r) => ({
        month: r.month,
        monthLabel: r.month_label,
        orders: Number(r.count),
        revenue: parseFloat(r.total),
        avgTicket: r.count > 0 ? parseFloat((r.total / r.count).toFixed(2)) : 0,
      }));

      // 4. Real Top 5 Best-Selling Books from order_items table
      const topSellingBooks = await query(`
        SELECT 
          oi.product_name,
          COALESCE(SUM(oi.qty), 0) as total_sold,
          COALESCE(SUM(oi.total), 0) as total_revenue
        FROM order_items oi
        WHERE oi.product_name IS NOT NULL AND oi.product_name != ''
        GROUP BY oi.product_name
        ORDER BY total_sold DESC
        LIMIT 5
      `);

      // 5. Recent 8 Orders with real customer details & district/location
      const recentOrders = await query(`
        SELECT 
          o.id, 
          o.order_code, 
          o.total, 
          o.status, 
          o.order_status, 
          o.created_at,
          COALESCE(c.name, 'Customer') as customer_name, 
          COALESCE(c.phone, '-') as customer_phone,
          COALESCE(c.district, c.state, 'AP/TS') as location
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.id DESC
        LIMIT 8
      `);

      return res.json({
        success: true,
        stats: {
          totalBooks: bookCount.count,
          totalStockUnits: Number(bookCount.totalStock),
          lowStockCount: Number(bookCount.lowStock),
          totalCategories: categoryCount.count,
          totalPublications: pubCount.count,
          totalCustomers: customerCount.count,
          totalOrders: orderStats.totalOrders,
          totalRevenue: parseFloat(orderStats.totalRevenue).toFixed(2),
          avgOrderValue: parseFloat(orderStats.avgOrderValue).toFixed(2),
          deliveredOrders: orderStats.deliveredOrders,
          shippedOrders: orderStats.shippedOrders,
          processingOrders: orderStats.processingOrders,
          pendingOrders: orderStats.pendingOrders,
        },
        chartData,
        topSellingBooks,
        recentOrders,
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
    }
  }
}
