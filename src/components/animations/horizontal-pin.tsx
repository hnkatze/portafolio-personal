'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import { useVelocityBlur } from './velocity-blur';

export interface HorizontalPinProps {
  /**
   * Children are the individual "cards" laid out horizontally.
   * Array length drives the outer scroll height: count * pinHeight.
   */
  readonly children: readonly ReactNode[];
  /** Width of each card in vw units (default 70). */
  readonly cardWidth?: number;
  /** Gap between cards in vw units (default 0). */
  readonly gap?: number;
  /** Apply velocity-based blur to first and last card edges */
  readonly velocityBlurEdges?: boolean;
  /**
   * Vertical scroll height per card in vh units (default 70).
   * Total outer height = count * pinHeight. Smaller = faster scrub.
   */
  readonly pinHeight?: number;
  readonly className?: string;
}

const EDGE_FADE_WIDTH = '12vw';

interface CardWrapperProps {
  readonly child: ReactNode;
  readonly cardWidthVw: number;
  readonly gapVw: number;
  readonly index: number;
  readonly count: number;
  readonly isEdge: boolean;
  readonly velocityBlurEdges: boolean;
  readonly scrollProgress: MotionValue<number>;
}

function CardWrapper({
  child,
  cardWidthVw,
  gapVw,
  index,
  count,
  isEdge,
  velocityBlurEdges,
  scrollProgress,
}: CardWrapperProps) {
  const blur = useVelocityBlur(scrollProgress);

  // Scale + opacity based on distance from the currently-active card.
  // active = scrollProgress * (count - 1). Distance is in "card units".
  // dist 0 (active) → scale 1, opacity 1
  // dist 1 (next/prev) → scale 0.88, opacity 0.55
  // dist >= 1.5 → scale 0.85, opacity 0.25
  const cardOpacity = useTransform(scrollProgress, (p) => {
    if (!Number.isFinite(p)) return 1;
    const safe = Math.max(0, Math.min(1, p));
    const active = safe * Math.max(1, count - 1);
    const dist = Math.abs(index - active);
    if (dist <= 0.15) return 1;
    if (dist >= 1.5) return 0.25;
    if (dist <= 1) return 1 - 0.45 * ((dist - 0.15) / 0.85);
    return 0.55 - 0.3 * ((dist - 1) / 0.5);
  });

  const cardScale = useTransform(scrollProgress, (p) => {
    if (!Number.isFinite(p)) return 1;
    const safe = Math.max(0, Math.min(1, p));
    const active = safe * Math.max(1, count - 1);
    const dist = Math.abs(index - active);
    if (dist <= 0.15) return 1;
    if (dist >= 1) return 0.88;
    return 1 - 0.12 * ((dist - 0.15) / 0.85);
  });

  return (
    <motion.div
      className="relative shrink-0 h-full"
      style={{
        width: `${cardWidthVw}vw`,
        paddingRight: `${gapVw}vw`,
        opacity: cardOpacity,
        scale: cardScale,
        willChange: 'opacity, transform',
      }}
    >
      {child}
      {isEdge && velocityBlurEdges && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ filter: blur, willChange: 'filter' }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}

/**
 * Sticky horizontal scroll section.
 *
 * - Outer div: `count * 100vh` tall so the sticky inner has room to scroll
 * - Inner div: `position: sticky; top: 0; height: 100vh; overflow: hidden`
 * - Track div: `display: flex`, translated horizontally via useTransform
 * - Edge fade overlays (decorative, aria-hidden)
 * - Velocity blur on edge cards (optional)
 * - Reduced-motion: renders as vertical stacked list
 */
export function HorizontalPin({
  children,
  cardWidth = 70,
  gap = 0,
  velocityBlurEdges = false,
  pinHeight = 70,
  className,
}: HorizontalPinProps) {
  const shouldReduceMotion = useReducedMotion();
  const outerRef = useRef<HTMLDivElement | null>(null);

  const count = children.length;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Center each card in the viewport at progress 0..1.
  // Offset by (100 - cardWidth) / 2 so card 0 starts centered (not edge-left)
  // and the last card ends centered (not at the right edge).
  const centerOffset = (100 - cardWidth) / 2;
  const trackStartVw = centerOffset;
  const trackEndVw = -(count - 1) * (cardWidth + gap) + centerOffset;
  const trackX = useTransform(
    scrollYProgress,
    [0, 1],
    [`${trackStartVw}vw`, `${trackEndVw}vw`],
  );

  if (shouldReduceMotion) {
    return (
      <div ref={outerRef} className={className}>
        {children.map((child, i) => (
          <div key={i} className="w-full">
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      className={className}
      style={{ height: `${count * pinHeight}vh`, position: 'relative' }}
    >
      {/* Sticky viewport container */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        {/* Horizontally scrolling track */}
        <motion.div
          className="flex h-full"
          style={{ x: trackX, willChange: 'transform' }}
        >
          {children.map((child, i) => (
            <CardWrapper
              key={i}
              child={child}
              cardWidthVw={cardWidth}
              gapVw={gap}
              index={i}
              count={count}
              isEdge={i === 0 || i === count - 1}
              velocityBlurEdges={velocityBlurEdges}
              scrollProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Left edge fade */}
        <div
          className="pointer-events-none absolute top-0 left-0 h-full"
          style={{
            width: EDGE_FADE_WIDTH,
            background:
              'linear-gradient(to right, rgba(255,255,255,0.8), transparent)',
          }}
          aria-hidden="true"
        />
        {/* Right edge fade */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-full"
          style={{
            width: EDGE_FADE_WIDTH,
            background:
              'linear-gradient(to left, rgba(255,255,255,0.8), transparent)',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
