import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Tag, Building2, ChevronRight } from 'lucide-react';
import api from '../services/api.js';
import realtime from '../services/realtime.js';
import BannerSlider from '../components/BannerSlider.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import ExamSearchFilter from '../components/ExamSearchFilter.jsx';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [categorySections, setCategorySections] = useState([]);
  const [publicationSections, setPublicationSections] = useState([]);
  const [showcaseSettings, setShowcaseSettings] = useState({
    show_category_showcase: true,
    show_publication_showcase: true,
  });
  const [visibleCatCount, setVisibleCatCount] = useState(6);
  const [visiblePubCount, setVisiblePubCount] = useState(6);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Instantly load Banners & Categories (Fastest - 10ms-20ms)
    api.getCached('/banners').then((res) => {
      if (isMounted && res.data?.success) setBanners(res.data.banners || []);
    }).catch(() => {});

    api.getCached('/categories').then((res) => {
      if (isMounted && res.data?.success) setCategories((res.data.categories || []).slice(0, 10));
    }).catch(() => {});

    // 2. Stream in Sections & Featured Products in parallel
    api.getCached('/home-sections').then((res) => {
      if (isMounted && res.data?.success) {
        if (res.data.sections) setHomeSections(res.data.sections);
        if (res.data.categorySections) setCategorySections(res.data.categorySections);
        if (res.data.publicationSections) setPublicationSections(res.data.publicationSections);
        if (res.data.settings) setShowcaseSettings(res.data.settings);
      }
    }).catch(() => {});

    api.getCached('/products?featured=true&limit=12').then((res) => {
      if (isMounted && res.data?.success) setFeaturedProducts(res.data.products || []);
    }).catch(() => {});

    api.getCached('/products?limit=12').then((res) => {
      if (isMounted && res.data?.success) setRecentProducts(res.data.products || []);
    }).catch(() => {});

    // 3. Real-Time Store Sync: Automatically refresh on live updates
    const unsubscribe = realtime.on('store_updated', () => {
      if (!isMounted) return;
      api.getCached('/banners', { params: { _r: Date.now() } }).then((res) => {
        if (res.data?.success) setBanners(res.data.banners || []);
      });
      api.getCached('/home-sections', { params: { _r: Date.now() } }).then((res) => {
        if (res.data?.success) {
          if (res.data.sections) setHomeSections(res.data.sections);
          if (res.data.categorySections) setCategorySections(res.data.categorySections);
          if (res.data.publicationSections) setPublicationSections(res.data.publicationSections);
        }
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 w-full max-w-[1800px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 pt-2 sm:pt-4 pb-6">
      
      {/* Hero Banner Slider */}
      <section className="w-full">
        <BannerSlider banners={banners} />
      </section>

      {/* Quick Exam Finder: Which exam are you looking for? */}
      <section className="w-full">
        <ExamSearchFilter />
      </section>

      {/* ================= 1. FEATURED BOOKS / CURATED STUDY MATERIALS ================= */}
      {homeSections.length > 0 ? (
        homeSections.map((section) => {
          if (!section.products || section.products.length === 0) return null;
          return (
            <section key={section.id} className="space-y-4 sm:space-y-5 pt-1 sm:pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{section.title}</h2>
                  </div>
                  {section.subtitle && (
                    <p className="text-xs text-gray-500 mt-1 font-medium">{section.subtitle}</p>
                  )}
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
                >
                  <span>See More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                {section.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        /* Fallback if no custom sections configured */
        featuredProducts.length > 0 && (
          <section className="space-y-4 sm:space-y-5 pt-1 sm:pt-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-xl md:text-2xl font-black text-gray-900">Featured Study Materials</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">Specially curated materials for competitive exams & top ranks.</p>
              </div>
              <Link
                to="/shop?featured=true"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>See More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )
      )}

      {/* ================= 2. OFFICIAL EXAM CATEGORIES GRID ================= */}
      <section className="w-full pt-2 sm:pt-4 border-t border-slate-100">
        <CategoryGrid />
      </section>

      {/* ================= 2. BASED ON CATEGORIES SHOWCASE ================= */}
      {showcaseSettings.show_category_showcase && categorySections.length > 0 && (
        <div className="space-y-8 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Books by Exam Categories
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Complete syllabus collections and textbooks categorized by competitive exam
                </p>
              </div>
            </div>

            <Link
              to="/categories"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All 42 Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Render each category with its books */}
          <div className="space-y-8">
            {categorySections.slice(0, visibleCatCount).map((cat) => (
              <section key={`cat-sec-${cat.id}`} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <h3 className="text-lg md:text-xl font-extrabold text-gray-900">{cat.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {cat.total_books} books
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Top study materials for {cat.name}</p>
                  </div>
                  <Link
                    to={`/shop?category_id=${cat.id}`}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
                  >
                    <span>See All {cat.name} Books</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                  {cat.products.map((p) => (
                    <ProductCard key={`cat-prod-${cat.id}-${p.id}`} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Show More Categories Button */}
          {categorySections.length > visibleCatCount && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleCatCount((prev) => prev + 6)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-colors cursor-pointer shadow-2xs"
              >
                Load More Exam Categories ({categorySections.length - visibleCatCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. BASED ON PUBLICATIONS SHOWCASE ================= */}
      {showcaseSettings.show_publication_showcase && publicationSections.length > 0 && (
        <div className="space-y-8 pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Books by Leading Publishers &amp; Publications
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Authentic study guides from Andhra Pradesh &amp; Telangana's most renowned educational publishers
                </p>
              </div>
            </div>

            <Link
              to="/publications"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All 104 Publishers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Render each publication with its books */}
          <div className="space-y-8">
            {publicationSections.slice(0, visiblePubCount).map((pub) => (
              <section key={`pub-sec-${pub.id}`} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <h3 className="text-lg md:text-xl font-extrabold text-gray-900">{pub.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                        {pub.total_books} books
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Authentic titles published by {pub.name}</p>
                  </div>
                  <Link
                    to={`/shop?publication_id=${pub.id}`}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 group"
                  >
                    <span>See All {pub.name} Titles</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                  {pub.products.map((p) => (
                    <ProductCard key={`pub-prod-${pub.id}-${p.id}`} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Show More Publications Button */}
          {publicationSections.length > visiblePubCount && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisiblePubCount((prev) => prev + 6)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-colors cursor-pointer shadow-2xs"
              >
                Load More Publishers ({publicationSections.length - visiblePubCount} remaining)
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
