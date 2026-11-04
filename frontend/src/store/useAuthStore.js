import { create } from 'zustand';
import api from '../services/api.js';

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('admin_token') || null,
  user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('admin_token'),
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        set({
          token: res.data.token,
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        return true;
      }
      set({ loading: false, error: res.data.message || 'Login failed' });
      return false;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      set({ loading: false, error: msg });
      return false;
    }
  },

  updateUser: (updatedUser, newToken) => {
    if (newToken) {
      localStorage.setItem('admin_token', newToken);
    }
    if (updatedUser) {
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      set({
        user: updatedUser,
        token: newToken || get().token,
      });
    }
  },

  updateProfile: async ({ name, email, password, currentPassword }) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put('/auth/profile', { name, email, password, currentPassword });
      if (res.data.success) {
        if (res.data.token) localStorage.setItem('admin_token', res.data.token);
        if (res.data.user) localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        set({
          token: res.data.token || get().token,
          user: res.data.user,
          loading: false,
          error: null,
        });
        return { success: true, message: res.data.message };
      }
      set({ loading: false, error: res.data.message });
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        set({ user: res.data.user, isAuthenticated: true });
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      set({ token: null, user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
