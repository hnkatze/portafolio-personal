'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ReactLenis } from 'lenis/react';

interface LenisProviderProps {
  readonly children: ReactNode;
}

/**
 * Smooth-scroll layer powered by Lenis.
 *
 * Lenis updates window.scrollY via requestAnimationFrame, so motion/react's
 * useScroll receives smoothed values automatically — no manual wiring needed.
 *
 * Disabled under prefers-reduced-motion to fall back to native scroll.
 * `syncTouch: false` keeps iOS Safari on native momentum scrolling.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
