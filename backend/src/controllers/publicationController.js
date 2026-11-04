import { query } from '../config/db.js';

export class PublicationController {
  static async getAll(req, res) {
    try {
      const publications = await query(`
        SELECT p.id, p.name, COUNT(pr.id) AS product_count 
        FROM publications p 
        LEFT JOIN products pr ON pr.publication_id = p.id AND pr.is_active = 1 
        GROUP BY p.id, p.name 
        ORDER BY p.name ASC
      `);
      return res.json({ success: true, publications });
    } catch (error) {
      console.error('Fetch publications error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch publications.' });
    }
  }

  static async create(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });

      const result = await query(
        'INSERT INTO publications (name, created_at, updated_at) VALUES (?, NOW(), NOW())',
        [name]
      );

      return res.status(201).json({ success: true, message: 'Publication added.', id: result.insertId });
    } catch (error) {
      console.error('Create publication error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create publication.' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: 'Name is required.' });

      await query('UPDATE publications SET name = ?, updated_at = NOW() WHERE id = ?', [name, id]);
      return res.json({ success: true, message: 'Publication updated.' });
    } catch (error) {
      console.error('Update publication error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update publication.' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await query('DELETE FROM publications WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Publication deleted.' });
    } catch (error) {
      console.error('Delete publication error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete publication.' });
    }
  }
}

