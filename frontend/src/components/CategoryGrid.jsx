import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Layers, X, Search, Check } from 'lucide-react';
import api from '../services/api.js';

// Top curated exam categories with exact matching DB IDs
const PRIMARY_CATEGORIES = [
  {
    name: 'Police Department',
    categoryId: '9,13,34,35',
    icon: '/images/categories/polic.png',
    subtitle: 'SI & Constable',
    badge: 'TS & AP',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    name: 'TGPSC',
    categoryId: '10',
    icon: '/images/categories/tgpsc.png',
    subtitle: 'Group 1, 2, 4',
    badge: 'State PSC',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    name: 'APPSC',
    categoryId: '11',
    icon: '/images/categories/tgpsc.png',
    subtitle: 'Group 1, 2, ASO',
    badge: 'AP State',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    name: 'RRB',
    categoryId: '16,45',
    icon: '/images/categories/rrb.png',
    subtitle: 'NTPC, Group D, ALP',
    badge: 'Railways',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    name: 'SSC',
    categoryId: '15',
    icon: '/images/categories/ssc.png',
    subtitle: 'CGL, CHSL, GD',
    badge: 'Staff Sel.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    name: 'Groups All',
    categoryId: '22,32,33',
    icon: '/images/categories/value.webp',
    subtitle: 'TS & AP Groups',
    badge: 'Top Ranks',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    name: 'DSC & Teaching',
    categoryId: '27,26,28,29',
    icon: '/images/categories/education.png',
    subtitle: 'DSC, TET & SGT',
    badge: 'Teaching',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    name: 'AP-SET & TG-SET',
    categoryId: '58,57,53',
    icon: '/images/categories/education.png',
    subtitle: 'Paper-1 & Core',
    badge: 'SET / NET',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    name: 'UPSC',
    categoryId: '2',
    icon: '/images/categories/upsc.png',
    subtitle: 'Civil Services',
    badge: 'IAS / IPS',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
  },
];

export default function CategoryGrid() {
  const [showAllModal, setShowAllModal] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [modalSearch, setModalSearch] = useState('');

  // Load full categories list for dynamic display & the modal
  useEffect(() => {
    async function loadAllCategories() {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setAllCategories(res.data.categories || []);
        }
      } catch (e) {
        console.error('Failed to load all categories:', e);
      }
    }
    loadAllCategories();
  }, []);

  // Compute unified dynamic categories for the home strip: Primary ones + newly added custom ones
  const dynamicCategories = React.useMemo(() => {
    const primaryIds = new Set();
    PRIMARY_CATEGORIES.forEach((p) => {
      p.categoryId.split(',').forEach((id) => primaryIds.add(String(id.trim())));
    });

    const list = [...PRIMARY_CATEGORIES];

    // Find custom / newly created categories in the DB not in primary presets
    allCategories.forEach((c) => {
      const cIdStr = String(c.id);
      if (!primaryIds.has(cIdStr)) {
        const count = c.product_count || 0;
        list.push({
          name: c.name,
          categoryId: String(c.id),
          icon: '/images/categories/value.webp',
          subtitle: count > 0 ? `${count} Books Available` : 'Exam Books',
          badge: count > 0 ? `${count} Books` : 'New Exam',
          badgeColor: 'bg-red-50 text-red-700 border-red-200',
        });
      }
    });

    return list;
  }, [allCategories]);

  const filteredModalCategories = allCategories.filter((c) => {
    if (!modalSearch.trim()) return true;
    const term = modalSearch.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cNorm = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cNorm.includes(term);
  });

  return (
    <section className="w-full">
      {/* Section Sub-heading with Trust Pill */}
      <div className="flex items-center justify-between mb-2 sm:mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <h2 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 uppercase tracking-wider">
            Explore By Exam Categories
          </h2>
        </div>
        <Link
          to="/shop"
          className="text-[11px] sm:text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          <span>All Categories ({allCategories.length || 42})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid: Responsive Horizontal Scroll with Snap on Mobile / Multi-column on Large Screens */}
      <div className="flex gap-2.5 sm:gap-3 xl:gap-3.5 overflow-x-auto pb-3 pt-0.5 px-0.5 scrollbar-thin scrollbar-thumb-slate-200 w-full">
        {dynamicCategories.map((cat, idx) => (
          <Link
            key={idx}
            to={`/shop?category_id=${cat.categoryId}`}
            className="group relative flex flex-col items-center justify-between min-w-[130px] sm:min-w-[140px] md:min-w-[150px] bg-gradient-to-b from-white via-white to-slate-50/80 rounded-2xl border border-slate-200/90 p-2.5 sm:p-3.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(215,44,53,0.22)] hover:border-red-500/80 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer overflow-hidden shrink-0"
          >
            {/* Top Multi-Color Gradient Highlight Bar on Hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Subtle Ambient Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/20 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Micro Badge Tag */}
            <div className="w-full flex justify-end mb-1">
              <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${cat.badgeColor} tracking-tight leading-none`}>
                {cat.badge}
              </span>
            </div>

            {/* Premium Icon Badge with Dual Ring & Ambient Shadow */}
            <div className="relative mb-2 mt-0.5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-150 p-2 sm:p-2.5 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] ring-4 ring-slate-100/70 group-hover:ring-red-100/80 group-hover:border-red-200 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-red-50/40 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(215,44,53,0.2)] transition-all duration-300">
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_4px_8px_rgba(215,44,53,0.25)] transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Exam Name & Subtitle Details */}
            <div className="w-full text-center space-y-0.5 z-10">
              <h3 className="text-xs sm:text-[13px] font-extrabold text-slate-800 leading-snug group-hover:text-red-600 transition-colors tracking-tight line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[9.5px] sm:text-[10px] text-slate-500 font-semibold group-hover:text-red-500/90 transition-colors tracking-tight truncate w-full">
                {cat.subtitle}
              </p>
            </div>

            {/* Bottom Explore Arrow Action */}
            <div className="w-full mt-1.5 pt-1.5 border-t border-slate-100/90 group-hover:border-red-100/80 flex items-center justify-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-slate-400 group-hover:text-red-600 transition-all duration-200 z-10">
              <span>View Books</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        ))}
      </div>

      {/* ================= VIEW ALL CATEGORIES BUTTON (Directly Under Categories) ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 sm:pt-3">
        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 active:scale-98 transition-all duration-200 cursor-pointer group"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>View All Categories (50+ Exams)</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {allCategories.length > 0 && (
          <button
            onClick={() => setShowAllModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/80 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Quick Category Drawer</span>
          </button>
        )}
      </div>

      {/* ================= QUICK BROWSE ALL 50+ CATEGORIES MODAL ================= */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setShowAllModal(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl flex flex-col z-50 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    All Exam Categories ({allCategories.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Click any exam category to view its official textbooks & guides
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Find exam (e.g. Police, TGPSC, APPSC, DSC, SET, RRB)..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Categories Grid List */}
            <div className="p-4 overflow-y-auto max-h-[60vh] grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredModalCategories.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-xs text-slate-400">
                  No exam categories match "{modalSearch}"
                </div>
              ) : (
                filteredModalCategories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop?category_id=${c.id}`}
                    onClick={() => setShowAllModal(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-red-50/60 border border-slate-200/80 hover:border-red-200 transition-all text-xs font-bold text-slate-800 hover:text-red-600 group"
                  >
                    <span className="truncate">{c.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </Link>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                to="/shop"
                onClick={() => setShowAllModal(false)}
                className="text-xs font-extrabold text-red-600 hover:text-red-700"
              >
                Go to Full Store Catalog →
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
