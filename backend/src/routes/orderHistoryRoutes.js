import express from 'express';
import { OrderHistoryController } from '../controllers/orderHistoryController.js';

const router = express.Router();

router.get('/lookup', OrderHistoryController.lookup);
router.get('/orders', OrderHistoryController.lookup);
router.get('/detail/:orderCode', OrderHistoryController.getDetails);
router.get('/invoice/:orderCode', OrderHistoryController.downloadInvoice);

export default router;
