import { query } from './src/config/db.js';

async function check() {
  const feat = await query("SELECT id, name FROM products WHERE is_featured = 1 LIMIT 12");
  console.log('Featured products count:', feat.length);
  console.log('Featured names:', feat.map(f => f.name));
  const recent = await query("SELECT id, name FROM products ORDER BY id DESC LIMIT 12");
  console.log('Recent products count:', recent.length);
  console.log('Recent names:', recent.map(r => r.name));
  process.exit(0);
}
check();

