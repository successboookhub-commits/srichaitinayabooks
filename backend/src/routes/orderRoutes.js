import express from 'express';
import { OrderController } from '../controllers/orderController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Courier barcode TSV lookup (public / warehouse scanner integration)
router.get('/scan-courier', OrderController.scanCourier);
router.post('/scan-courier', OrderController.processBatchScan);

// Admin order routes (supporting both direct and /admin paths)
router.get('/', verifyAdmin, OrderController.list);
router.get('/admin', verifyAdmin, OrderController.list);

router.get('/labels', verifyAdmin, OrderController.printLabels);
router.get('/admin/labels', verifyAdmin, OrderController.printLabels);

// Export all or filtered orders to Excel / CSV
router.get('/export', verifyAdmin, OrderController.exportOrders);
router.get('/export/excel', verifyAdmin, OrderController.exportOrders);
router.get('/admin/export/excel', verifyAdmin, OrderController.exportOrders);

router.get('/:id', verifyAdmin, OrderController.show);
router.get('/admin/:id', verifyAdmin, OrderController.show);

router.put('/:id/status', verifyAdmin, OrderController.updateStatus);
router.put('/admin/status/:id', verifyAdmin, OrderController.updateStatus);

router.post('/bulk-status', verifyAdmin, OrderController.bulkUpdateStatus);
router.post('/admin/bulk-status', verifyAdmin, OrderController.bulkUpdateStatus);

router.post('/bulk-status-date', verifyAdmin, OrderController.bulkUpdateByDate);
router.post('/bulk-status-by-date', verifyAdmin, OrderController.bulkUpdateByDate);
router.post('/admin/bulk-status-date', verifyAdmin, OrderController.bulkUpdateByDate);
router.post('/admin/bulk-status-by-date', verifyAdmin, OrderController.bulkUpdateByDate);

export default router;
