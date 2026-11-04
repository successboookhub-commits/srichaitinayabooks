import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore.js';
import { useCartStore } from '../store/useCartStore.js';
import { getImageUrl } from '../services/api.js';

export default function WishlistDrawer() {
  const navigate = useNavigate();
  const { items, isWishlistOpen, setWishlistOpen, removeFromWishlist, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (item) => {
    addItem(item, 1);
    removeFromWishlist(item.id);
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addItem(item, 1);
    });
    clearWishlist();
    setWishlistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Saved Books (Wishlist)</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {items.length} {items.length === 1 ? 'book' : 'books'} saved for later
                </p>
              </div>
            </div>

            <button
              onClick={() => setWishlistOpen(false)}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-200/60">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Your Wishlist is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Browse your favorite TSPSC, APPSC, SI, Police, or Railway books and tap the heart icon to save them here!
                </p>
                <button
                  onClick={() => {
                    setWishlistOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore All Books</span>
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = parseFloat(item.total_price || item.price || 0);
                const oldPrice = parseFloat(item.old_price || 0);
                const isOutOfStock = (item.quantity !== undefined ? item.quantity : (item.stock ?? 99)) <= 0;

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-slate-200/80 hover:border-red-200 bg-white shadow-2xs flex gap-3 transition-all"
                  >
                    <div className="w-16 h-20 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={getImageUrl(item.image || item.main_photo)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '/images/ebook_logo.png';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          to={item.slug ? `/product/${item.slug}` : `/product/${item.id}`}
                          onClick={() => setWishlistOpen(false)}
                          className="font-extrabold text-xs text-slate-900 hover:text-red-600 line-clamp-2 leading-snug transition-colors"
                        >
                          {item.name}
                        </Link>
                        {item.publication_name && (
                          <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">
                            {item.publication_name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs sm:text-sm font-black text-red-600 leading-none">
                            ₹{price.toFixed(2)}
                          </span>
                          {oldPrice > price && (
                            <span className="text-[10px] text-slate-400 line-through leading-none">
                              ₹{oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove from Saved"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={isOutOfStock}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer disabled:opacity-40"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-2">
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Bag ({items.length})</span>
              </button>

              <button
                onClick={clearWishlist}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Clear Wishlist
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
