import { query } from '../config/db.js';

export class HomeSectionController {
  // Helper: Get all store settings as key-value map
  static async getSettingsMap() {
    try {
      const rows = await query('SELECT setting_key, setting_value FROM store_settings');
      const map = {
        show_category_showcase: '1',
        show_publication_showcase: '1',
        category_showcase_limit: '8',
        publication_showcase_limit: '8',
        category_showcase_title: 'Books by Exam Category',
        publication_showcase_title: 'Books by Leading Publishers',
      };
      rows.forEach((r) => {
        map[r.setting_key] = r.setting_value;
      });
      return map;
    } catch (e) {
      return {
        show_category_showcase: '1',
        show_publication_showcase: '1',
        category_showcase_limit: '8',
        publication_showcase_limit: '8',
      };
    }
  }

  // Public: Get all active home sections, plus category & publication showcases if enabled
  static async getPublicSections(req, res) {
    try {
      const settings = await HomeSectionController.getSettingsMap();
      const showCategories = settings.show_category_showcase === '1';
      const showPublications = settings.show_publication_showcase === '1';
      const catLimit = parseInt(settings.category_showcase_limit) || 8;
      const pubLimit = parseInt(settings.publication_showcase_limit) || 8;

      // 1. Fetch custom sections from home_sections
      const customSectionsRows = await query(`
        SELECT * FROM home_sections 
        WHERE is_active = 1 
        ORDER BY display_order ASC, id ASC
      `);

      const allCustomProductIds = new Set();
      const parsedCustomSections = customSectionsRows.map((s) => {
        let pids = [];
        try {
          pids = typeof s.product_ids === 'string' ? JSON.parse(s.product_ids || '[]') : (s.product_ids || []);
        } catch (e) {
          pids = String(s.product_ids || '').split(/[\s,]+/).map(Number).filter(Boolean);
        }
        pids.forEach((id) => allCustomProductIds.add(Number(id)));
        return { ...s, product_ids: pids };
      });

      // 2. Fetch custom section products
      let customProductsMap = {};
      if (allCustomProductIds.size > 0) {
        const idList = Array.from(allCustomProductIds);
        const placeholders = idList.map(() => '?').join(',');
        const products = await query(
          `SELECT p.*, pub.name as publication_name 
           FROM products p 
           LEFT JOIN publications pub ON p.publication_id = pub.id 
           WHERE p.id IN (${placeholders}) AND p.is_active = 1`,
          idList
        );

        products.forEach((p) => {
          let catIds = [];
          try {
            catIds = typeof p.category_ids === 'string' ? JSON.parse(p.category_ids || '[]') : (p.category_ids || []);
          } catch (e) {
            catIds = [];
          }
          customProductsMap[p.id] = {
            ...p,
            title: p.name || p.title,
            price: p.total_price || p.price,
            stock: p.quantity !== undefined ? p.quantity : p.stock,
            image: p.main_photo || p.image,
            category_ids: catIds,
          };
        });
      }

      const populatedCustomSections = parsedCustomSections.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        display_order: s.display_order,
        product_ids: s.product_ids,
        products: s.product_ids.map((id) => customProductsMap[id]).filter(Boolean),
      }));

      // 3. Build Category Showcase if enabled
      let categorySections = [];
      let publicationSections = [];

      if (showCategories || showPublications) {
        // Fetch active products with basic fields for showcase
        const allActiveProducts = await query(`
          SELECT p.id, p.name, p.total_price, p.old_price, p.discount, p.main_photo, p.quantity, p.publication_id, p.category_ids, pub.name as publication_name
          FROM products p
          LEFT JOIN publications pub ON p.publication_id = pub.id
          WHERE p.is_active = 1
          ORDER BY p.id DESC
        `);

        // Categories
        if (showCategories) {
          const allCats = await query('SELECT id, name FROM categories ORDER BY name ASC');
          const catMap = {};
          allCats.forEach((c) => {
            catMap[c.id] = [];
          });

          for (const p of allActiveProducts) {
            let cids = [];
            try {
              cids = typeof p.category_ids === 'string' ? JSON.parse(p.category_ids || '[]') : (p.category_ids || []);
            } catch (e) {
              cids = String(p.category_ids || '').split(/[\s,]+/).filter(Boolean);
            }
            const prodObj = {
              id: p.id,
              title: p.name,
              price: p.total_price,
              old_price: p.old_price,
              discount: p.discount,
              image: p.main_photo,
              stock: p.quantity,
              publication_name: p.publication_name,
            };

            for (const cid of cids) {
              if (catMap[cid] && catMap[cid].length < catLimit) {
                catMap[cid].push(prodObj);
              }
            }
          }

          categorySections = allCats
            .filter((c) => catMap[c.id] && catMap[c.id].length > 0)
            .map((c) => ({
              id: c.id,
              name: c.name,
              total_books: catMap[c.id].length,
              products: catMap[c.id],
            }));
        }

        // Publications
        if (showPublications) {
          const pubMap = {};
          for (const p of allActiveProducts) {
            if (!p.publication_id) continue;
            if (!pubMap[p.publication_id]) {
              pubMap[p.publication_id] = {
                name: p.publication_name || 'Publisher Books',
                products: [],
              };
            }
            if (pubMap[p.publication_id].products.length < pubLimit) {
              pubMap[p.publication_id].products.push({
                id: p.id,
                title: p.name,
                price: p.total_price,
                old_price: p.old_price,
                discount: p.discount,
                image: p.main_photo,
                stock: p.quantity,
                publication_name: p.publication_name,
              });
            }
          }

          publicationSections = Object.entries(pubMap)
            .filter(([_, pubData]) => pubData.products.length > 0)
            .map(([pubId, pubData]) => ({
              id: Number(pubId),
              name: pubData.name,
              total_books: pubData.products.length,
              products: pubData.products,
            }));
        }
      }

      return res.json({
        success: true,
        sections: populatedCustomSections,
        categorySections,
        publicationSections,
        settings: {
          show_category_showcase: showCategories,
          show_publication_showcase: showPublications,
          category_showcase_limit: catLimit,
          publication_showcase_limit: pubLimit,
        },
      });
    } catch (error) {
      console.error('Error fetching home sections:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch home sections.' });
    }
  }

  // Admin: Get all sections with book previews and current showcase toggles
  static async getAdminSections(req, res) {
    try {
      const settings = await HomeSectionController.getSettingsMap();

      const sections = await query(`
        SELECT * FROM home_sections 
        ORDER BY display_order ASC, id ASC
      `);

      const allProductIds = new Set();
      const parsedSections = sections.map((s) => {
        let pids = [];
        try {
          pids = typeof s.product_ids === 'string' ? JSON.parse(s.product_ids || '[]') : (s.product_ids || []);
        } catch (e) {
          pids = String(s.product_ids || '').split(/[\s,]+/).map(Number).filter(Boolean);
        }
        pids.forEach((id) => allProductIds.add(Number(id)));
        return { ...s, product_ids: pids };
      });

      let productsMap = {};
      if (allProductIds.size > 0) {
        const idList = Array.from(allProductIds);
        const placeholders = idList.map(() => '?').join(',');
        const products = await query(
          `SELECT p.id, p.name, p.total_price, p.main_photo, pub.name as publication_name 
           FROM products p 
           LEFT JOIN publications pub ON p.publication_id = pub.id 
           WHERE p.id IN (${placeholders})`,
          idList
        );

        products.forEach((p) => {
          productsMap[p.id] = {
            id: p.id,
            name: p.name,
            total_price: p.total_price,
            main_photo: p.main_photo,
            publication_name: p.publication_name,
          };
        });
      }

      const enriched = parsedSections.map((s) => ({
        ...s,
        previewProducts: s.product_ids.map((id) => productsMap[id]).filter(Boolean),
      }));

      return res.json({
        success: true,
        sections: enriched,
        settings: {
          show_category_showcase: settings.show_category_showcase === '1',
          show_publication_showcase: settings.show_publication_showcase === '1',
          category_showcase_limit: parseInt(settings.category_showcase_limit) || 8,
          publication_showcase_limit: parseInt(settings.publication_showcase_limit) || 8,
        },
      });
    } catch (error) {
      console.error('Admin get sections error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load home sections.' });
    }
  }

  // Admin: Update showcase settings (toggles for category/publication showcase)
  static async updateSettings(req, res) {
    try {
      const { show_category_showcase, show_publication_showcase, category_showcase_limit, publication_showcase_limit } = req.body;

      const updates = [];
      if (show_category_showcase !== undefined) {
        updates.push(['show_category_showcase', show_category_showcase ? '1' : '0']);
      }
      if (show_publication_showcase !== undefined) {
        updates.push(['show_publication_showcase', show_publication_showcase ? '1' : '0']);
      }
      if (category_showcase_limit !== undefined) {
        updates.push(['category_showcase_limit', String(category_showcase_limit)]);
      }
      if (publication_showcase_limit !== undefined) {
        updates.push(['publication_showcase_limit', String(publication_showcase_limit)]);
      }

      for (const [key, val] of updates) {
        await query(
          `INSERT INTO store_settings (setting_key, setting_value) 
           VALUES (?, ?) 
           ON DUPLICATE KEY UPDATE setting_value = ?`,
          [key, val, val]
        );
      }

      return res.json({ success: true, message: 'Homepage showcase settings updated successfully.' });
    } catch (error) {
      console.error('Update settings error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update showcase settings.' });
    }
  }

  // Admin: Create new home section
  static async create(req, res) {
    try {
      const { title, subtitle, product_ids, display_order = 0, is_active = 1 } = req.body;
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Section title is required.' });
      }

      let parsedIds = [];
      if (Array.isArray(product_ids)) {
        parsedIds = product_ids.map(Number).filter(Boolean);
      } else if (typeof product_ids === 'string') {
        try {
          parsedIds = JSON.parse(product_ids).map(Number).filter(Boolean);
        } catch (e) {
          parsedIds = product_ids.split(/[\s,]+/).map(Number).filter(Boolean);
        }
      }

      const result = await query(
        `INSERT INTO home_sections (title, subtitle, product_ids, display_order, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [title.trim(), subtitle ? subtitle.trim() : '', JSON.stringify(parsedIds), Number(display_order) || 0, is_active ? 1 : 0]
      );

      return res.status(201).json({
        success: true,
        message: 'Home section created successfully.',
        id: result.insertId,
      });
    } catch (error) {
      console.error('Create home section error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create home section.' });
    }
  }

  // Admin: Update section
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, subtitle, product_ids, display_order, is_active } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Section title is required.' });
      }

      let parsedIds = [];
      if (Array.isArray(product_ids)) {
        parsedIds = product_ids.map(Number).filter(Boolean);
      } else if (typeof product_ids === 'string') {
        try {
          parsedIds = JSON.parse(product_ids).map(Number).filter(Boolean);
        } catch (e) {
          parsedIds = product_ids.split(/[\s,]+/).map(Number).filter(Boolean);
        }
      }

      await query(
        `UPDATE home_sections 
         SET title = ?, subtitle = ?, product_ids = ?, display_order = ?, is_active = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          title.trim(),
          subtitle !== undefined ? subtitle.trim() : '',
          JSON.stringify(parsedIds),
          display_order !== undefined ? Number(display_order) : 0,
          is_active !== undefined ? (is_active ? 1 : 0) : 1,
          id,
        ]
      );

      return res.json({ success: true, message: 'Home section updated successfully.' });
    } catch (error) {
      console.error('Update home section error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update home section.' });
    }
  }

  // Admin: Delete section
  static async delete(req, res) {
    try {
      const { id } = req.params;
      await query('DELETE FROM home_sections WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Home section deleted.' });
    } catch (error) {
      console.error('Delete home section error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete home section.' });
    }
  }

  // Admin: Reorder sections
  static async reorder(req, res) {
    try {
      const { orders } = req.body;
      if (!Array.isArray(orders)) {
        return res.status(400).json({ success: false, message: 'Invalid orders array.' });
      }

      for (const item of orders) {
        if (item.id !== undefined && item.display_order !== undefined) {
          await query('UPDATE home_sections SET display_order = ? WHERE id = ?', [Number(item.display_order), item.id]);
        }
      }

      return res.json({ success: true, message: 'Home sections reordered successfully.' });
    } catch (error) {
      console.error('Reorder home sections error:', error);
      return res.status(500).json({ success: false, message: 'Failed to reorder home sections.' });
    }
  }
}
