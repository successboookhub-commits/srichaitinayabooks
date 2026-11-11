import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Truck,
  ArrowRight,
  Check,
  Phone,
  Sparkles,
  PackageCheck,
  BookOpen,
  Share2,
  Clock,
  Layers,
  Award,
  Heart
} from 'lucide-react';
import api, { getImageUrl } from '../services/api.js';
import { useCartStore } from '../store/useCartStore.js';
import { useWishlistStore } from '../store/useWishlistStore.js';
import { useRecentViewsStore } from '../store/useRecentViewsStore.js';
import ProductCard from '../components/ProductCard.jsx';
import RecentlyViewedBooks from '../components/RecentlyViewedBooks.jsx';

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
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addViewedProduct = useRecentViewsStore((state) => state.addViewedProduct);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setRelatedProducts(res.data.relatedProducts || []);
          setActiveImage(prod.main_photo || prod.image);

          // Track in Recently Viewed store
          addViewedProduct(prod);
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

  const isSaved = isInWishlist(product.id);
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
    <div className="w-full bg-slate-50/60 min-h-screen py-2 sm:py-6">
      <div className="w-full max-w-5xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-2 sm:space-y-4">
        
        {/* Compact, Clean Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-medium py-0.5">
          <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link to="/shop" className="hover:text-red-600 transition-colors">Store</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-md">
            {product.name || product.title}
          </span>
        </nav>

        {/* UNIFIED LUXURY MASTER CARD - COMPACT SINGLE VIEW */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden p-3 sm:p-5 lg:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Cover Art & Sub Images beside it (5 Cols on Desktop) */}
            <div className="lg:col-span-5">
              <div className="flex items-start gap-2 sm:gap-3">
                
                {/* Thumbnails Gallery beside main image (Left vertical column) */}
                {allImages.length > 1 && (
                  <div className="flex flex-col gap-1.5 sm:gap-2 shrink-0 max-h-[210px] sm:max-h-[300px] lg:max-h-[350px] overflow-y-auto scrollbar-none py-0.5">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`w-11 h-14 sm:w-13 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 p-0.5 bg-white cursor-pointer ${
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

                {/* Main Cover Display */}
                <div className="flex-1 bg-slate-50/70 rounded-2xl border border-slate-100 p-2 sm:p-4 flex items-center justify-center relative overflow-hidden h-[210px] sm:h-[300px] lg:h-[350px] group">
                  <img
                    src={getImageUrl(activeImage)}
                    alt={product.name || product.title}
                    className="w-full h-full max-h-[195px] sm:max-h-[280px] lg:max-h-[330px] object-contain drop-shadow-sm group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/ebook_logo.png';
                    }}
                  />

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded shadow-xs tracking-tight">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all cursor-pointer shadow-sm ${
                      isSaved
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-500/20'
                        : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200/70'
                    }`}
                    title={isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

              </div>
            </div>

            {/* Right Column: Title, Price, Actions & Specs (7 Cols) */}
            <div className="lg:col-span-7 space-y-2 sm:space-y-3">
              
              {/* Category & Verified Publisher Bar */}
              {(product.publication_name || Boolean(product.is_weightless)) && (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {product.publication_name && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-red-700 bg-red-50 border border-red-200/70 px-2 sm:px-2.5 py-0.5 rounded-full">
                      <Award className="w-3 h-3" />
                      <span>{product.publication_name}</span>
                    </span>
                  )}

                  {Boolean(product.is_weightless) && (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2 sm:px-2.5 py-0.5 rounded-full">
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Weightless</span>
                    </span>
                  )}
                </div>
              )}

              {/* Title - slightly smaller & compact for single view */}
              <div>
                <h1 className="text-xs sm:text-base lg:text-lg font-black text-slate-900 leading-snug tracking-tight line-clamp-2">
                  {product.name || product.title}
                </h1>
              </div>

              {/* Modern Sleek Pricing Section */}
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-red-600 tracking-tight leading-none shrink-0">
                    ₹{price.toFixed(2)}
                  </span>
                  {oldPrice > price && (
                    <span className="text-xs sm:text-sm text-slate-400 line-through font-medium leading-none shrink-0">
                      ₹{oldPrice.toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                      Save ₹{savings} ({discount}% OFF)
                    </span>
                  )}
                </div>
              </div>

              {/* High-Converting Action Buttons: Add to Bag + Buy Now in Single View */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shrink-0 h-9 sm:h-10">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={isOutOfStock}
                      className="w-5 sm:w-7 h-full flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-black text-xs sm:text-sm cursor-pointer disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-1 sm:px-1.5 font-black text-[11px] sm:text-xs text-slate-900 min-w-[16px] text-center">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.quantity || 99, qty + 1))}
                      disabled={isOutOfStock}
                      className="w-5 sm:w-7 h-full flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors font-black text-xs sm:text-sm cursor-pointer disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 h-9 sm:h-10 px-1.5 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1 sm:gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span>Add to Bag</span>
                  </button>

                  {/* Buy Now (Primary CTA) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 h-9 sm:h-10 px-1.5 sm:px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 active:scale-98 text-white font-bold text-[11px] sm:text-sm shadow-md shadow-red-500/20 flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  </button>

                  {/* Save to Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`h-9 sm:h-10 w-8 sm:w-10 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs ${
                      isSaved
                        ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-500/10'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                    title={isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
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
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Dispatch</span>
                  <span className="font-extrabold text-slate-800 block text-xs mt-0.5">
                    Within 24 Hours
                  </span>
                </div>
                <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Delivery Partner</span>
                  <span className="font-extrabold text-emerald-700 block text-xs mt-0.5">
                    Indian Post
                  </span>
                </div>
              </div>

              {/* Delivery & Packing Guarantees (No Truncation / No Ellipsis) */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 flex items-center gap-2 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-red-100/80 text-red-600 flex items-center justify-center shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-[11px] block leading-tight">Indian Post</span>
                    <span className="text-[10px] text-slate-500 font-medium block leading-tight mt-0.5">5–6 Days Delivery</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 flex items-center gap-2 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                    <PackageCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-[11px] block leading-tight">Moisture-Proof</span>
                    <span className="text-[10px] text-slate-500 font-medium block leading-tight mt-0.5">Safe Packaging</span>
                  </div>
                </div>
              </div>

              {/* Orders & Enquiries Support Card */}
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 sm:p-3 shadow-2xs">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-amber-950 leading-tight">
                        Call or Message for Orders &amp; Enquiries:
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <a
                          href="tel:09177110134"
                          className="text-xs sm:text-sm font-black text-slate-900 hover:text-red-600 transition-colors tracking-wide whitespace-nowrap"
                        >
                          09177110134
                        </a>
                        <span className="text-[9.5px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md whitespace-nowrap inline-block">
                          10 AM to 6 PM
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="tel:09177110134"
                    className="inline-flex items-center gap-1 bg-slate-900 hover:bg-red-600 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all shadow-xs shrink-0 active:scale-95 whitespace-nowrap"
                  >
                    <span>Call</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
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

        {/* ================= RECENTLY VIEWED BOOKS ================= */}
        <RecentlyViewedBooks excludeId={product.id} />

      </div>
    </div>
  );
}
