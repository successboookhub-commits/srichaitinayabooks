import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// ULTRA-FAST MULTI-TIER SWR CACHE (Memory + LocalStorage + Deduplication)
// ============================================================
const memoryCache = new Map();
const inFlightRequests = new Map();
const DEFAULT_CACHE_TTL = 3 * 60 * 1000; // 3 minutes fresh cache
const REVALIDATE_INTERVAL = 30 * 1000; // Background refresh if older than 30s
const STORAGE_PREFIX = 'sc_swr_';

// Safe localStorage wrapper
function readStorage(key) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStorage(key, data) {
  try {
    // Only cache GET query payloads under 1MB
    const str = JSON.stringify(data);
    if (str.length < 1000000) {
      localStorage.setItem(STORAGE_PREFIX + key, str);
    }
  } catch (e) {
    // If storage is full, clean up old keys
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      }
    } catch {}
  }
}

api.getCached = async (url, config = {}) => {
  const cacheKey = url + JSON.stringify(config.params || {});
  const now = Date.now();

  // 1. Check in-memory Map (0ms instant)
  let cached = memoryCache.get(cacheKey);

  // 2. If not in memory, check localStorage (0.5ms instant on app launch)
  if (!cached) {
    const stored = readStorage(cacheKey);
    if (stored && stored.data) {
      cached = { timestamp: stored.timestamp, response: { data: stored.data, status: 200 } };
      memoryCache.set(cacheKey, cached);
    }
  }

  // 3. If we have cached data (Stale-While-Revalidate)
  if (cached && (now - cached.timestamp < DEFAULT_CACHE_TTL)) {
    // If older than REVALIDATE_INTERVAL, trigger quiet background revalidation
    if (now - cached.timestamp > REVALIDATE_INTERVAL) {
      if (!inFlightRequests.has(cacheKey)) {
        const bgFetch = api.get(url, config)
          .then((freshRes) => {
            memoryCache.set(cacheKey, { timestamp: Date.now(), response: freshRes });
            writeStorage(cacheKey, { timestamp: Date.now(), data: freshRes.data });
          })
          .catch(() => {})
          .finally(() => inFlightRequests.delete(cacheKey));
        inFlightRequests.set(cacheKey, bgFetch);
      }
    }
    // Return cached response instantly (0ms render!)
    return Promise.resolve(cached.response);
  }

  // 4. Request Deduplication: avoid duplicate network requests in flight
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const networkPromise = api.get(url, config)
    .then((response) => {
      memoryCache.set(cacheKey, { timestamp: Date.now(), response });
      writeStorage(cacheKey, { timestamp: Date.now(), data: response.data });
      return response;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, networkPromise);
  return networkPromise;
};

// Clear client cache on state-changing operations
api.clearCache = () => {
  memoryCache.clear();
  inFlightRequests.clear();
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(k);
      }
    }
  } catch {}
};

api.interceptors.response.use(
  (response) => {
    // If a write operation succeeded, clear cache so data is fresh
    const method = response.config?.method?.toLowerCase();
    if (method === 'post' || method === 'put' || method === 'delete') {
      api.clearCache();
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
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  // Check if it's from legacy Laravel storage or new uploads
  if (cleanPath.startsWith('products/') || cleanPath.startsWith('banners/') || cleanPath.startsWith('uploads/')) {
    return SERVER_URL ? `${SERVER_URL}/storage/${cleanPath}` : `/storage/${cleanPath}`;
  }
  return SERVER_URL ? `${SERVER_URL}/${cleanPath}` : `/${cleanPath}`;
};

export const getInvoiceUrl = (orderCode) => {
  if (!orderCode) return '#';
  return `${API_BASE_URL}/order-history/invoice/${orderCode}`;
};

// Attach helpers to api instance
api.getImageUrl = getImageUrl;
api.getInvoiceUrl = getInvoiceUrl;

export default api;
