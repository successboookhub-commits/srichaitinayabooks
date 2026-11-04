import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Home as HomeIcon,
  BookOpen,
  Phone,
  User,
  Info,
  Mail,
  Library,
  Sparkles,
  Truck,
  ChevronRight,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore.js';
import api, { getImageUrl } from '../services/api.js';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const searchRef = useRef(null);
  const popupInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cart = useCartStore((state) => state.cart);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  // Close mobile drawer and search modal on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchModalOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu or search modal is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isSearchModalOpen]);

  // Focus search popup input when opened
  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => popupInputRef.current?.focus(), 60);
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/products/suggest?q=${encodeURIComponent(searchQuery)}`);
        if (res.data.success) {
          setSuggestions(res.data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestions([]);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Books', path: '/shop' },
    { label: 'Publications', path: '/publications' },
    { label: 'About Us', path: '/about' },
    { label: 'Track Order', path: '/tracking' },
    { label: 'Contact', path: '/contact' },
  ];

  const quickExams = [
    { name: 'Police SI & Constable', id: '9' },
    { name: 'TGPSC Groups', id: '10' },
    { name: 'APPSC Groups', id: '10' },
    { name: 'Railways RRB', id: '16' },
    { name: 'SSC CGL/CHSL', id: '15' },
    { name: 'UPSC Civil Services', id: '2' },
  ];

  return (
    <>
      {/* ================= TOP ANNOUNCEMENT RIBBON ================= */}
      <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800">
        <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 font-bold text-red-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Publisher Stock</span>
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline text-slate-300 truncate">
              Express Dispatch Across Telangana & Andhra Pradesh in 24 Hours!
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-300 text-[11px]">
            <a
              href="tel:09177110134"
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Helpline: <strong>09177110134</strong></span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Open 7 Days: 10AM - 9PM</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN HIGH-END STICKY HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-15 sm:h-17 gap-2 sm:gap-4">
            
            {/* Left: Hamburger (Mobile) + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/60"
                aria-label="Open mobile menu drawer"
              >
                <Menu className="w-5 h-5 text-slate-800" />
              </button>

              <Link to="/" className="flex items-center gap-2 shrink-0 group">
                <img
                  src="/images/ebook_logo.png"
                  alt="Sri Chaitanya Book Centre"
                  className="h-8 sm:h-10 w-auto max-w-[125px] xs:max-w-[160px] sm:max-w-[210px] object-contain group-hover:scale-102 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback Brand Badge */}
                <div style={{ display: 'none' }} className="items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-sm shadow-sm">
                    SC
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
                      SRI CHAITANYA
                    </span>
                    <span className="text-[8px] tracking-widest text-red-600 font-extrabold uppercase block">
                      Book Centre
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (Pill Style with Micro Indicator) */}
            <nav className="hidden xl:flex items-center gap-1.5 ml-2">
              {navLinks.map((link) => {
                const isActive =
                  link.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-red-50 text-red-600 shadow-xs font-extrabold'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-red-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Center: Desktop Search Bar (Hidden on mobile so logo & cart have plenty of room) */}
            <div
              className="hidden md:block flex-1 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-xl 2xl:max-w-2xl relative mx-3"
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search books, author, publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-full pl-10 pr-8 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all placeholder:text-slate-400 shadow-xs"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Suggestions Dropdown (Desktop) */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
                    <span className="font-bold text-slate-700">Matching Books</span>
                    <span>{suggestions.length} results</span>
                  </div>
                  <div className="p-2 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.slug}`}
                        onClick={() => setSuggestions([])}
                        className="flex items-center gap-3 p-2.5 hover:bg-red-50/70 rounded-xl transition-colors group cursor-pointer"
                      >
                        <img
                          src={getImageUrl(item.main_photo)}
                          alt={item.name}
                          className="w-10 h-13 object-cover rounded-md bg-slate-100 shrink-0 shadow-xs border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-red-600">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-red-600">
                              ₹{parseFloat(item.total_price).toFixed(2)}
                            </span>
                            {item.actual_price && (
                              <span className="text-[11px] text-slate-400 line-through">
                                ₹{parseFloat(item.actual_price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Mobile Search Button (Opens Clean Search Popup) */}
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(true)}
                className="md:hidden w-9 h-9 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200/80 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                aria-label="Open Search Popup"
              >
                <Search className="w-4.5 h-4.5 text-slate-700" />
              </button>

              {/* Shopping Cart Pill Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-800 hover:text-red-600 border border-slate-200/80 hover:border-red-200 transition-all cursor-pointer shadow-2xs group"
                aria-label="View Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4.5 h-4.5 text-slate-700 group-hover:text-red-600 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-[9.5px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-extrabold">Cart</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* ================= ULTRA-MODERN MOBILE SLIDE-IN DRAWER (Off-Canvas Sheet) ================= */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          {/* 1. Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* 2. Slide-In Navigation Sheet */}
          <div className="fixed top-0 left-0 bottom-0 w-[86%] max-w-[340px] bg-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            
            {/* Top Sheet Header */}
            <div>
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/images/mini_logo.png"
                    alt="Sri Chaitanya"
                    className="w-8 h-8 object-contain rounded-lg border border-slate-200 bg-white p-0.5"
                    onError={(e) => {
                      e.currentTarget.src = '/images/ebook_logo.png';
                    }}
                  />
                  <div>
                    <h2 className="font-extrabold text-xs text-slate-900 leading-tight">Sri Chaitanya Books</h2>
                    <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Official Bookstore</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Drawer Search Bar */}
              <div className="p-3 border-b border-slate-100 bg-white">
                <form
                  onSubmit={(e) => {
                    handleSearchSubmit(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative"
                >
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search books, author, exams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Quick Exam Category Shortcut Pills */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-3 h-3 text-red-600" />
                  <span>Popular Exams</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickExams.map((exam) => (
                    <Link
                      key={exam.name}
                      to={`/shop?category_id=${exam.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-red-500 hover:text-red-600 transition-colors shadow-2xs"
                    >
                      {exam.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Primary Navigation Links */}
              <div className="p-3 space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname === '/'
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HomeIcon className="w-4 h-4 text-red-600" />
                    <span>Home</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname.startsWith('/shop')
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-red-600" />
                    <span>All Books / Shop</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/publications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname.startsWith('/publications')
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Library className="w-4 h-4 text-red-600" />
                    <span>Publications (100+)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname.startsWith('/about')
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-red-600" />
                    <span>About Us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/tracking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname.startsWith('/tracking')
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-red-600" />
                    <span>Track Order</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname.startsWith('/contact')
                      ? 'bg-red-50 text-red-600 font-extrabold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-red-600" />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Bottom Drawer Contact & Helpline Strip */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2.5">
              <a
                href="tel:09177110134"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 hover:bg-red-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Helpline: 09177110134</span>
              </a>

              <a
                href="https://wa.me/919177110134?text=Hello%20Sri%20Chaitanya%20Books,%20I%20have%20an%20enquiry%20regarding%20books"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:bg-[#20ba5a] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <p className="text-[10px] text-slate-400 text-center pt-1">
                📍 Konark Theatre Lane, Dilsukhnagar, HYD
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ================= STICKY MOBILE BOTTOM NAV ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-around h-14">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            location.pathname === '/' ? 'text-red-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <HomeIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10.5px]">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          to="/shop"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            location.pathname.startsWith('/shop') ? 'text-red-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10.5px]">Shop</span>
        </Link>

        {/* 3. Account / History */}
        <Link
          to="/order-history"
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            location.pathname.startsWith('/order-history') ? 'text-red-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10.5px]">Orders</span>
        </Link>

        {/* 4. Cart */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative cursor-pointer ${
            cartCount > 0 ? 'text-red-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10.5px]">Cart</span>
        </button>
      </nav>

      {/* ================= FULL-SCREEN NATIVE MOBILE & TABLET SEARCH VIEW ================= */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-150">
          
          {/* Top Sticky Header Bar */}
          <div className="h-14 sm:h-16 px-3 sm:px-4 border-b border-slate-200 flex items-center gap-2.5 shrink-0 bg-white shadow-2xs">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setIsSearchModalOpen(false);
                setSearchQuery('');
                setSuggestions([]);
              }}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shrink-0 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-slate-800" />
            </button>

            {/* Full-width Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
              <input
                ref={popupInputRef}
                type="text"
                placeholder="Search by book name, exam, publisher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                    setIsSearchModalOpen(false);
                  }
                  if (e.key === 'Escape') setIsSearchModalOpen(false);
                }}
                className="w-full bg-slate-100/90 focus:bg-white text-slate-900 placeholder:text-slate-400 pl-3.5 pr-8 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-transparent focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                    popupInputRef.current?.focus();
                  }}
                  className="absolute right-2 p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Direct Submit Search Button */}
            <button
              type="button"
              onClick={(e) => {
                handleSearchSubmit(e);
                setIsSearchModalOpen(false);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-black shrink-0 shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              Search
            </button>
          </div>

          {/* Body Content: Line-by-Line Results ("bottom lo line gaa kanapadali") */}
          <div className="flex-1 overflow-y-auto">
            {isSearching ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                Searching all textbooks & materials...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-2 bg-slate-50 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Matching Books ({suggestions.length})</span>
                  <span>Tap to open</span>
                </div>
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.slug}`}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      setSuggestions([]);
                    }}
                    className="flex items-center gap-3.5 p-3.5 hover:bg-red-50/60 active:bg-red-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={getImageUrl(item.main_photo)}
                      alt={item.name}
                      className="w-12 h-16 object-contain rounded-lg bg-slate-50 border border-slate-200/80 p-0.5 shrink-0 shadow-2xs"
                      onError={(e) => {
                        e.currentTarget.src = '/images/ebook_logo.png';
                      }}
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-red-600">
                          ₹{parseFloat(item.total_price).toFixed(2)}
                        </span>
                        {item.actual_price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{parseFloat(item.actual_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 shrink-0 ml-1" />
                  </Link>
                ))}

                {/* Footer Bar: View all results in Shop */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleSearchSubmit(e);
                      setIsSearchModalOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:border-red-500 text-xs font-black text-red-600 shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View all matching results for "{searchQuery}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-sm font-bold text-slate-800">No books found for "{searchQuery}"</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Check your spelling or try searching exam keywords like AP-SET, TG-SET, TGPSC, Police, or Vijetha.
                </p>
              </div>
            ) : (
              /* Popular exam tags when search is empty */
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Popular Exam Searches</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'AP-SET',
                      'TG-SET',
                      'TGPSC',
                      'APPSC',
                      'Police Constable',
                      'SI Mains',
                      'DSC & TET',
                      'RRB Railways',
                      'SSC CGL',
                      'Vijetha',
                      'General Studies',
                      'Arithmetic'
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                        }}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 border border-slate-200/80 transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to="/shop"
                    onClick={() => setIsSearchModalOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-extrabold text-slate-800 transition-colors"
                  >
                    <span>Browse All 320+ Books in Store</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
}
