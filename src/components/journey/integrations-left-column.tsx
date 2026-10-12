'use client';

import type { Lang } from '@/lib/types';
import { ScrollCounter, HairlineProgress, SplitWords } from '@/components/animations';
import { useScrollytelling } from '@/components/animations/sticky-scrollytelling';

/* ================================================================
   IntegrationsLeftColumn — Client Component (T-16)
   Sticky left column for the integrations scrollytelling scene.
   Consumes StickyScrollytelling context for activeScene + progress.
   ================================================================ */

interface IntegrationsLeftColumnProps {
  readonly lang: Lang;
  /** Total number of scenes — used as the counter denominator */
  readonly total: number;
}

export function IntegrationsLeftColumn({ lang, total }: IntegrationsLeftColumnProps) {
  const { activeScene, scrollProgress } = useScrollytelling();

  const prefix = lang === 'en' ? 'LIVE' : 'EN VIVO';

  return (
    <div className="flex flex-col gap-6 py-12 overflow-hidden">
      {/* Editorial headline — clamped to fit the narrow sticky column */}
      <h2
        id="integrations-heading"
        className="font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95] break-words"
        style={{ fontSize: 'clamp(2rem, 4.5vw, 4.5rem)' }}
      >
        <SplitWords text="Integrations." />
      </h2>

      {/* Scene counter — updates as user scrolls; aria-live in ScrollCounter */}
      <ScrollCounter current={activeScene + 1} total={total} prefix={prefix} />

      {/* Hairline progress bar driven by scroll MotionValue */}
      <HairlineProgress progress={scrollProgress} className="w-full" />
    </div>
  );
}
