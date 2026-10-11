'use client';

import { motion, useReducedMotion, type MotionValue } from 'motion/react';

export interface HairlineProgressProps {
  /**
   * A MotionValue<number> in the range [0, 1] — drives scaleX of the fill bar.
   * Derived from useScroll({ container }) for smooth between-scene progress.
   */
  readonly progress: MotionValue<number>;
  readonly className?: string;
}

/**
 * A 1px hairline bar that fills left-to-right driven by an arbitrary MotionValue.
 * Decorative — aria-hidden to avoid noisy SR announcements.
 */
export function HairlineProgress({ progress, className }: HairlineProgressProps) {
  const shouldReduceMotion = useReducedMotion();

  const trackClasses = 'relative w-full h-px bg-[#e4e4e7] overflow-hidden';
  const outerClasses = className
    ? `${trackClasses} ${className}`
    : trackClasses;

  if (shouldReduceMotion) {
    // Static: show full bar so the element still occupies space
    return (
      <div className={outerClasses} aria-hidden="true">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
      </div>
    );
  }

  return (
    <div className={outerClasses} aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-[#0a0a0a] origin-left"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
