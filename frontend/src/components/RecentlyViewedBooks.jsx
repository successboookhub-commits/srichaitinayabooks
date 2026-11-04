import React from 'react';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import { useRecentViewsStore } from '../store/useRecentViewsStore.js';
import ProductCard from './ProductCard.jsx';

export default function RecentlyViewedBooks({ excludeId, maxItems = 6, title = 'Recently Viewed Books' }) {
  const { recentProducts, clearRecentViews } = useRecentViewsStore();

  const filtered = recentProducts.filter((p) => String(p.id) !== String(excludeId));

  if (filtered.length === 0) return null;

  const displayList = filtered.slice(0, maxItems);

  return (
    <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/80">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Books you explored during this visit
            </p>
          </div>
        </div>

        <button
          onClick={clearRecentViews}
          className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          title="Clear recent browsing history"
        >
          <Trash2 className="w-3 h-3" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
