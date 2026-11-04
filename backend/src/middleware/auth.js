import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'srichaitanya_super_secure_jwt_secret_key_2026_xyz');

    const users = await query('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [decoded.id]);
    if (!users.length || users[0].role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

