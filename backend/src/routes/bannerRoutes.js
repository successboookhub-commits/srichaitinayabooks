import express from 'express';
import { BannerController } from '../controllers/bannerController.js';
import { verifyAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// List banners
router.get('/', BannerController.getAll);
router.get('/admin', BannerController.getAll);

// Create banner
router.post('/', verifyAdmin, upload.single('image'), BannerController.create);
router.post('/admin', verifyAdmin, upload.single('image'), BannerController.create);

// Delete banner
router.delete('/:id', verifyAdmin, BannerController.delete);
router.delete('/admin/:id', verifyAdmin, BannerController.delete);

export default router;

