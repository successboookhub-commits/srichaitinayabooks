import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api.js';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      isDrawerOpen: false,

      setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

      addItem: (product, qty = 1) => {
        const { cart } = get();
        const existing = cart.find((item) => item.id === product.id);

        let newCart;
        if (existing) {
          const maxStock = product.quantity !== undefined ? product.quantity : (product.stock ?? 99);
          const newQty = Math.min(existing.qty + qty, maxStock);
          newCart = cart.map((item) =>
            item.id === product.id ? { ...item, qty: newQty } : item
          );
        } else {
          const maxStock = product.quantity !== undefined ? product.quantity : (product.stock ?? 99);
          newCart = [
            ...cart,
            {
              id: product.id,
              name: product.name || product.title,
              price: parseFloat(product.total_price || product.price || 0),
              shipping: parseFloat(product.shipping_charge || 0),
              is_weightless: Boolean(product.is_weightless),
              image: product.main_photo || product.image,
              qty: Math.min(qty, maxStock),
              maxStock: maxStock,
            },
          ];
        }

        set({ cart: newCart, isDrawerOpen: true });
        get().calculateLiveTotals();
      },

      updateQty: (id, qty) => {
        const { cart } = get();
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }

        const newCart = cart.map((item) => {
          if (item.id === id) {
            const cappedQty = item.maxStock ? Math.min(qty, item.maxStock) : qty;
            return { ...item, qty: cappedQty };
          }
          return item;
        });

        set({ cart: newCart });
        get().calculateLiveTotals();
      },

      removeItem: (id) => {
        const { cart } = get();
        const newCart = cart.filter((item) => item.id !== id);
        set({ cart: newCart });
        get().calculateLiveTotals();
      },

      clearCart: () => {
        set({ cart: [], subtotal: 0, shipping: 0, total: 0 });
      },

      calculateLiveTotals: async () => {
        const { cart } = get();
        if (!cart.length) {
          set({ subtotal: 0, shipping: 0, total: 0 });
          return;
        }

        try {
          const res = await api.post('/checkout/totals', { cart });
          if (res.data.success) {
            set({
              subtotal: res.data.subtotal,
              shipping: res.data.shipping,
              total: res.data.total,
            });
          }
        } catch (err) {
          console.error('Failed to sync live cart totals:', err);
        }
      },
    }),
    {
      name: 'srichaitanya_cart',
    }
  )
);

export default useCartStore;

