import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building frontend React app...');
const frontendDir = path.join(__dirname, '..', 'frontend');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

console.log('Copying build output to dist and public...');
const src = path.join(frontendDir, 'dist');
const dist = path.join(__dirname, '..', 'dist');
const pub = path.join(__dirname, '..', 'public');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

fs.cpSync(src, dist, { recursive: true });
fs.cpSync(src, pub, { recursive: true });

// Copy API engine into dist
const pubApi = path.join(pub, 'api');
const distApi = path.join(dist, 'api');
if (fs.existsSync(pubApi)) {
  fs.cpSync(pubApi, distApi, { recursive: true });
}

// Copy storage (323 book cover photos and banners) into dist
const pubStorage = path.join(pub, 'storage');
const distStorage = path.join(dist, 'storage');
if (fs.existsSync(pubStorage)) {
  fs.cpSync(pubStorage, distStorage, { recursive: true });
}

// Copy .htaccess into dist so LiteSpeed / Apache routes /api and SPA
const pubHtaccess = path.join(pub, '.htaccess');
const distHtaccess = path.join(dist, '.htaccess');
if (fs.existsSync(pubHtaccess)) {
  fs.copyFileSync(pubHtaccess, distHtaccess);
}

// Ensure .env is present in dist and public
const rootEnv = path.join(__dirname, '..', '.env');
const distEnv = path.join(dist, '.env');
const pubEnv = path.join(pub, '.env');

const fallbackEnv = [
  `APP_NAME="${process.env.APP_NAME || 'Sri Chaitanya Book Centre'}"`,
  `APP_ENV=${process.env.APP_ENV || 'production'}`,
  `APP_DEBUG=${process.env.APP_DEBUG || 'false'}`,
  `APP_URL=${process.env.APP_URL || 'https://srichaitanybookscenter.com'}`,
  `CLIENT_URL=${process.env.CLIENT_URL || 'https://srichaitanybookscenter.com'}`,
  `DB_HOST=${process.env.DB_HOST || 'localhost'}`,
  `DB_PORT=${process.env.DB_PORT || '3306'}`,
  `DB_NAME=${process.env.DB_NAME || 'u803044110_srichaitanya'}`,
  `DB_USER=${process.env.DB_USER || 'u803044110_sri_user'}`,
  `DB_PASSWORD=${process.env.DB_PASSWORD || 'SriChaitanya@2026'}`,
  `RAZORPAY_MODE=${process.env.RAZORPAY_MODE || 'test'}`,
  `RAZORPAY_TEST_KEY=${process.env.RAZORPAY_TEST_KEY || 'rzp_test_SwedUUn1KgRMs0'}`,
  `RAZORPAY_TEST_SECRET=${process.env.RAZORPAY_TEST_SECRET || 'xdW2Ry7T67sUK4zMKb3oOsZh'}`,
  `RAZORPAY_LIVE_KEY=${process.env.RAZORPAY_LIVE_KEY || 'rzp_live_SIJDGxy85sgrKV'}`,
  `RAZORPAY_LIVE_SECRET=${process.env.RAZORPAY_LIVE_SECRET || 'gj9CI3Dq9wKU5dapQR61Vyo3'}`,
  `JWT_SECRET=${process.env.JWT_SECRET || 'srichaitanya_super_secure_jwt_secret_key_2026_xyz'}`,
  `JWT_EXPIRES_IN=${process.env.JWT_EXPIRES_IN || '7d'}`
].join('\n') + '\n';

if (fs.existsSync(rootEnv)) {
  fs.copyFileSync(rootEnv, distEnv);
  fs.copyFileSync(rootEnv, pubEnv);
} else {
  fs.writeFileSync(distEnv, fallbackEnv);
  fs.writeFileSync(pubEnv, fallbackEnv);
  fs.writeFileSync(rootEnv, fallbackEnv);
}

console.log('Build output ready with full API, storage, and SPA in dist/ and public/!');
