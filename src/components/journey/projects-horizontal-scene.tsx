'use client';

import { useRef, useState } from 'react';
import {
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import type { ReactNode } from 'react';
import type { Lang } from '@/lib/types';
import {
  HorizontalPin,
  ScrollCounter,
  I18nSplitWords,
  useIsTablet,
} from '@/components/animations';

/* ================================================================
   ProjectsHorizontalScene — Client Component (T-10)
   Wraps HorizontalPin for the horizontal scroll experience.
   Sticky headline + dynamic ScrollCounter in motion mode.
   Reduced-motion: 2-col grid fallback (original layout).
   ================================================================ */

interface ProjectsHorizontalSceneProps {
  readonly children: readonly ReactNode[];
  readonly count: number;
  readonly lang: Lang;
  /** id forwarded to the <h2> so aria-labelledby resolves */
  readonly headingId?: string;
}

export function ProjectsHorizontalScene({
  children,
  count,
  lang,
  headingId = 'projects-heading',
}: ProjectsHorizontalSceneProps) {
  const shouldReduceMotion = useReducedMotion();
  const isTablet = useIsTablet();
  // Below md (768px) the horizontal pin doesn't fit well — fall back to grid.
  const useStaticFallback = shouldReduceMotion || !isTablet;

  // Wrapper ref for the HorizontalPin — used to derive scroll progress
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);

  // State for the active card index (1-based), updated by scroll progress
  const [activeIndex, setActiveIndex] = useState(1);

  // useScroll must be called unconditionally (before any early return)
  const { scrollYProgress } = useScroll({
    target: pinWrapperRef,
    offset: ['start start', 'end end'],
  });

  // Sync scroll progress → active card index (1-based, clamped).
  // Skip the state update when in fallback mode — counter isn't visible there.
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (useStaticFallback) return;
    if (!Number.isFinite(latest)) return;
    const raw = latest * (count - 1) + 1;
    const clamped = Math.max(1, Math.min(count, Math.round(raw)));
    setActiveIndex(clamped);
  });

  return (
    <>
      {/* Headline — sticky+counter on tablet+, plain block on mobile/reduced. */}
      {useStaticFallback ? (
        <div className="mt-16">
          <h2
            id={headingId}
            className="font-extrabold text-[#0a0a0a] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            <I18nSplitWords textEn="Projects." textEs="Proyectos." />
          </h2>
        </div>
      ) : (
        <div className="sticky top-[6.5rem] z-10 mt-16 flex items-baseline justify-between">
          <h2
            id={headingId}
            className="font-extrabold text-[#0a0a0a] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            <I18nSplitWords textEn="Projects." textEs="Proyectos." />
          </h2>
          <ScrollCounter current={activeIndex} total={count} />
        </div>
      )}

      {/* Pin wrapper ALWAYS rendered so pinWrapperRef can attach. Content
          inside switches between static grid (fallback) and HorizontalPin
          (cinematic). This avoids motion/react's "ref defined but not
          hydrated" error which fires when the target ref's div is never
          mounted. */}
      <div ref={pinWrapperRef}>
        {useStaticFallback ? (
          <ul className="mt-12 mx-auto w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12 list-none p-0 m-0">
            {children.map((child, i) => (
              <li key={i} className="border-t border-[#e4e4e7] pt-8">
                {child}
              </li>
            ))}
          </ul>
        ) : (
          <HorizontalPin cardWidth={60} pinHeight={60} velocityBlurEdges>
            {children.map((child, i) => (
              <div key={i} className="flex items-center h-full px-10">
                <div className="w-full max-w-3xl">{child}</div>
              </div>
            ))}
          </HorizontalPin>
        )}
      </div>
    </>
  );
}
