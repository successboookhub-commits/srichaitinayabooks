import express from 'express';
import { ProductController } from '../controllers/productController.js';
import { verifyAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public
router.get('/', ProductController.getAll);
router.get('/suggest', ProductController.searchSuggest);
router.get('/detail/:slug', ProductController.getBySlug);

// Admin Export Products to Excel
router.get('/export', verifyAdmin, ProductController.exportProducts);
router.get('/admin/export', verifyAdmin, ProductController.exportProducts);

// Admin Routes (supporting both /admin and direct paths)
router.get('/admin', verifyAdmin, ProductController.adminList);
router.get('/admin/list', verifyAdmin, ProductController.adminList);
router.post(
  '/',
  verifyAdmin,
  upload.fields([
    { name: 'main_photo', maxCount: 1 },
    { name: 'related_photos', maxCount: 6 },
    { name: 'image', maxCount: 1 },
  ]),
  ProductController.create
);
router.post(
  '/admin',
  verifyAdmin,
  upload.fields([
    { name: 'main_photo', maxCount: 1 },
    { name: 'related_photos', maxCount: 6 },
    { name: 'image', maxCount: 1 },
  ]),
  ProductController.create
);
router.put(
  '/:id',
  verifyAdmin,
  upload.fields([
    { name: 'main_photo', maxCount: 1 },
    { name: 'related_photos', maxCount: 6 },
    { name: 'image', maxCount: 1 },
  ]),
  ProductController.update
);
router.put(
  '/admin/:id',
  verifyAdmin,
  upload.fields([
    { name: 'main_photo', maxCount: 1 },
    { name: 'related_photos', maxCount: 6 },
    { name: 'image', maxCount: 1 },
  ]),
  ProductController.update
);
router.delete('/:id', verifyAdmin, ProductController.delete);
router.delete('/admin/:id', verifyAdmin, ProductController.delete);

// Catch-all public product detail by slug or id (must be last route)
router.get('/:slug', ProductController.getBySlug);

export default router;
