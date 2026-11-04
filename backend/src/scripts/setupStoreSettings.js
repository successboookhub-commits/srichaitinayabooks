import { query } from '../config/db.js';

async function setup() {
  await query(`
    CREATE TABLE IF NOT EXISTS store_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ store_settings table created or verified.');

  const defaults = [
    { key: 'show_category_showcase', value: '1' },
    { key: 'show_publication_showcase', value: '1' },
    { key: 'category_showcase_limit', value: '8' },
    { key: 'publication_showcase_limit', value: '8' },
    { key: 'category_showcase_title', value: 'Books by Exam Category' },
    { key: 'publication_showcase_title', value: 'Books by Leading Publishers' },
  ];

  for (const item of defaults) {
    const existing = await query('SELECT setting_key FROM store_settings WHERE setting_key = ?', [item.key]);
    if (existing.length === 0) {
      await query('INSERT INTO store_settings (setting_key, setting_value) VALUES (?, ?)', [item.key, item.value]);
    }
  }

  const all = await query('SELECT * FROM store_settings');
  console.log('Current store_settings:', all);
  process.exit(0);
}

setup().catch(err => {
  console.error('Setup error:', err);
  process.exit(1);
});

