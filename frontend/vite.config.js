import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
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
