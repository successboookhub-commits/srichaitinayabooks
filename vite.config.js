import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-utils': ['axios', 'zustand'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://srichaitanya.successbookhub.com',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'https://srichaitanya.successbookhub.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://srichaitanya.successbookhub.com',
        changeOrigin: true,
        secure: false,
      },
      '/invoices': {
        target: 'https://srichaitanya.successbookhub.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
