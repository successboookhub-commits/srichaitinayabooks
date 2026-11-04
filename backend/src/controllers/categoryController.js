import { query } from '../config/db.js';

export class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await query('SELECT * FROM categories ORDER BY name ASC');
      const prods = await query('SELECT id, category_ids FROM products WHERE is_active = 1');
      
      const countMap = {};
      for (const p of prods) {
        let ids = [];
        try {
          ids = typeof p.category_ids === 'string' ? JSON.parse(p.category_ids || '[]') : (p.category_ids || []);
        } catch (e) {
          ids = String(p.category_ids || '').split(/[\s,]+/).filter(Boolean);
        }
        for (const cid of ids) {
          countMap[String(cid)] = (countMap[String(cid)] || 0) + 1;
        }
      }

      const enriched = categories.map((c) => ({
        ...c,
        product_count: countMap[String(c.id)] || 0,
      }));

      return res.json({ success: true, categories: enriched });
    } catch (error) {
      console.error('Fetch categories error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
    }
  }

  static async create(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const result = await query(
        'INSERT INTO categories (name, slug, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [name, slug]
      );

      return res.status(201).json({ success: true, message: 'Category added.', id: result.insertId });
    } catch (error) {
      console.error('Create category error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create category.' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await query('UPDATE categories SET name = ?, slug = ?, updated_at = NOW() WHERE id = ?', [name, slug, id]);

      return res.json({ success: true, message: 'Category updated.' });
    } catch (error) {
      console.error('Update category error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update category.' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await query('DELETE FROM categories WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Category deleted.' });
    } catch (error) {
      console.error('Delete category error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete category.' });
    }
  }
}

