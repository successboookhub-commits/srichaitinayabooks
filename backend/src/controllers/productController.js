import { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { performSmartProductSearch } from '../utils/searchHelper.js';

export class ProductController {
  // Public: Get all active products with optional category, search, and publication filters
  static async getAll(req, res) {
    try {
      const { category_id, publication_id, search, featured, limit } = req.query;

      let products;

      if (search && search.trim()) {
        const result = await performSmartProductSearch({
          search,
          category_id,
          publication_id,
          featured,
          limit,
        });
        products = result.products;
      } else {
        let sql = 'SELECT * FROM products WHERE is_active = 1';
        const params = [];

        if (category_id) {
          const catList = String(category_id).split(',').map((s) => s.trim()).filter(Boolean);
          if (catList.length === 1) {
            sql += ' AND JSON_CONTAINS(category_ids, JSON_QUOTE(?))';
            params.push(catList[0]);
          } else if (catList.length > 1) {
            const clauses = catList.map(() => 'JSON_CONTAINS(category_ids, JSON_QUOTE(?))').join(' OR ');
            sql += ` AND (${clauses})`;
            params.push(...catList);
          }
        }

        if (publication_id) {
          sql += ' AND publication_id = ?';
          params.push(Number(publication_id));
        }

        if (featured === 'true' || featured === '1') {
          sql += ' AND is_featured = 1';
        }

        sql += ' ORDER BY id DESC';

        if (limit) {
          sql += ' LIMIT ?';
          params.push(Number(limit));
        }

        products = await query(sql, params);
      }

      // Parse category_ids and related_photos, and normalize fields for both storefront & admin
      const formatted = products.map((p) => {
        let parsedCategoryIds = [];
        if (typeof p.category_ids === 'string') {
          try {
            parsedCategoryIds = JSON.parse(p.category_ids);
          } catch (e) {
            parsedCategoryIds = p.category_ids.split(/[\s,]+/).filter(Boolean);
          }
        } else if (Array.isArray(p.category_ids)) {
          parsedCategoryIds = p.category_ids;
        }

        let parsedPhotos = [];
        if (typeof p.related_photos === 'string') {
          try {
            parsedPhotos = JSON.parse(p.related_photos);
          } catch (e) {
            parsedPhotos = p.related_photos.split(/[\s,]+/).filter(Boolean);
          }
        } else if (Array.isArray(p.related_photos)) {
          parsedPhotos = p.related_photos;
        }

        return {
          ...p,
          title: p.name || p.title,
          price: p.total_price || p.price,
          stock: p.quantity !== undefined ? p.quantity : p.stock,
          image: p.main_photo || p.image,
          category_ids: parsedCategoryIds,
          related_photos: parsedPhotos,
        };
      });

      return res.json({ success: true, count: formatted.length, products: formatted });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch products.' });
    }
  }

  // Public: Get single product by slug or id
  static async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      const products = await query(
        `SELECT p.*, pub.name as publication_name 
         FROM products p 
         LEFT JOIN publications pub ON p.publication_id = pub.id 
         WHERE (p.slug = ? OR p.id = ?) AND p.is_active = 1 LIMIT 1`,
        [slug, isNaN(slug) ? 0 : Number(slug)]
      );

      if (!products.length) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      const product = products[0];
      let categoryIds = [];
      if (typeof product.category_ids === 'string') {
        try {
          categoryIds = JSON.parse(product.category_ids);
        } catch (e) {
          categoryIds = product.category_ids.split(/[\s,]+/).filter(Boolean);
        }
      } else if (Array.isArray(product.category_ids)) {
        categoryIds = product.category_ids;
      }

      let relatedPhotos = [];
      if (typeof product.related_photos === 'string') {
        try {
          relatedPhotos = JSON.parse(product.related_photos);
        } catch (e) {
          relatedPhotos = product.related_photos.split(/[\s,]+/).filter(Boolean);
        }
      } else if (Array.isArray(product.related_photos)) {
        relatedPhotos = product.related_photos;
      }

      const formattedProduct = {
        ...product,
        title: product.name || product.title,
        price: product.total_price || product.price,
        stock: product.quantity !== undefined ? product.quantity : product.stock,
        image: product.main_photo || product.image,
        category_ids: categoryIds,
        related_photos: relatedPhotos,
      };

      // Fetch related products sharing categories
      let relatedProducts = [];
      if (categoryIds.length > 0) {
        const catConditions = categoryIds.map(() => 'JSON_CONTAINS(category_ids, JSON_QUOTE(?))').join(' OR ');
        const relatedSql = `SELECT id, name, slug, total_price, old_price, discount, main_photo, is_weightless, quantity 
                            FROM products 
                            WHERE is_active = 1 AND id != ? AND (${catConditions}) 
                            LIMIT 8`;
        try {
          relatedProducts = await query(relatedSql, [product.id, ...categoryIds.map(String)]);
        } catch (e) {
          relatedProducts = [];
        }
      }

      return res.json({
        success: true,
        product: formattedProduct,
        relatedProducts,
      });
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch product.' });
    }
  }

  // Public: Search suggestions dropdown
  static async searchSuggest(req, res) {
    try {
      const q = (req.query.q || '').trim();
      if (q.length < 2) {
        return res.json({ success: true, results: [] });
      }

      const { products } = await performSmartProductSearch({ search: q, limit: 6 });
      const results = products.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        main_photo: item.main_photo,
        total_price: item.total_price,
        actual_price: item.old_price,
      }));

      return res.json({ success: true, results });
    } catch (error) {
      console.error('Search suggest error:', error);
      return res.status(500).json({ success: false, message: 'Search failed.' });
    }
  }

  // Admin: Get all products (with pagination, filters & comprehensive search)
  static async adminList(req, res) {
    try {
      const { search, publication_id, category_id, is_featured, stock_status, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let whereClause = ' WHERE 1=1';
      const params = [];

      if (publication_id) {
        whereClause += ' AND p.publication_id = ?';
        params.push(publication_id);
      }

      if (category_id) {
        whereClause += ' AND ((JSON_VALID(p.category_ids) AND JSON_CONTAINS(p.category_ids, JSON_QUOTE(?))) OR p.category_ids LIKE ?)';
        params.push(String(category_id), `%"${category_id}"%`);
      }

      if (is_featured !== undefined && is_featured !== '') {
        whereClause += ' AND p.is_featured = ?';
        params.push(Number(is_featured));
      }

      if (stock_status === 'in_stock') {
        whereClause += ' AND p.quantity > 0';
      } else if (stock_status === 'out_of_stock') {
        whereClause += ' AND (p.quantity <= 0 OR p.quantity IS NULL)';
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        whereClause += ' AND (p.name LIKE ? OR p.id = ? OR pub.name LIKE ? OR p.description LIKE ?)';
        params.push(term, isNaN(search.trim()) ? 0 : Number(search.trim()), term, term);
      }

      const joinSql = 'FROM products p LEFT JOIN publications pub ON p.publication_id = pub.id';
      const countSql = `SELECT COUNT(*) as total ${joinSql} ${whereClause}`;
      const totalResult = await query(countSql, params);
      const total = totalResult[0]?.total || 0;

      const sql = `
        SELECT p.*, pub.name as publication_name
        ${joinSql}
        ${whereClause}
        ORDER BY p.id DESC
        LIMIT ? OFFSET ?
      `;

      const products = await query(sql, [...params, Number(limit), offset]);

      const formatted = products.map((p) => {
        let catIds = [];
        try {
          catIds = typeof p.category_ids === 'string' ? JSON.parse(p.category_ids || '[]') : (p.category_ids || []);
        } catch (e) {
          catIds = String(p.category_ids || '').split(/[\s,]+/).filter(Boolean);
        }
        let relPhotos = [];
        try {
          relPhotos = typeof p.related_photos === 'string' ? JSON.parse(p.related_photos || '[]') : (p.related_photos || []);
        } catch (e) {
          relPhotos = [];
        }
        return {
          ...p,
          category_ids: catIds,
          related_photos: relPhotos,
        };
      });

      return res.json({
        success: true,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        products: formatted,
      });
    } catch (error) {
      console.error('Admin product list error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch admin products.' });
    }
  }

  // Admin: Export all or filtered products to Excel / CSV with single click
  static async exportProducts(req, res) {
    try {
      const { search, publication_id, category_id, is_featured, stock_status } = req.query;

      let whereClause = ' WHERE 1=1';
      const params = [];

      if (publication_id) {
        whereClause += ' AND p.publication_id = ?';
        params.push(publication_id);
      }

      if (category_id) {
        whereClause += ' AND ((JSON_VALID(p.category_ids) AND JSON_CONTAINS(p.category_ids, JSON_QUOTE(?))) OR p.category_ids LIKE ?)';
        params.push(String(category_id), `%"${category_id}"%`);
      }

      if (is_featured !== undefined && is_featured !== '') {
        whereClause += ' AND p.is_featured = ?';
        params.push(Number(is_featured));
      }

      if (stock_status === 'in_stock') {
        whereClause += ' AND p.quantity > 0';
      } else if (stock_status === 'out_of_stock') {
        whereClause += ' AND (p.quantity <= 0 OR p.quantity IS NULL)';
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        whereClause += ' AND (p.name LIKE ? OR p.id = ? OR pub.name LIKE ? OR p.description LIKE ?)';
        params.push(term, isNaN(search.trim()) ? 0 : Number(search.trim()), term, term);
      }

      const sql = `
        SELECT p.*, pub.name as publication_name
        FROM products p
        LEFT JOIN publications pub ON p.publication_id = pub.id
        ${whereClause}
        ORDER BY p.id DESC
      `;

      const products = await query(sql, params);

      if (!products.length) {
        return res.status(404).json({ success: false, message: 'No products found to export.' });
      }

      // Fetch all category names mapping
      const allCategories = await query('SELECT id, name FROM categories');
      const catMap = {};
      allCategories.forEach((c) => {
        catMap[c.id] = c.name;
      });

      const cleanCsv = (val) => {
        if (val === null || val === undefined) return '';
        let str = String(val).replace(/[\r\n\t]+/g, ' ').trim();
        return str.replace(/"/g, '""');
      };

      const nowStr = new Date().toISOString().split('T')[0];
      const filename = `SriChaitanya_Book_Catalog_${nowStr}`;

      const headers = [
        'S.No',
        'Book ID',
        'Book Title',
        'Publication / Publisher',
        'Categories',
        'MRP (Rs)',
        'Discount (%)',
        'Selling Price (Rs)',
        'Inventory Stock',
        'Stock Status',
        'Weight (KG)',
        'Weightless Rule',
        'Shipping Fee (Rs)',
        'Is Featured',
        'Store Status',
        'Created Date',
      ];

      const rows = [headers.map((h) => `"${h}"`).join(',')];

      products.forEach((p, index) => {
        let catIds = [];
        try {
          catIds = typeof p.category_ids === 'string' ? JSON.parse(p.category_ids || '[]') : (p.category_ids || []);
        } catch (e) {
          catIds = String(p.category_ids || '').split(/[\s,]+/).filter(Boolean);
        }
        const categoryNames = catIds.map((id) => catMap[id] || `#${id}`).join(' | ');

        const mrp = p.old_price ? parseFloat(p.old_price).toFixed(2) : parseFloat(p.total_price || 0).toFixed(2);
        const discount = p.discount ? parseFloat(p.discount).toFixed(0) : '0';
        const price = parseFloat(p.total_price || p.price || 0).toFixed(2);
        const stock = p.quantity !== undefined ? p.quantity : (p.stock || 0);
        const stockStatus = stock > 0 ? 'In Stock' : 'Out of Stock';
        const isWeightless = Boolean(p.is_weightless);
        const weight = isWeightless ? '0.00' : (p.weight ? parseFloat(p.weight).toFixed(2) : '0.50');
        const weightlessRule = isWeightless ? 'Weight Less (Flat ₹40)' : 'Standard (₹70/kg)';
        const shipFee = parseFloat(p.shipping_charge || (isWeightless ? 40 : 35)).toFixed(2);
        const createdDate = p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : '-';

        const row = [
          index + 1,
          p.id,
          `"${cleanCsv(p.name || p.title)}"`,
          `"${cleanCsv(p.publication_name || '-')}"`,
          `"${cleanCsv(categoryNames || '-')}"`,
          mrp,
          discount,
          price,
          stock,
          `"${stockStatus}"`,
          weight,
          `"${weightlessRule}"`,
          shipFee,
          p.is_featured ? '"Yes"' : '"No"',
          p.is_active !== 0 ? '"Active"' : '"Draft"',
          `"${createdDate}"`,
        ];

        rows.push(row.join(','));
      });

      const csvContent = '\uFEFF' + rows.join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.status(200).send(csvContent);
    } catch (error) {
      console.error('Export products error:', error);
      return res.status(500).json({ success: false, message: 'Failed to export products.' });
    }
  }

  // Admin: Create product
  static async create(req, res) {
    try {
      const {
        name,
        publication_id,
        old_price,
        discount,
        total_price,
        quantity,
        weight_type,
        weight,
        shipping_charge,
        description,
        category_ids,
        is_featured,
        is_active,
      } = req.body;

      if (!name || !total_price) {
        return res.status(400).json({ success: false, message: 'Name and total price are required.' });
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
      const isWeightless = weight_type === 'weightless';

      let mainPhotoPath = '';
      if (req.files?.main_photo?.[0]) {
        mainPhotoPath = 'products/' + req.files.main_photo[0].filename;
      }

      const relatedPhotos = [];
      if (req.files?.related_photos) {
        req.files.related_photos.forEach((f) => relatedPhotos.push('products/' + f.filename));
      }

      const parsedCategoryIds = typeof category_ids === 'string' ? JSON.parse(category_ids) : (category_ids || []);

      const result = await query(
        `INSERT INTO products (
          name, slug, publication_id, old_price, discount, total_price, quantity,
          weight, is_weightless, shipping_charge, main_photo, related_photos,
          description, category_ids, is_featured, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          name,
          slug,
          publication_id ? Number(publication_id) : null,
          old_price ? parseFloat(old_price) : 0,
          discount ? parseFloat(discount) : 0,
          parseFloat(total_price),
          parseInt(quantity || 1, 10),
          isWeightless ? null : (weight ? parseFloat(weight) : 0),
          isWeightless ? 1 : 0,
          shipping_charge ? parseFloat(shipping_charge) : 0,
          mainPhotoPath,
          JSON.stringify(relatedPhotos),
          description || '',
          JSON.stringify(parsedCategoryIds.map(Number)),
          is_featured ? 1 : 0,
          is_active !== undefined ? (is_active ? 1 : 0) : 1,
        ]
      );

      return res.status(201).json({ success: true, message: 'Product created successfully.', id: result.insertId });
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ success: false, message: 'Failed to create product.' });
    }
  }

  // Admin: Update product
  static async update(req, res) {
    try {
      const { id } = req.params;
      const existing = await query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
      if (!existing.length) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      const current = existing[0];
      const {
        name,
        publication_id,
        old_price,
        discount,
        total_price,
        quantity,
        weight_type,
        weight,
        shipping_charge,
        description,
        category_ids,
        is_featured,
        is_active,
      } = req.body;

      const isWeightless = weight_type ? (weight_type === 'weightless') : Boolean(current.is_weightless);

      let mainPhotoPath = current.main_photo;
      if (req.files?.main_photo?.[0]) {
        mainPhotoPath = 'products/' + req.files.main_photo[0].filename;
      }

      let relatedPhotos = typeof current.related_photos === 'string' ? JSON.parse(current.related_photos || '[]') : (current.related_photos || []);
      if (req.files?.related_photos) {
        req.files.related_photos.forEach((f) => relatedPhotos.push('products/' + f.filename));
      }

      const parsedCategoryIds = category_ids 
        ? (typeof category_ids === 'string' ? JSON.parse(category_ids) : category_ids)
        : (typeof current.category_ids === 'string' ? JSON.parse(current.category_ids || '[]') : current.category_ids);

      await query(
        `UPDATE products SET
          name = ?, publication_id = ?, old_price = ?, discount = ?, total_price = ?,
          quantity = ?, weight = ?, is_weightless = ?, shipping_charge = ?, main_photo = ?,
          related_photos = ?, description = ?, category_ids = ?, is_featured = ?, is_active = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [
          name || current.name,
          publication_id !== undefined ? Number(publication_id) : current.publication_id,
          old_price !== undefined ? parseFloat(old_price) : current.old_price,
          discount !== undefined ? parseFloat(discount) : current.discount,
          total_price !== undefined ? parseFloat(total_price) : current.total_price,
          quantity !== undefined ? parseInt(quantity, 10) : current.quantity,
          isWeightless ? null : (weight !== undefined ? parseFloat(weight) : current.weight),
          isWeightless ? 1 : 0,
          shipping_charge !== undefined ? parseFloat(shipping_charge) : current.shipping_charge,
          mainPhotoPath,
          JSON.stringify(relatedPhotos),
          description !== undefined ? description : current.description,
          JSON.stringify(parsedCategoryIds.map(Number)),
          is_featured !== undefined ? (is_featured ? 1 : 0) : current.is_featured,
          is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
          id,
        ]
      );

      return res.json({ success: true, message: 'Product updated successfully.' });
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(500).json({ success: false, message: 'Failed to update product.' });
    }
  }

  // Admin: Delete product
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existing = await query('SELECT main_photo FROM products WHERE id = ? LIMIT 1', [id]);
      if (!existing.length) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      await query('DELETE FROM products WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete product.' });
    }
  }
}

