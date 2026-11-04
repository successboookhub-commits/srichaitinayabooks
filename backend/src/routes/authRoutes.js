import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public auth
router.post('/login', AuthController.login);

// Protected admin profile & self-management
router.get('/me', verifyAdmin, AuthController.me);
router.put('/profile', verifyAdmin, AuthController.updateProfile);

// Protected admin user management (CRUD)
router.get('/admins', verifyAdmin, AuthController.getAdmins);
router.post('/admins', verifyAdmin, AuthController.createAdmin);
router.put('/admins/:id', verifyAdmin, AuthController.updateAdmin);
router.delete('/admins/:id', verifyAdmin, AuthController.deleteAdmin);

export default router;
