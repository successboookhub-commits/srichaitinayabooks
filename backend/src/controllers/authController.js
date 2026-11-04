import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export class AuthController {
  /**
   * Admin Login with email & password
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.trim().toLowerCase()]);
      if (!users.length) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const user = users[0];

      // Replace Laravel $2y$ prefix with $2a$ if needed for bcryptjs compatibility
      const fixedHash = user.password.replace(/^\$2y\$/, '$2a$');
      const isMatch = await bcrypt.compare(password, fixedHash);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'srichaitanya_super_secure_jwt_secret_key_2026_xyz',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  /**
   * Get current authenticated admin details
   */
  static async me(req, res) {
    try {
      const users = await query(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
        [req.user.id]
      );
      if (!users.length) {
        return res.status(404).json({ success: false, message: 'Admin not found.' });
      }
      return res.json({
        success: true,
        user: users[0],
      });
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  /**
   * Update current authenticated admin's own profile (Name, Email, Password)
   */
  static async updateProfile(req, res) {
    try {
      const { name, email, password, currentPassword } = req.body;
      const adminId = req.user.id;

      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required.' });
      }

      // Check if new email is taken by another user
      const existing = await query('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1', [
        email.trim().toLowerCase(),
        adminId,
      ]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: 'This email is already in use by another account.' });
      }

      // If updating password, optionally verify current password
      if (password && password.trim().length > 0) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
        }

        if (currentPassword) {
          const [currentUser] = await query('SELECT password FROM users WHERE id = ? LIMIT 1', [adminId]);
          if (currentUser) {
            const fixedHash = currentUser.password.replace(/^\$2y\$/, '$2a$');
            const isMatch = await bcrypt.compare(currentPassword, fixedHash);
            if (!isMatch) {
              return res.status(400).json({ success: false, message: 'Current password does not match.' });
            }
          }
        }

        const newHash = await bcrypt.hash(password, 10);
        await query(
          'UPDATE users SET name = ?, email = ?, password = ?, updated_at = NOW() WHERE id = ?',
          [name.trim(), email.trim().toLowerCase(), newHash, adminId]
        );
      } else {
        await query(
          'UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?',
          [name.trim(), email.trim().toLowerCase(), adminId]
        );
      }

      const [updatedUser] = await query(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
        [adminId]
      );

      // Sign fresh token with updated info
      const token = jwt.sign(
        { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
        process.env.JWT_SECRET || 'srichaitanya_super_secure_jwt_secret_key_2026_xyz',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        token,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  /**
   * Get all registered Admin users
   */
  static async getAdmins(req, res) {
    try {
      const admins = await query(
        "SELECT id, name, email, role, created_at, updated_at FROM users WHERE role = 'admin' ORDER BY id ASC"
      );
      return res.json({
        success: true,
        admins,
      });
    } catch (error) {
      console.error('Error fetching admins:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  /**
   * Create a new Admin user
   */
  static async createAdmin(req, res) {
    try {
      const { name, email, password, role = 'admin' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Full name, valid email, and initial password are required.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.',
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if email already registered
      const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'An administrator or user with this email already exists.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await query(
        'INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [name.trim(), normalizedEmail, hashedPassword, role || 'admin']
      );

      const [newAdmin] = await query(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: `Administrator "${name}" created successfully.`,
        admin: newAdmin,
      });
    } catch (error) {
      console.error('Create admin error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  /**
   * Update an existing Admin (Name, Email, Role, or reset Password)
   */
  static async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, role = 'admin' } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required.' });
      }

      const targetId = Number(id);
      const [targetAdmin] = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [targetId]);
      if (!targetAdmin) {
        return res.status(404).json({ success: false, message: 'Administrator not found.' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check email collision
      const collision = await query('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1', [
        normalizedEmail,
        targetId,
      ]);
      if (collision.length > 0) {
        return res.status(409).json({ success: false, message: 'This email is already in use by another user.' });
      }

      if (password && password.trim().length > 0) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await query(
          'UPDATE users SET name = ?, email = ?, password = ?, role = ?, updated_at = NOW() WHERE id = ?',
          [name.trim(), normalizedEmail, hashedPassword, role || 'admin', targetId]
        );
      } else {
        await query(
          'UPDATE users SET name = ?, email = ?, role = ?, updated_at = NOW() WHERE id = ?',
          [name.trim(), normalizedEmail, role || 'admin', targetId]
        );
      }

      const [updated] = await query(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
        [targetId]
      );

      return res.json({
        success: true,
        message: `Administrator "${name}" updated successfully.`,
        admin: updated,
      });
    } catch (error) {
      console.error('Update admin error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }

  /**
   * Delete an Admin user
   */
  static async deleteAdmin(req, res) {
    try {
      const { id } = req.params;
      const targetId = Number(id);

      if (req.user.id === targetId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot delete your own active administrator account.',
        });
      }

      const [target] = await query('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [targetId]);
      if (!target) {
        return res.status(404).json({ success: false, message: 'Administrator not found.' });
      }

      // Ensure at least one admin remains in system
      const adminCount = await query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
      if (adminCount[0].count <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only remaining administrator in the system.',
        });
      }

      await query('DELETE FROM users WHERE id = ?', [targetId]);

      return res.json({
        success: true,
        message: `Administrator "${target.name}" (${target.email}) deleted successfully.`,
      });
    } catch (error) {
      console.error('Delete admin error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
}
