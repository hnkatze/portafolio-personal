'use client';

import { Children, useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';

export interface SpotlightStackProps {
  /**
   * Each child occupies the full stack area.
   * They are always in the DOM (opacity 0 → 1 → 0 via scroll).
   */
  readonly children: ReactNode;
  readonly className?: string;
  /** Height of the sticky viewport in CSS (default "100vh") */
  readonly viewportHeight?: string;
}

interface StackItemProps {
  readonly child: ReactNode;
  readonly scrollProgress: MotionValue<number>;
  readonly index: number;
  readonly count: number;
  readonly reducedMotion: boolean | null;
}

/**
 * Computes opacity for an item given the global scroll progress (0..1)
 * and the item's index in a stack of `count` items.
 *
 * Each item "owns" a segment of length 1/count. Inside its segment plateau
 * the item is fully visible. At segment boundaries it crossfades with the
 * neighbouring item. First/last items extend their plateau out to the
 * track boundary so they are fully visible at progress 0 / progress 1.
 */
function computeOpacity(p: number, index: number, count: number): number {
  if (!Number.isFinite(p)) return index === 0 ? 1 : 0;
  const clamped = Math.max(0, Math.min(1, p));
  const itemPos = clamped * count; // 0..count
  const center = index + 0.5;
  const dist = Math.abs(itemPos - center);

  // First item stays at 1 from progress 0 until itemPos crosses (0.5 + crossfade).
  if (index === 0 && itemPos < 0.5) return 1;
  // Last item stays at 1 once itemPos passes (count - 0.5 - crossfade).
  if (index === count - 1 && itemPos > count - 0.5) return 1;

  if (dist <= 0.4) return 1;
  if (dist >= 0.6) return 0;
  // Linear crossfade between dist 0.4 and 0.6 (width 0.2).
  return 1 - (dist - 0.4) / 0.2;
}

/**
 * Computes scale for an item — slightly de-scales the inactive items so
 * the active one feels "lifted". Same model as opacity but mapped to
 * a smaller range.
 */
function computeScale(p: number, index: number, count: number): number {
  if (!Number.isFinite(p)) return index === 0 ? 1 : 0.92;
  const clamped = Math.max(0, Math.min(1, p));
  const itemPos = clamped * count;
  const center = index + 0.5;
  const dist = Math.abs(itemPos - center);

  if (index === 0 && itemPos < 0.5) return 1;
  if (index === count - 1 && itemPos > count - 0.5) return 1;

  if (dist <= 0.4) return 1;
  if (dist >= 0.6) return 0.92;
  return 1 - 0.08 * ((dist - 0.4) / 0.2);
}

/**
 * Computes vertical translate (in vh) — items slide up as they enter
 * the spotlight, slide down as they leave. Adds editorial-cinematic feel.
 */
function computeTranslateY(p: number, index: number, count: number): number {
  if (!Number.isFinite(p)) return 0;
  const clamped = Math.max(0, Math.min(1, p));
  const itemPos = clamped * count;
  const center = index + 0.5;
  const offset = itemPos - center; // negative = before center, positive = after

  if (index === 0 && itemPos < 0.5) return 0;
  if (index === count - 1 && itemPos > count - 0.5) return 0;

  // Slide ±4vh based on offset, capped at boundary
  const capped = Math.max(-0.6, Math.min(0.6, offset));
  return capped * 6; // -3.6vh to +3.6vh
}

function StackItem({
  child,
  scrollProgress,
  index,
  count,
  reducedMotion,
}: StackItemProps) {
  const opacity = useTransform(scrollProgress, (v) =>
    computeOpacity(v, index, count),
  );
  const scale = useTransform(scrollProgress, (v) =>
    computeScale(v, index, count),
  );
  const y = useTransform(scrollProgress, (v) => {
    const vh = computeTranslateY(v, index, count);
    return `${vh}vh`;
  });

  const isFirst = index === 0;

  if (reducedMotion) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: isFirst ? 1 : 0 }}
        aria-hidden={isFirst ? undefined : 'true'}
      >
        {child}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity, scale, y, willChange: 'opacity, transform' }}
    >
      {child}
    </motion.div>
  );
}

/**
 * Spotlight Stack
 *
 * All children are always in the DOM stacked via `position: absolute; inset: 0`.
 * As the user scrolls through the outer scroll-height, each child is spotlit
 * via per-child opacity + scale + translateY derived from a functional
 * useTransform on scrollYProgress.
 */
export function SpotlightStack({
  children,
  className,
  viewportHeight = '100vh',
}: SpotlightStackProps) {
  const shouldReduceMotion = useReducedMotion();
  const outerRef = useRef<HTMLDivElement | null>(null);
  const childArray = Children.toArray(children);
  const count = childArray.length;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ height: `${count * 100}vh`, position: 'relative' }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: viewportHeight }}
      >
        <div className="relative h-full w-full">
          {childArray.map((child, i) => (
            <StackItem
              key={i}
              child={child}
              scrollProgress={scrollYProgress}
              index={i}
              count={count}
              reducedMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
