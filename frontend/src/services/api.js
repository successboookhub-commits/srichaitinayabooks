import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// High-Performance In-Memory Cache (SWR - Stale While Revalidate)
const memoryCache = new Map();
const DEFAULT_CACHE_TTL = 90 * 1000; // 90 seconds client cache

api.getCached = async (url, config = {}) => {
  const cacheKey = url + JSON.stringify(config.params || {});
  const cached = memoryCache.get(cacheKey);
  const now = Date.now();

  // Instant response from memory cache (0ms)
  if (cached && (now - cached.timestamp < DEFAULT_CACHE_TTL)) {
    // Background quiet revalidation if older than 20 seconds
    if (now - cached.timestamp > 20 * 1000) {
      api.get(url, config).then((freshRes) => {
        memoryCache.set(cacheKey, { timestamp: Date.now(), response: freshRes });
      }).catch(() => {});
    }
    return Promise.resolve(cached.response);
  }

  const response = await api.get(url, config);
  memoryCache.set(cacheKey, { timestamp: now, response });
  return response;
};

// Clear client cache on state-changing operations
api.clearCache = () => {
  memoryCache.clear();
};

api.interceptors.response.use(
  (response) => {
    // If a write operation succeeded, clear cache so data is fresh
    const method = response.config?.method?.toLowerCase();
    if (method === 'post' || method === 'put' || method === 'delete') {
      memoryCache.clear();
    }
    return response;
  },
  (error) => Promise.reject(error)
);

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

// Attach helpers to api instance
api.getImageUrl = getImageUrl;
api.getInvoiceUrl = getInvoiceUrl;

export default api;
