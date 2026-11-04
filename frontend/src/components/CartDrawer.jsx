import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore.js';
import { getImageUrl } from '../services/api.js';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    shipping,
    total,
    isDrawerOpen,
    setDrawerOpen,
    updateQty,
    removeItem,
    clearCart,
    calculateLiveTotals,
  } = useCartStore();

  useEffect(() => {
    if (isDrawerOpen) {
      calculateLiveTotals();
    }
  }, [isDrawerOpen]);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 1. Backdrop Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* 2. Slide-In Cart Panel (Responsive on Mobile, Tablet & Desktop) */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-right duration-300 border-l border-slate-200/90">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                Your Shopping Cart
              </h2>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                {totalItems} {totalItems === 1 ? 'Book' : 'Books'} in Bag
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 1 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 px-2 py-1 rounded-md transition-colors cursor-pointer"
                title="Clear all books"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Items Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/60">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-18 h-18 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                <BookOpen className="w-9 h-9" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-black text-slate-900 text-base">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Explore our comprehensive competitive exam syllabus textbooks and add books to continue.
                </p>
              </div>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate('/shop');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-red-500/25 transition-all cursor-pointer"
              >
                Explore All Books
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-all flex gap-3.5 items-start group"
              >
                {/* Book Thumbnail */}
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-16 h-22 sm:w-18 sm:h-24 object-contain rounded-xl bg-slate-50 border border-slate-200/80 p-1 shrink-0 shadow-2xs"
                  onError={(e) => {
                    e.currentTarget.src = '/images/ebook_logo.png';
                  }}
                />

                {/* Book Information */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-[13px] font-extrabold text-slate-900 line-clamp-2 leading-snug">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price & Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-red-600">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </span>
                    {item.is_weightless && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Weightless Rate
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls & Line Item Total */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-md transition-colors font-black text-xs cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-black text-slate-900">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-md transition-colors font-black text-xs cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-700">
                      Total: ₹{(parseFloat(item.price) * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Totals & CTAs */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3 shrink-0 shadow-lg">
            
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Books Subtotal ({totalItems} items)</span>
                <span className="font-bold text-slate-900">₹{parseFloat(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Courier Shipping</span>
                <span className="font-bold text-slate-900">
                  {parseFloat(shipping) > 0 ? `₹${parseFloat(shipping).toFixed(2)}` : 'Calculated at checkout'}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-red-600 text-lg">₹{parseFloat(total || subtotal).toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Proceed to Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Payment & Security Trust Badges */}
            <div className="flex items-center justify-center gap-2 text-[10.5px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>UPI • Cards • NetBanking • Cash on Delivery</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
