import express from 'express';
import { CheckoutController } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/totals', CheckoutController.calculateTotals);
router.post('/pay', CheckoutController.createOrder);
router.post('/verify', CheckoutController.verifyPayment);
router.post('/webhook', CheckoutController.webhook);

export default router;

