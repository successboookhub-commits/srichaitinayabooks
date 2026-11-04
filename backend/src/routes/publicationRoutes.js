import express from 'express';
import { PublicationController } from '../controllers/publicationController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// List publications
router.get('/', PublicationController.getAll);
router.get('/admin', PublicationController.getAll);

// Create publication
router.post('/', verifyAdmin, PublicationController.create);
router.post('/admin', verifyAdmin, PublicationController.create);

// Update publication
router.put('/:id', verifyAdmin, PublicationController.update);
router.put('/admin/:id', verifyAdmin, PublicationController.update);

// Delete publication
router.delete('/:id', verifyAdmin, PublicationController.delete);
router.delete('/admin/:id', verifyAdmin, PublicationController.delete);

export default router;

