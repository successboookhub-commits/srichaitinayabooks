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
  SlidersHorizontal
} from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { fuzzyMatch } from '../utils/fuzzySearch.js';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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

  // Load Categories & Publications once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, pubRes] = await Promise.all([
          api.get('/categories'),
          api.get('/publications'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories || []);
        if (pubRes.data.success) setPublications(pubRes.data.publications || []);
      } catch (err) {
        console.error('Failed to load categories or publications:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Products whenever filters/search change
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
      // Clear search term when picking a category so all books in that category are shown
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

  const hasActiveFilters = Boolean(searchParam || selectedCategory || selectedPublication || featured);

  return (
    <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-8 space-y-4 sm:space-y-6">
      
      {/* ================= PAGE TITLE: ALL BOOKS & PUBLICATIONS ================= */}
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
            Showing {products.length} {products.length === 1 ? 'book' : 'books'} available for purchase.
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

      {/* ================= MOBILE FILTER BAR (Only on Mobile/Tablet so books stay at top) ================= */}
      <div className="lg:hidden flex items-center justify-between gap-2 p-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-800 transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-red-600" />
          <span>Filter by Exam Category ({categories.length})</span>
          {(selectedCategory || selectedPublication) && (
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleResetAll}
            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* ================= ACTIVE FILTER CHIPS (Quick 1-tap dismiss) ================= */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filtered:</span>
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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs">
              <span>{activeCategoryObj.name}</span>
              <button
                onClick={() => handleCategorySelect(selectedCategory)}
                className="hover:text-red-600 cursor-pointer"
                title="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activePublicationObj && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs">
              <span>Pub: {activePublicationObj.name}</span>
              <button
                onClick={() => handlePublicationSelect(selectedPublication)}
                className="hover:text-red-600 cursor-pointer"
                title="Remove publisher filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* ================= MAIN CONTENT GRID (DESKTOP SIDEBAR + PRODUCTS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
        
        {/* ================= LEFT SIDEBAR FILTERS (Hidden on mobile so products are immediately visible) ================= */}
        <aside className="hidden lg:block space-y-5 lg:sticky lg:top-24">
          
          {/* Categories Card with Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-600" />
                <span>Categories</span>
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
                  <span>Publications</span>
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

        {/* ================= RIGHT MAIN PRODUCT GRID (Immediately at top on mobile!) ================= */}
        <main className="lg:col-span-3 w-full">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-slate-100 aspect-[3/4] rounded-2xl border border-slate-200/60" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 sm:py-20 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  No books found matching {searchParam ? `"${searchParam}"` : 'your filters'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  We could not find books matching this exact query. Try another keyword or explore all materials below.
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
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>

      </div>

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
                Apply & View {products.length} Books
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
