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
console.log('Build output ready in dist/ and public/!');
