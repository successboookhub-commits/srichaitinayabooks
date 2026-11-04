import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  ArrowRight,
  Check,
  Phone,
  MessageSquare,
  Sparkles,
  PackageCheck,
  BookOpen,
  Share2,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import api, { getImageUrl } from '../services/api.js';
import { useCartStore } from '../store/useCartStore.js';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { id, slug: paramSlug } = useParams();
  const slug = id || paramSlug;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          setActiveImage(res.data.product.main_photo || res.data.product.image);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-9 h-9 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-bold">Loading book details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Book Not Found</h2>
        <p className="text-xs text-slate-500">The requested publication might be inactive or removed.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = (product.quantity || product.stock || 0) <= 0;
  const allImages = [product.main_photo || product.image, ...(product.related_photos || [])].filter(Boolean);

  const price = parseFloat(product.total_price || product.price || 0);
  const oldPrice = parseFloat(product.old_price || product.actual_price || 0);
  const discount = product.discount ? Math.round(parseFloat(product.discount)) : (oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);
  const savings = oldPrice > price ? (oldPrice - price).toFixed(2) : 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addItem(product, qty);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2200);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addItem(product, qty);
      setDrawerOpen(false);
      navigate('/checkout');
    }
  };

  return (
    <div className="w-full bg-slate-50/60 min-h-screen py-4 sm:py-6">
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        
        {/* Compact, Clean Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link to="/shop" className="hover:text-red-600 transition-colors">Store</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">
            {product.name || product.title}
          </span>
        </nav>

        {/* UNIFIED LUXURY MASTER CARD (No disjointed floating boxes!) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Left Column: Cover Art & Thumbnails (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 sm:p-5 flex items-center justify-center relative overflow-hidden aspect-[3/4] max-h-[420px] group">
                <img
                  src={getImageUrl(activeImage)}
                  alt={product.name || product.title}
                  className="w-full h-full max-h-[360px] object-contain drop-shadow-sm group-hover:scale-102 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/images/ebook_logo.png';
                  }}
                />

                {/* Discount Badge */}
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-xs tracking-tight">
                    {discount}% OFF
                  </span>
                )}

                {/* Original Seal Badge */}
                <span className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Original Edition</span>
                </span>
              </div>

              {/* Thumbnails Gallery (Only when multiple photos exist) */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-13 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 p-1 bg-white cursor-pointer ${
                        activeImage === img
                          ? 'border-red-600 shadow-xs ring-2 ring-red-100'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={getImageUrl(img)} alt="thumb" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Title, Price, Actions & Specs (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Category & Verified Publisher Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {product.publication_name && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-700 bg-red-50 border border-red-200/70 px-2.5 py-0.5 rounded-full">
                    <Award className="w-3 h-3" />
                    <span>{product.publication_name}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>100% Genuine Publisher Stock</span>
                </span>

                {Boolean(product.is_weightless) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full">
                    <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                    <span>Weightless</span>
                  </span>
                )}
              </div>

              {/* Title (Clean, Balanced & Refined - No Giant Shouty Caps!) */}
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {product.name || product.title}
                </h1>
              </div>

              {/* Modern Sleek Pricing Section */}
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight leading-none">
                    ₹{price.toFixed(2)}
                  </span>
                  {oldPrice > price && (
                    <span className="text-sm sm:text-base text-slate-400 line-through font-medium leading-none">
                      ₹{oldPrice.toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                      Save ₹{savings} ({discount}% OFF)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Inclusive of all taxes • Immediate courier dispatch with tracking ID</span>
                </p>
              </div>

              {/* Stock Status Pill */}
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Currently Out of Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.quantity || product.stock || 50} copies ready for dispatch)
                  </span>
                )}
              </div>

              {/* High-Converting Action Buttons (Compact Single Row + WhatsApp) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shrink-0 h-10">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={isOutOfStock}
                      className="w-7 h-full flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-black text-sm cursor-pointer disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-2 font-black text-xs text-slate-900 min-w-[20px] text-center">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.quantity || 99, qty + 1))}
                      disabled={isOutOfStock}
                      className="w-7 h-full flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-black text-sm cursor-pointer disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  {/* Buy Now (Primary CTA) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 h-10 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Added to cart toast */}
                {addedToast && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Added to your shopping bag!
                    </span>
                    <button
                      onClick={() => setDrawerOpen(true)}
                      className="text-emerald-700 underline text-[11px] font-black cursor-pointer"
                    >
                      View Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Book Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Publisher</span>
                  <span className="font-extrabold text-slate-800 truncate block text-xs mt-0.5">
                    {product.publication_name || 'Official Edition'}
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Format</span>
                  <span className="font-extrabold text-slate-800 truncate block text-xs mt-0.5">
                    Paperback Edition
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Dispatch</span>
                  <span className="font-extrabold text-slate-800 truncate block text-xs mt-0.5">
                    Within 24 Hours
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery</span>
                  <span className="font-extrabold text-emerald-700 truncate block text-xs mt-0.5">
                    Pan-India Shipping
                  </span>
                </div>
              </div>

              {/* Trust Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Express Courier Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Genuine Publisher Copy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Moisture-proof packing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Helpline: 09177110134</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Book Description / Syllabus Section */}
        {product.description && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-2.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <BookOpen className="w-4 h-4 text-red-600" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">Book Overview & Syllabus Details</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
              {product.description}
            </p>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Related Examination Books</h2>
                <p className="text-xs text-slate-500">Other popular study guides in this exam category</p>
              </div>
              <Link to="/shop" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                <span>View More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {relatedProducts.slice(0, 5).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
