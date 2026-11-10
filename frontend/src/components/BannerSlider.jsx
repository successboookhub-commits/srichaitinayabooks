import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../services/api.js';

const DEFAULT_BANNERS = [
  { id: 'def-1', image: '/images/banners/banner1.jpg', title: 'All Competitive Books Available' },
  { id: 'def-2', image: '/images/banners/banner2.jpg', title: 'One-Stop Destination for Competitive Exam Books' },
  { id: 'def-3', image: '/images/banners/banner3.jpg', title: 'Need Help With Booking? 9177110134' },
];

export default function BannerSlider({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use passed banners if valid, otherwise fallback immediately to DEFAULT_BANNERS
  const slides = (Array.isArray(banners) && banners.length > 0) ? banners : DEFAULT_BANNERS;

  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const resolveImage = (b, idx) => {
    const raw = b?.image;
    if (!raw) return DEFAULT_BANNERS[idx % DEFAULT_BANNERS.length].image;
    if (raw.startsWith('/images/banners/') || raw.startsWith('images/banners/')) {
      return raw.startsWith('/') ? raw : `/${raw}`;
    }
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    return getImageUrl(raw);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-lg bg-gray-900 group">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((b, idx) => {
          const fallbackImage = DEFAULT_BANNERS[idx % DEFAULT_BANNERS.length].image;
          const isNumericTitle = !b.title || /^\d+$/.test(String(b.title).trim());
          const showTitleOverlay = !isNumericTitle && b.showOverlay === true;

          return (
            <div key={b.id || idx} className="w-full shrink-0 relative aspect-[2.7/1] max-h-[520px] bg-slate-900">
              <img
                src={resolveImage(b, idx)}
                alt={b.title || 'Sri Chaitanya Book Centre'}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                decoding="async"
                onError={(e) => {
                  if (!e.currentTarget.dataset.fallbackTried) {
                    e.currentTarget.dataset.fallbackTried = 'true';
                    e.currentTarget.src = fallbackImage;
                  }
                }}
                className="w-full h-full object-cover object-center select-none"
              />
              {showTitleOverlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6 md:p-10 pointer-events-none">
                  <h3 className="text-white text-lg md:text-3xl font-extrabold tracking-tight drop-shadow-md">
                    {b.title}
                  </h3>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === i ? 'w-7 h-2 bg-white shadow-sm' : 'w-2 h-2 bg-white/60 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
