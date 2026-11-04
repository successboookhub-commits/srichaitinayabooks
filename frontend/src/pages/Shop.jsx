import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  BookOpen,
  Search,
  X,
  RotateCcw,
  Check,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import RecentlyViewedBooks from '../components/RecentlyViewedBooks.jsx';
import { fuzzyMatch } from '../utils/fuzzySearch.js';
import { detectProductMedium } from '../utils/mediumDetector.js';

// Curated Top Exam Filters with mapped category IDs
const QUICK_EXAM_PILLS = [
  { id: '', name: 'All Exams' },
  { id: '10', name: 'TGPSC (Group 1, 2, 4)' },
  { id: '11', name: 'APPSC (Group 1, 2, ASO)' },
  { id: '9,13,34,35', name: 'Police SI & Constable' },
  { id: '16,45', name: 'RRB / Railways' },
  { id: '15', name: 'SSC (CGL, CHSL, GD)' },
  { id: '22,32,33', name: 'Groups All (TS & AP)' },
  { id: '27,26,28,29', name: 'DSC & Teaching (TET/SGT)' },
  { id: '58,57,53', name: 'AP-SET & TG-SET' },
  { id: '2', name: 'UPSC Civil Services' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Medium Filter & Sorting
  const [selectedMedium, setSelectedMedium] = useState('all'); // 'all', 'telugu', 'english'
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'discount'

  // Sidebar mini-search filters
  const [categoryFilterQuery, setCategoryFilterQuery] = useState('');
  const [pubFilterQuery, setPubFilterQuery] = useState('');

  const searchParam = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category_id') || '';
  const selectedPublication = searchParams.get('publication_id') || '';
  const featured = searchParams.get('featured') || '';

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFiltersOpen]);

  // Load Categories & Publications once (Cached 0ms)
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, pubRes] = await Promise.all([
          api.getCached('/categories'),
          api.getCached('/publications'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories || []);
        if (pubRes.data.success) setPublications(pubRes.data.publications || []);
      } catch (err) {
        console.error('Failed to load categories or publications:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Products whenever category/publication/search changes
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category_id', selectedCategory);
        if (selectedPublication) params.append('publication_id', selectedPublication);
        if (searchParam) params.append('search', searchParam);
        if (featured) params.append('featured', featured);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, selectedPublication, searchParam, featured]);

  // Category select/toggle
  const handleCategorySelect = (id) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const next = new URLSearchParams(searchParams);
    if (selectedCategory === String(id)) {
      next.delete('category_id');
    } else {
      next.set('category_id', id);
      next.delete('search');
    }
    setSearchParams(next);
  };

  // Publication select/toggle
  const handlePublicationSelect = (id) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const next = new URLSearchParams(searchParams);
    if (selectedPublication === String(id)) {
      next.delete('publication_id');
    } else {
      next.set('publication_id', id);
    }
    setSearchParams(next);
  };

  // Reset all filters
  const handleResetAll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setSelectedMedium('all');
    setSortBy('default');
    setSearchParams(new URLSearchParams());
  };

  // Filtered categories via mini-search
  const filteredCategories = useMemo(() => {
    if (!categoryFilterQuery.trim()) return categories;
    return categories.filter((c) => fuzzyMatch(c.name, categoryFilterQuery));
  }, [categories, categoryFilterQuery]);

  // Filtered publications via mini-search
  const filteredPublications = useMemo(() => {
    if (!pubFilterQuery.trim()) return publications;
    return publications.filter((p) => fuzzyMatch(p.name, pubFilterQuery));
  }, [publications, pubFilterQuery]);

  // Find active category / publication objects for labels
  const selectedCatIds = selectedCategory.split(',').filter(Boolean);
  const activeCategoryObj = categories.find((c) => selectedCatIds.includes(String(c.id)));
  const activePublicationObj = publications.find((p) => String(p.id) === String(selectedPublication));

  // Compute products filtered by medium and sorted
  const displayedProducts = useMemo(() => {
    let list = [...products];

    // Medium filter
    if (selectedMedium !== 'all') {
      list = list.filter((p) => {
        const med = detectProductMedium(p);
        if (selectedMedium === 'telugu') {
          return med === 'Telugu Medium' || med === 'Bilingual';
        }
        if (selectedMedium === 'english') {
          return med === 'English Medium' || med === 'Bilingual';
        }
        return true;
      });
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => (parseFloat(a.total_price || a.price) || 0) - (parseFloat(b.total_price || b.price) || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (parseFloat(b.total_price || b.price) || 0) - (parseFloat(a.total_price || a.price) || 0));
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (parseFloat(b.discount) || 0) - (parseFloat(a.discount) || 0));
    }

    return list;
  }, [products, selectedMedium, sortBy]);

  const hasActiveFilters = Boolean(
    searchParam || selectedCategory || selectedPublication || featured || selectedMedium !== 'all' || sortBy !== 'default'
  );

  return (
    <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* ================= PAGE TITLE ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            {searchParam ? (
              <>
                Search Results for <span className="text-red-600">"{searchParam}"</span>
              </>
            ) : activeCategoryObj ? (
              <>
                Category: <span className="text-red-600">{activeCategoryObj.name}</span>
              </>
            ) : activePublicationObj ? (
              <>
                Publisher: <span className="text-red-600">{activePublicationObj.name}</span>
              </>
            ) : (
              'All Books & Publications'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'book' : 'books'} available for immediate dispatch.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetAll}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* ================= QUICK EXAM FILTER PILLS (1-Tap Filtering) ================= */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-600">
          <Sparkles className="w-3.5 h-3.5 text-red-600" />
          <span>Quick Exam Select:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_EXAM_PILLS.map((pill) => {
            const isSelected = selectedCategory === pill.id;
            return (
              <button
                key={pill.name}
                onClick={() => handleCategorySelect(pill.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {pill.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MEDIUM & SORT CONTROLS BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Medium Filter Pills (Telugu / English / All) */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline">Medium:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedMedium('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMedium === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Mediums
            </button>
            <button
              onClick={() => setSelectedMedium('telugu')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedMedium === 'telugu'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Telugu Medium (T/M)</span>
            </button>
            <button
              onClick={() => setSelectedMedium('english')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedMedium === 'english'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>English Medium (E/M)</span>
            </button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider hidden md:inline">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort books by price or discount"
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 cursor-pointer"
            >
              <option value="default">Default (Featured)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount (%)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Exams</span>
          </button>
        </div>
      </div>

      {/* ================= ACTIVE FILTER CHIPS ================= */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
          {searchParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-xs">
              <span>Search: "{searchParam}"</span>
              <button
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete('search');
                  setSearchParams(next);
                }}
                className="hover:text-red-900 cursor-pointer"
                title="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeCategoryObj && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-bold text-xs">
              <span>Category: {activeCategoryObj.name}</span>
              <button
                onClick={() => handleCategorySelect(activeCategoryObj.id)}
                className="hover:text-red-900 cursor-pointer"
                title="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activePublicationObj && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs">
              <span>Publisher: {activePublicationObj.name}</span>
              <button
                onClick={() => handlePublicationSelect(activePublicationObj.id)}
                className="hover:text-slate-950 cursor-pointer"
                title="Remove publisher filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedMedium !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
              <span>Medium: {selectedMedium === 'telugu' ? 'Telugu Medium' : 'English Medium'}</span>
              <button
                onClick={() => setSelectedMedium('all')}
                className="hover:text-emerald-950 cursor-pointer"
                title="Remove medium filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* ================= MAIN CONTENT GRID (DESKTOP SIDEBAR + PRODUCTS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
        
        {/* ================= LEFT SIDEBAR FILTERS ================= */}
        <aside className="hidden lg:block space-y-5 lg:sticky lg:top-24">
          
          {/* Categories Card with Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-600" />
                <span>All Categories ({categories.length})</span>
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => handleCategorySelect(selectedCategory)}
                  className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Quick Filter Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter categories (e.g. SET, Police)..."
                value={categoryFilterQuery}
                onChange={(e) => setCategoryFilterQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
              />
              {categoryFilterQuery && (
                <button
                  type="button"
                  onClick={() => setCategoryFilterQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Buttons List */}
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {filteredCategories.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No categories found.</p>
              ) : (
                filteredCategories.map((c) => {
                  const isSelected = selectedCategory === String(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCategorySelect(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Publications Card with Search */}
          {publications.length > 0 && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  <span>Publishers ({publications.length})</span>
                </h3>
                {selectedPublication && (
                  <button
                    onClick={() => handlePublicationSelect(selectedPublication)}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Publication Quick Filter Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter publisher (e.g. Vijetha, Sandeep)..."
                  value={pubFilterQuery}
                  onChange={(e) => setPubFilterQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                />
                {pubFilterQuery && (
                  <button
                    type="button"
                    onClick={() => setPubFilterQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Publication Buttons List */}
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {filteredPublications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No publications found.</p>
                ) : (
                  filteredPublications.map((p) => {
                    const isSelected = selectedPublication === String(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => handlePublicationSelect(p.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </aside>

        {/* ================= RIGHT MAIN PRODUCT GRID ================= */}
        <main className="lg:col-span-3 w-full">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-slate-100 aspect-[3/4] rounded-2xl border border-slate-200/60" />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-20 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  No books found matching {selectedMedium !== 'all' ? `the selected medium (${selectedMedium})` : searchParam ? `"${searchParam}"` : 'your filters'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Try switching between Telugu Medium and English Medium, or reset filters to see all available editions.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  onClick={handleResetAll}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-xs shadow-md shadow-red-500/25 transition-all cursor-pointer"
                >
                  Clear Filters & Show All Books
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* ================= RECENTLY VIEWED BOOKS AT BOTTOM OF SHOP ================= */}
      <RecentlyViewedBooks title="Recently Explored Books" />

      {/* ================= MOBILE FILTER DRAWER / SHEET ================= */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileFiltersOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Filter Books</h3>
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Categories ({categories.length})</h4>
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategorySelect(selectedCategory)}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Find category..."
                    value={categoryFilterQuery}
                    onChange={(e) => setCategoryFilterQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                  {categoryFilterQuery && (
                    <button
                      type="button"
                      onClick={() => setCategoryFilterQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {filteredCategories.map((c) => {
                    const isSelected = selectedCategory === String(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          handleCategorySelect(c.id);
                          setIsMobileFiltersOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Publications */}
              {publications.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Publications ({publications.length})</h4>
                    {selectedPublication && (
                      <button
                        onClick={() => handlePublicationSelect(selectedPublication)}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Find publisher..."
                      value={pubFilterQuery}
                      onChange={(e) => setPubFilterQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                    {pubFilterQuery && (
                      <button
                        type="button"
                        onClick={() => setPubFilterQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                    {filteredPublications.map((p) => {
                      const isSelected = selectedPublication === String(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            handlePublicationSelect(p.id);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-500/25 active:scale-98 transition-all cursor-pointer"
              >
                Apply & View {displayedProducts.length} Books
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
