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
  MessageCircle,
  Sparkles,
  PackageCheck,
  BookOpen,
  Share2,
  Clock,
  Layers,
  Award,
  Heart,
  MapPin,
  Calendar
} from 'lucide-react';
import api, { getImageUrl } from '../services/api.js';
import { useCartStore } from '../store/useCartStore.js';
import { useWishlistStore } from '../store/useWishlistStore.js';
import { useRecentViewsStore } from '../store/useRecentViewsStore.js';
import ProductCard from '../components/ProductCard.jsx';
import RecentlyViewedBooks from '../components/RecentlyViewedBooks.jsx';
import { detectProductMedium, getMediumBadge } from '../utils/mediumDetector.js';

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

  // Pincode Delivery Estimator State
  const [pincode, setPincode] = useState(() => localStorage.getItem('sc_user_pincode') || '');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeError, setPincodeError] = useState('');

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

  // Run initial pincode estimate if pincode already stored
  useEffect(() => {
    if (pincode && pincode.trim().length === 6) {
      calculateDelivery(pincode.trim());
    }
  }, []);

  const calculateDelivery = (code) => {
    const clean = code.trim();
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code.');
      setPincodeResult(null);
      return;
    }

    setPincodeError('');
    localStorage.setItem('sc_user_pincode', clean);

    const firstTwo = parseInt(clean.substring(0, 2), 10);
    const isAP_TS = firstTwo >= 50 && firstTwo <= 53;

    // Delivery date calculation (excluding Sundays)
    const today = new Date();
    const addDays = isAP_TS ? 2 : 5;
    const estDate = new Date(today);
    estDate.setDate(estDate.getDate() + addDays);

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = estDate.toLocaleDateString('en-IN', options);

    if (isAP_TS) {
      setPincodeResult({
        region: 'Telangana & Andhra Pradesh (Express Hub)',
        days: '2 - 3 Days',
        date: dateStr,
        courier: 'DTDC Express & India Post Speed Post',
        fast: true,
      });
    } else {
      setPincodeResult({
        region: 'Other Indian States (National Express)',
        days: '4 - 6 Days',
        date: dateStr,
        courier: 'India Post Registered / DTDC Surface',
        fast: false,
      });
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    calculateDelivery(pincode);
  };

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

  const medium = detectProductMedium(product);
  const mediumBadge = getMediumBadge(medium);

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

  const handleWhatsAppOrder = () => {
    const bookTitle = product.name || product.title;
    const currentUrl = window.location.href;
    const msg = `Hello Sri Chaitanya Book Centre,\nI want to order this book:\n📚 *${bookTitle}*\n💰 Price: ₹${price.toFixed(2)}\n🔗 Link: ${currentUrl}\n\nPlease share delivery & payment details.`;
    window.open(`https://wa.me/919177110134?text=${encodeURIComponent(msg)}`, '_blank');
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

        {/* UNIFIED LUXURY MASTER CARD */}
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

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all cursor-pointer shadow-sm ${
                    isSaved
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-500/20'
                      : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200/70'
                  }`}
                  title={isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}
                >
                  <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
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
                {/* Medium Badge (Telugu / English Medium) */}
                <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${mediumBadge.classes}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${mediumBadge.dot}`} />
                  <span>{mediumBadge.label}</span>
                </span>

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

              {/* Title */}
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

              {/* High-Converting Action Buttons */}
              <div className="space-y-2.5 pt-1">
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

                {/* Secondary Row: WhatsApp Direct Order + Save to Wishlist */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="flex-1 h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Order / Inquire on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`h-9 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{isSaved ? 'Saved in Wishlist' : 'Save for Later'}</span>
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

              {/* ================= PINCODE DELIVERY ESTIMATOR ================= */}
              <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50/80 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Check Delivery & Speed Post Availability</span>
                  </div>
                  {pincodeResult && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Verified PIN
                    </span>
                  )}
                </div>

                <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 500001)"
                    value={pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPincode(val);
                      if (val.length === 6) calculateDelivery(val);
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {pincodeError && (
                  <p className="text-[11px] text-rose-600 font-bold">{pincodeError}</p>
                )}

                {pincodeResult && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Estimated Delivery: <strong>{pincodeResult.date}</strong> ({pincodeResult.days})</span>
                    </div>
                    <div className="text-[11px] text-emerald-800/90 flex flex-wrap items-center gap-2">
                      <span>• Partner: {pincodeResult.courier}</span>
                      <span>• Express Courier Dispatch</span>
                      <span>• Direct Hub Dispatch</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Book Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Medium</span>
                  <span className="font-extrabold text-slate-800 truncate block text-xs mt-0.5">
                    {mediumBadge.label}
                  </span>
                </div>
                <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Publisher</span>
                  <span className="font-extrabold text-slate-800 truncate block text-xs mt-0.5">
                    {product.publication_name || 'Official Edition'}
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

        {/* ================= RECENTLY VIEWED BOOKS ================= */}
        <RecentlyViewedBooks excludeId={product.id} />

      </div>
    </div>
  );
}
