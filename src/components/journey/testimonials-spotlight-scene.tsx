'use client';

import { useRef, useState } from 'react';
import {
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import type { ReactNode } from 'react';
import {
  SpotlightStack,
  SplitWords,
  ScrollCounter,
  useIsTablet,
} from '@/components/animations';

/* ================================================================
   TestimonialsSpotlightScene — Client Component (T-13)
   Wraps SpotlightStack for the spotlight scroll experience.
   Sticky headline + VOICE counter above the stack in motion mode.
   Reduced-motion: 2-col grid fallback matching original layout.
   ================================================================ */

interface TestimonialsSpotlightSceneProps {
  readonly children: readonly ReactNode[];
  readonly headingId?: string;
}

export function TestimonialsSpotlightScene({
  children,
  headingId = 'testimonials-heading',
}: TestimonialsSpotlightSceneProps) {
  const shouldReduceMotion = useReducedMotion();
  const isTablet = useIsTablet();
  const useStaticFallback = shouldReduceMotion || !isTablet;
  const count = children.length;

  // Wrapper ref for the SpotlightStack — used to derive scroll progress
  const spotlightWrapperRef = useRef<HTMLDivElement | null>(null);

  // State for the active testimonial index (1-based)
  const [activeIndex, setActiveIndex] = useState(1);

  // useScroll must be called unconditionally (before any early return)
  const { scrollYProgress } = useScroll({
    target: spotlightWrapperRef,
    offset: ['start start', 'end end'],
  });

  // Sync scroll progress → active testimonial index (1-based, clamped).
  // Skip in fallback mode — counter not rendered there.
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
            className="font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            <SplitWords text="Voices." />
          </h2>
        </div>
      ) : (
        <div className="sticky top-[6.5rem] z-10 mt-16 flex items-baseline justify-between">
          <h2
            id={headingId}
            className="font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            <SplitWords text="Voices." />
          </h2>
          <ScrollCounter prefix="VOICE" current={activeIndex} total={count} />
        </div>
      )}

      {/* Spotlight wrapper ALWAYS rendered so spotlightWrapperRef can attach.
          Avoids motion/react's "ref defined but not hydrated" error which
          fires when the target ref's div is never mounted. */}
      <div ref={spotlightWrapperRef}>
        {useStaticFallback ? (
          <div className="mt-12 mx-auto w-full md:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12">
            {children}
          </div>
        ) : (
          <SpotlightStack>
            {children.map((child, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-full h-full px-[var(--shell-padding-x)]"
              >
                <div className="w-full max-w-xl">{child}</div>
              </div>
            ))}
          </SpotlightStack>
        )}
      </div>
    </>
  );
}
