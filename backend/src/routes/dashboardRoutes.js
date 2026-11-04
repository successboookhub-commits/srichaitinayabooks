import express from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', verifyAdmin, DashboardController.getStats);

export default router;

