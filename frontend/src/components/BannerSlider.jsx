import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../services/api.js';

export default function BannerSlider({ banners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!banners.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners.length) {
    return (
      <div className="w-full aspect-[2.55/1] max-h-[520px] rounded-2xl md:rounded-3xl bg-slate-100 animate-pulse border border-slate-200/60 shadow-xs flex items-center justify-center">
        <div className="w-7 h-7 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-lg bg-gray-900 group">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((b, idx) => (
          <div key={b.id || idx} className="w-full shrink-0 relative aspect-[2.55/1] max-h-[520px] bg-white">
            <img
              src={getImageUrl(b.image)}
              alt={b.title || 'Promotional Banner'}
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
              decoding="async"
              className="w-full h-full object-contain object-center"
            />
            {b.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 md:p-10">
                <h3 className="text-white text-lg md:text-3xl font-extrabold tracking-tight drop-shadow-md">
                  {b.title}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all rounded-full ${
                  currentIndex === i ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

