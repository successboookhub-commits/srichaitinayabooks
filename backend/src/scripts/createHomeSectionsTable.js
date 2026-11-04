import { query } from '../config/db.js';

async function setup() {
  await query(`
    CREATE TABLE IF NOT EXISTS home_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) DEFAULT '',
      product_ids LONGTEXT NOT NULL,
      display_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ home_sections table created or verified.');

  // If no sections exist, seed default sections using existing featured and recent products
  const existing = await query('SELECT COUNT(*) as cnt FROM home_sections');
  if (existing[0].cnt === 0) {
    const featuredProds = await query('SELECT id FROM products WHERE is_active = 1 AND is_featured = 1 ORDER BY id DESC LIMIT 10');
    const recentProds = await query('SELECT id FROM products WHERE is_active = 1 ORDER BY id DESC LIMIT 10');

    const featuredIds = featuredProds.map(p => p.id);
    const recentIds = recentProds.map(p => p.id);

    if (featuredIds.length > 0) {
      await query(
        'INSERT INTO home_sections (title, subtitle, product_ids, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
        ['Featured Study Materials', 'Specially curated materials for competitive exams & top ranks.', JSON.stringify(featuredIds), 1, 1]
      );
    }

    if (recentIds.length > 0) {
      await query(
        'INSERT INTO home_sections (title, subtitle, product_ids, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
        ['New Arrivals & Latest Publications', 'Freshly published editions and newly arrived textbooks.', JSON.stringify(recentIds), 2, 1]
      );
    }

    console.log('✅ Seeded initial default home sections.');
  }

  const sections = await query('SELECT id, title, display_order, product_ids FROM home_sections');
  console.log('Current sections:', sections);
  process.exit(0);
}

setup().catch(err => {
  console.error('Error in setup:', err);
  process.exit(1);
});

