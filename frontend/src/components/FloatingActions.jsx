import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp } from 'lucide-react';

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

  return (
    <aside aria-label="Quick Actions" className="fixed right-3.5 sm:right-6 bottom-20 md:bottom-6 z-40 flex flex-col items-center gap-2.5">
      
      {/* 1. Scroll To Top Button (Visible on scroll) */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          title="Back to Top"
          aria-label="Back to top"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-red-600 text-white shadow-lg backdrop-blur-xs flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-slate-700/50 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* 2. Direct Call Button */}
      <a
        href="tel:09177110134"
        title="Call Helpline: 09177110134"
        aria-label="Call Helpline"
        className="relative group w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-red-600/40 cursor-pointer border-2 border-white"
      >
        <Phone className="w-5 h-5 animate-bounce-subtle" />
        
        {/* Desktop Tooltip Label */}
        <span className="hidden lg:group-hover:block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
          📞 Call: 09177110134
        </span>
      </a>

      {/* 3. Sticky Official WhatsApp Floating Button */}
      <a
        href="https://wa.me/919177110134?text=Hello%20Sri%20Chaitanya%20Books,%20I%20have%20an%20enquiry%20regarding%20books"
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/50 cursor-pointer border-2 border-white"
      >
        {/* Pulsating Ping Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none" />

        {/* Authentic WhatsApp Icon */}
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.074-1.921-.462-1.644-.683-2.697-2.355-2.778-2.464-.082-.109-.661-.88-.661-1.68 0-.799.414-1.192.56-1.353.148-.162.324-.202.433-.202.109 0 .216.002.31.007.1.005.234-.038.366.279.135.324.461 1.127.502 1.209.041.082.068.179.014.288-.054.108-.082.176-.162.27-.082.095-.172.211-.246.284-.082.081-.168.169-.072.333.095.165.424.7.912 1.134.629.56 1.161.733 1.326.815.164.081.26.072.357-.04.097-.113.414-.482.524-.648.11-.165.22-.138.368-.083.149.055.946.446 1.109.528.163.082.272.122.312.19.04.068.04.394-.104.799z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.659 1.442 5.168L2.054 22l4.98-1.309A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.053c-1.614 0-3.137-.47-4.428-1.282l-.317-.199-2.955.776.789-2.881-.218-.348A8.04 8.04 0 013.947 12C3.947 7.558 7.558 3.947 12 3.947c4.442 0 8.053 3.611 8.053 8.053 0 4.442-3.611 8.053-8.053 8.053z"/>
        </svg>

        {/* Desktop Tooltip Label */}
        <span className="hidden lg:group-hover:block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
          💬 WhatsApp Chat
        </span>
      </a>

    </aside>
  );
}

