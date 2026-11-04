import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global ScrollToTop Component
 * Ensures every navigation, route change, search param change, or filter
 * always starts strictly at the top of the viewport.
 * Disables browser's native aggressive scrollRestoration.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 1. Tell browser not to automatically restore previous scroll position
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetAllScrolls = () => {
      // Reset window and document scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      // Reset any inner scrolling containers (like AdminLayout main)
      const scrollables = document.querySelectorAll('.overflow-y-auto, [data-scroll-container]');
      scrollables.forEach((el) => {
        if (el.clientHeight > 250) {
          el.scrollTop = 0;
        }
      });
    };

    // Step 1: Immediate reset
    resetAllScrolls();

    // Step 2: Next animation frame (catches React state updates)
    const rafId = requestAnimationFrame(() => {
      resetAllScrolls();
    });

    // Step 3: Short timeout fallback (handles async images and API layout shifts)
    const timerId = setTimeout(() => {
      resetAllScrolls();
    }, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [pathname, search]);

  return null;
}

