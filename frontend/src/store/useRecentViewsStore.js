import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentViewsStore = create(
  persist(
    (set, get) => ({
      recentProducts: [],

      addViewedProduct: (product) => {
        if (!product || !product.id) return;
        const { recentProducts } = get();

        const cleanItem = {
          id: product.id,
          name: product.name || product.title,
          title: product.name || product.title,
          price: parseFloat(product.total_price || product.price || 0),
          total_price: parseFloat(product.total_price || product.price || 0),
          old_price: parseFloat(product.old_price || 0),
          discount: product.discount || 0,
          image: product.main_photo || product.image,
          main_photo: product.main_photo || product.image,
          slug: product.slug,
          publication_name: product.publication_name,
          quantity: product.quantity !== undefined ? product.quantity : (product.stock ?? 99),
          stock: product.quantity !== undefined ? product.quantity : (product.stock ?? 99),
          is_weightless: Boolean(product.is_weightless),
          viewedAt: Date.now(),
        };

        // Filter out existing and prepend new (keep at most 12 items)
        const filtered = recentProducts.filter((p) => p.id !== product.id);
        set({ recentProducts: [cleanItem, ...filtered].slice(0, 12) });
      },

      clearRecentViews: () => set({ recentProducts: [] }),
    }),
    {
      name: 'srichaitanya_recent_views',
    }
  )
);

export default useRecentViewsStore;
