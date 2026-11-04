import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isWishlistOpen: false,

      setWishlistOpen: (isOpen) => set({ isWishlistOpen: Boolean(isOpen) }),

      toggleWishlist: (product) => {
        if (!product || !product.id) return false;
        const { items } = get();
        const exists = items.some((i) => i.id === product.id);

        if (exists) {
          set({ items: items.filter((i) => i.id !== product.id) });
          return false; // removed
        } else {
          const newItem = {
            id: product.id,
            name: product.name || product.title,
            title: product.name || product.title,
            price: parseFloat(product.total_price || product.price || 0),
            old_price: parseFloat(product.old_price || 0),
            total_price: parseFloat(product.total_price || product.price || 0),
            discount: product.discount || 0,
            image: product.main_photo || product.image,
            main_photo: product.main_photo || product.image,
            slug: product.slug,
            quantity: product.quantity !== undefined ? product.quantity : (product.stock ?? 99),
            stock: product.quantity !== undefined ? product.quantity : (product.stock ?? 99),
            is_weightless: Boolean(product.is_weightless),
            publication_name: product.publication_name,
            savedAt: Date.now(),
          };
          set({ items: [newItem, ...items] });
          return true; // added
        }
      },

      isInWishlist: (id) => {
        if (!id) return false;
        return get().items.some((i) => i.id === id);
      },

      removeFromWishlist: (id) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== id) });
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'srichaitanya_wishlist',
    }
  )
);

export default useWishlistStore;

