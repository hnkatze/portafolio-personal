'use client';

import { useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { StickyScrollytelling } from '@/components/animations/sticky-scrollytelling';
import { SplitWords, useIsDesktop } from '@/components/animations';

/* ================================================================
   IntegrationsScrollytellingScene — Client Component (T-17)
   Thin wrapper around StickyScrollytelling.
   Passes leftColumn and scenes to the primitive.

   Reduced-motion fallback: vertical stack with a static headline.
   The leftColumn prop (IntegrationsLeftColumn) relies on
   StickyScrollytelling context so it is only rendered in the
   motion path where the provider is active.
   ================================================================ */

interface IntegrationsScrollytellingSceneProps {
  readonly leftColumn: ReactNode;
  readonly scenes: readonly ReactNode[];
}

export function IntegrationsScrollytellingScene({
  leftColumn,
  scenes,
}: IntegrationsScrollytellingSceneProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  // Split layout requires lg+ (1024px). Below that, fall back to a vertical
  // stack so the content stays readable on tablet/mobile.
  const useStaticFallback = shouldReduceMotion || !isDesktop;

  if (useStaticFallback) {
    return (
      <div className="mt-16">
        {/* Static headline for reduced-motion — no context dependency */}
        <h2
          id="integrations-heading"
          className="font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
        >
          <SplitWords text="Integrations." />
        </h2>
        <div className="mt-20 mx-auto w-[80%] flex flex-col gap-16">
          {scenes.map((scene, i) => (
            <div key={i}>{scene}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <StickyScrollytelling
        left={leftColumn}
        right={
          <>
            {scenes.map((scene, i) => (
              <div key={i} className="flex items-center py-16 pl-12">
                <div className="w-full">{scene}</div>
              </div>
            ))}
          </>
        }
        leftClassName="w-[34%] max-w-[28rem] pr-6"
        rightClassName="flex-1 min-w-0 border-l border-[#e4e4e7]"
        sceneHeight="100vh"
        stickyTop="6.5rem"
      />
    </div>
  );
}
