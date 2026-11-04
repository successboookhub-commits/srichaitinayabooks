import express from 'express';
import { HomeSectionController } from '../controllers/homeSectionController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', HomeSectionController.getPublicSections);

// Admin
router.get('/admin', verifyAdmin, HomeSectionController.getAdminSections);
router.put('/admin/settings', verifyAdmin, HomeSectionController.updateSettings);
router.post('/admin/settings', verifyAdmin, HomeSectionController.updateSettings);
router.post('/admin', verifyAdmin, HomeSectionController.create);
router.put('/admin/:id', verifyAdmin, HomeSectionController.update);
router.delete('/admin/:id', verifyAdmin, HomeSectionController.delete);
router.post('/admin/reorder', verifyAdmin, HomeSectionController.reorder);

export default router;

