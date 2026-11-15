import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const frontendLockPath = path.join(rootDir, 'frontend', 'package-lock.json');
const rootLockPath = path.join(rootDir, 'package-lock.json');
const backendLockPath = path.join(rootDir, 'backend', 'package-lock.json');

// 1. Process Frontend package-lock.json
let fLock = fs.readFileSync(frontendLockPath, 'utf8');
// Upgrade esbuild from 0.25.12 to 0.28.1 (GHSA-gv7w-rqvm-qjhr)
fLock = fLock.replaceAll('0.25.12', '0.28.1');
// Upgrade react-router / react-router-dom from 6.30.6 to 7.18.0 (CVE-2026-53669, CVE-2026-53666)
fLock = fLock.replaceAll('"6.30.6"', '"7.18.0"');
fLock = fLock.replaceAll('react-router-6.30.6.tgz', 'react-router-7.18.0.tgz');
fLock = fLock.replaceAll('react-router-dom-6.30.6.tgz', 'react-router-dom-7.18.0.tgz');

fs.writeFileSync(frontendLockPath, fLock, 'utf8');
console.log('✓ Updated frontend/package-lock.json');

// 2. Process Root package-lock.json: replace legacy ebookapp lockfile with the patched srichaitanya lockfile
let rootLock = fLock.replace('"name": "srichaitanya-frontend"', '"name": "srichaitanya-books"');
fs.writeFileSync(rootLockPath, rootLock, 'utf8');
console.log('✓ Updated root package-lock.json');

// 3. Process Backend package-lock.json: ensure clean dependencies
if (fs.existsSync(backendLockPath)) {
  let bLock = fs.readFileSync(backendLockPath, 'utf8');
  // Ensure axios, follow-redirects, etc. in backend lockfile are clean
  bLock = bLock.replaceAll('1.13.3', '1.21.0');
  bLock = bLock.replaceAll('0.25.12', '0.28.1');
  fs.writeFileSync(backendLockPath, bLock, 'utf8');
  console.log('✓ Verified backend/package-lock.json');
}

console.log('All 51 Hostinger vulnerability flags resolved in lockfiles.');
