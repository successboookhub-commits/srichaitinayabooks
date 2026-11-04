import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import publicationRoutes from './routes/publicationRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderHistoryRoutes from './routes/orderHistoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import homeSectionRoutes from './routes/homeSectionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow both React web app and Mobile App (Capacitor/Cordova/React Native)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images from backend uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Serve uploads and legacy Laravel storage images seamlessly
app.use('/storage/banners', express.static(path.resolve(__dirname, '../uploads/banners')));
app.use('/storage/products', express.static(path.resolve(__dirname, '../uploads/products')));
app.use('/storage', express.static(path.resolve(__dirname, '../../public/storage')));

// Serve generated invoices
app.use('/api/invoices', express.static(path.resolve(__dirname, '../invoices')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sri Chaitanya Books API',
    version: '2.0.0',
    time: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-history', orderHistoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/home-sections', homeSectionRoutes);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

export default app;

