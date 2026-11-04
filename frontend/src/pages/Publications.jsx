import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  ArrowRight,
  Library,
  Sparkles,
  SlidersHorizontal,
  Check,
  Building2,
  ChevronRight,
  X
} from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { fuzzyMatch } from '../utils/fuzzySearch.js';

export default function Publications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPubId = searchParams.get('publication_id') || '';

  const [publications, setPublications] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingPubs, setLoadingPubs] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [pubSearch, setPubSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Load all publications once
  useEffect(() => {
    async function fetchPublications() {
      setLoadingPubs(true);
      try {
        const res = await api.get('/publications');
        if (res.data.success) {
          setPublications(res.data.publications || []);
        }
      } catch (err) {
        console.error('Failed to load publications:', err);
      } finally {
        setLoadingPubs(false);
      }
    }
    fetchPublications();
  }, []);

  // Load products whenever selected publication changes
  useEffect(() => {
    async function fetchProducts() {
      setLoadingProducts(true);
      try {
        const params = new URLSearchParams();
        if (selectedPubId) {
          params.append('publication_id', selectedPubId);
        }
        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error('Failed to load products for publication:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, [selectedPubId]);

  const handleSelectPublication = (id) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const nextParams = new URLSearchParams(searchParams);
    if (!id || id === 'all') {
      nextParams.delete('publication_id');
    } else {
      nextParams.set('publication_id', id);
    }
    setSearchParams(nextParams);
    setBookSearch('');
  };

  const selectedPubObj = publications.find((p) => String(p.id) === String(selectedPubId));

  // Filter the sidebar publications by publisher search query with fuzzy matching
  const filteredPubsList = publications.filter((pub) =>
    fuzzyMatch(pub.name, pubSearch)
  );

  // Filter and sort the actual books on the right with fuzzy matching
  const filteredBooks = products
    .filter((p) => {
      if (!bookSearch.trim()) return true;
      const combined = `${p.name || p.title || ''} ${p.description || ''}`;
      return fuzzyMatch(combined, bookSearch);
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.total_price || a.price || 0);
      const priceB = parseFloat(b.total_price || b.price || 0);
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      return (b.id || 0) - (a.id || 0); // latest
    });

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
        
        {/* Breadcrumb & Clean Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/publications" onClick={() => handleSelectPublication('all')} className="hover:text-red-600 transition-colors">
              Publications
            </Link>
            {selectedPubObj && (
              <>
                <span>/</span>
                <span className="text-slate-800 font-bold truncate max-w-xs">{selectedPubObj.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authorized Publisher Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedPubObj ? selectedPubObj.name : 'All Publications & Authors'}
              </h1>
            </div>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
              Total <strong>{publications.length}</strong> Publication Houses
            </span>
          </div>
        </div>

        {/* Main 2-Column Layout: Left Publications Directory & Right Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR: ALL PUBLICATIONS DIRECTORY ================= */}
          <aside className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col space-y-4 lg:sticky lg:top-20 max-h-[82vh]">
            
            {/* Sidebar Title & Count */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-red-600" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Select Publisher
                </h2>
              </div>
              {selectedPubId && (
                <button
                  onClick={() => handleSelectPublication('all')}
                  className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Quick Search inside Publications */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Find publisher (e.g. Shine, Telugu...)"
                value={pubSearch}
                onChange={(e) => setPubSearch(e.target.value)}
                className="w-full pl-9 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
              />
              {pubSearch && (
                <button
                  onClick={() => setPubSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* "All Publications" Top Button */}
            <button
              onClick={() => handleSelectPublication('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${
                !selectedPubId
                  ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-500/20'
                  : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Library className="w-4 h-4 shrink-0" />
                <span>All Publications</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  !selectedPubId ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {publications.length}
              </span>
            </button>

            {/* Scrollable Publication List */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-50">
              {loadingPubs ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading publishers...</div>
              ) : filteredPubsList.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">No publisher matches "{pubSearch}"</div>
              ) : (
                filteredPubsList.map((pub) => {
                  const isSelected = String(pub.id) === String(selectedPubId);
                  const count = pub.product_count !== undefined ? pub.product_count : null;

                  return (
                    <button
                      key={pub.id}
                      onClick={() => handleSelectPublication(pub.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                        isSelected
                          ? 'bg-red-50 text-red-700 font-extrabold border border-red-200 shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate pr-2">{pub.name}</span>
                      {count !== null && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            isSelected
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

          </aside>

          {/* ================= RIGHT AREA: BOOKS UNDER SELECTED PUBLISHER ================= */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-4">
            
            {/* Filter & Search Bar for Books */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Search Books input */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search books in this list..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all"
                />
              </div>

              {/* Status & Sort options */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold">
                  Showing <strong className="text-slate-900">{filteredBooks.length}</strong> Books
                </span>

                <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-slate-700 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="latest">Latest Editions</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Books Cards Grid */}
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 animate-pulse">
                    <div className="aspect-[3/4] bg-slate-100 rounded-xl" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-lg font-bold text-slate-900">
                    No books found under {selectedPubObj ? `"${selectedPubObj.name}"` : 'this search'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We could not find any books matching your criteria. Try choosing another publication house or reset the filter.
                  </p>
                </div>
                <button
                  onClick={() => handleSelectPublication('all')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  View All Publications
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
                {filteredBooks.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
