import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { useCartStore } from '../store/useCartStore.js';
import { getImageUrl } from '../services/api.js';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const cart = useCartStore((state) => state.cart);

  const cartItem = cart.find((i) => i.id === product.id);
  const isInCart = Boolean(cartItem);
  const stockQty = product.quantity !== undefined ? product.quantity : (product.stock ?? 99);
  const isOutOfStock = stockQty <= 0;
  const name = product.name || product.title || 'Book Title';
  const price = parseFloat(product.total_price || product.price || 0);
  const oldPrice = parseFloat(product.old_price || 0);
  const discountPercent = product.discount || (oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);
  const image = product.main_photo || product.image;
  const linkPath = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
    }
  };

  return (
    <Link
      to={linkPath}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-red-300 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image Cover - Clean container with proper aspect ratio */}
      <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden p-2 flex items-center justify-center">
        <img
          src={getImageUrl(image)}
          alt={name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300 filter drop-shadow-xs"
          onError={(e) => {
            e.target.src = '/images/ebook_logo.png';
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[9.5px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs tracking-tight">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_weightless ? (
            <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" />
              Weightless
            </span>
          ) : null}
        </div>

        {/* Stock Overlay if Out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-800 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Book Information & Bottom Price/Action */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-extrabold text-xs sm:text-[13px] text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.3rem]">
            {name}
          </h3>
          {stockQty > 0 && stockQty <= 5 && (
            <span className="text-[10px] font-bold text-amber-600 mt-0.5 block">
              Only {stockQty} left!
            </span>
          )}
        </div>

        {/* Price & Action Row - Safely sized so it NEVER crops on any screen size */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="min-w-0 flex flex-col">
            <span className="text-xs sm:text-sm md:text-base font-black text-red-600 leading-none truncate">
              ₹{price.toFixed(2)}
            </span>
            {oldPrice > price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through leading-tight mt-0.5 truncate">
                ₹{oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quick Add Button - Fits comfortably without clipping */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-red-500/20 active:scale-90'
            }`}
            title={isInCart ? 'In Bag' : 'Add to Bag'}
          >
            {isInCart ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
