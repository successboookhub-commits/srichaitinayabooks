import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

const POPULAR_EXAMS = [
  { name: 'TGPSC (Group 1, 2)', query: 'TGPSC', badge: '🔥 Hot' },
  { name: 'APPSC Group 2', query: 'APPSC', badge: 'Top' },
  { name: 'Police SI & Constable', query: 'Police' },
  { name: 'DSC & TET', query: 'DSC' },
  { name: 'RRB Railways', query: 'RRB' },
  { name: 'SSC CGL / GD', query: 'SSC' },
  { name: 'General Studies', query: 'General Studies' },
  { name: 'AP-SET & TG-SET', query: 'SET' },
  { name: 'UPSC Civil Services', query: 'UPSC' },
];

export default function ExamSearchFilter() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const clean = query.trim();
    if (clean) {
      navigate(`/shop?search=${encodeURIComponent(clean)}`);
    } else {
      navigate('/shop');
    }
  };

  const handleExamClick = (examQuery) => {
    navigate(`/shop?search=${encodeURIComponent(examQuery)}`);
  };

  return (
    <div className="bg-gradient-to-r from-red-50/80 via-rose-50/60 to-amber-50/60 rounded-2xl sm:rounded-3xl border border-red-100/90 p-3 sm:p-5 shadow-2xs space-y-2.5 sm:space-y-3">
      {/* Header title */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-xs text-sm sm:text-base shrink-0">
            🎯
          </span>
          <div>
            <h3 className="font-black text-xs sm:text-base text-slate-900 tracking-tight leading-snug flex items-center gap-1.5">
              <span>Which Exam Are You Looking For?</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 hidden sm:inline" />
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
              Search or tap your exam to view curated preparation books instantly
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/shop')}
          className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer shrink-0"
        >
          <span>All 320+ Books</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cute Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-1.5 sm:gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exam (e.g. TGPSC, APPSC, DSC, SI Constable, RRB...)"
            className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 shadow-2xs transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-3.5 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1 sm:gap-1.5"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Popular Exam Clickable Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none pt-0.5">
        <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Exams:
        </span>
        {POPULAR_EXAMS.map((exam) => (
          <button
            key={exam.name}
            type="button"
            onClick={() => handleExamClick(exam.query)}
            className="whitespace-nowrap px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200/80 hover:border-red-300 text-[11px] sm:text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
          >
            <span>{exam.name}</span>
            {exam.badge && (
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-red-100 text-red-700">
                {exam.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

