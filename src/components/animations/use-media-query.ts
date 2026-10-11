'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe matchMedia hook. Returns `false` on the server and during the
 * first client render, then syncs to the actual media query result post-mount.
 *
 * Use to gate desktop-only behaviour (pinned scroll scenes) so mobile/tablet
 * users get a static vertical layout instead of broken horizontal scroll.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** True when viewport ≥ 768px (Tailwind `md` breakpoint). */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

/** True when viewport ≥ 1024px (Tailwind `lg` breakpoint). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
