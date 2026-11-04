import express from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// List categories
router.get('/', CategoryController.getAll);
router.get('/admin', CategoryController.getAll);

// Create category
router.post('/', verifyAdmin, CategoryController.create);
router.post('/admin', verifyAdmin, CategoryController.create);

// Update category
router.put('/:id', verifyAdmin, CategoryController.update);
router.put('/admin/:id', verifyAdmin, CategoryController.update);

// Delete category
router.delete('/:id', verifyAdmin, CategoryController.delete);
router.delete('/admin/:id', verifyAdmin, CategoryController.delete);

export default router;

