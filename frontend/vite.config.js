import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
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
