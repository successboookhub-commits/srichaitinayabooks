import { query } from '../config/db.js';

export class BannerController {
  static async getAll(req, res) {
    try {
      const banners = await query('SELECT * FROM banners ORDER BY id DESC');
      return res.json({ success: true, banners });
    } catch (error) {
      console.error('Fetch banners error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch banners.' });
    }
  }

  static async create(req, res) {
    try {
      const { title } = req.body;
      let imagePath = '';
      if (req.file) {
        imagePath = 'banners/' + req.file.filename;
      }

      if (!imagePath) {
        return res.status(400).json({ success: false, message: 'Banner image is required.' });
      }

      const result = await query(
        'INSERT INTO banners (title, image, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [title || '', imagePath]
      );

      return res.status(201).json({ success: true, message: 'Banner created.', id: result.insertId });
    } catch (error) {
      console.error('Create banner error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create banner.' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await query('DELETE FROM banners WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Banner deleted.' });
    } catch (error) {
      console.error('Delete banner error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete banner.' });
    }
  }
}

