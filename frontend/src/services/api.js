import axios from 'axios';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocal ? 'http://localhost:5000/api' : '/api';
export const SERVER_URL = isLocal ? 'http://localhost:5000' : '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-book.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Check if it's from legacy Laravel storage or new uploads
  if (imagePath.startsWith('products/') || imagePath.startsWith('banners/') || imagePath.startsWith('uploads/')) {
    return `${SERVER_URL}/storage/${imagePath}`;
  }
  return `${SERVER_URL}/${imagePath}`;
};

export const getInvoiceUrl = (orderCode) => {
  if (!orderCode) return '#';
  return `${API_BASE_URL}/order-history/invoice/${orderCode}`;
};

// Also attach to api instance so api.getImageUrl(...) and api.getInvoiceUrl(...) work everywhere safely
api.getImageUrl = getImageUrl;
api.getInvoiceUrl = getInvoiceUrl;

export default api;
