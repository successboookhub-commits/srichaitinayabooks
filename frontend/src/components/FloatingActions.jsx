import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function FloatingActions() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showTopBtn) return null;

  return (
    <aside aria-label="Quick Actions" className="fixed right-3.5 sm:right-6 bottom-20 md:bottom-6 z-40 flex flex-col items-center gap-2.5">
      {/* Scroll To Top Button (Visible only on scroll) */}
      <button
        onClick={scrollToTop}
        title="Back to Top"
        aria-label="Back to top"
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-red-600 text-white shadow-lg backdrop-blur-xs flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-slate-700/50 cursor-pointer"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </aside>
  );
}
