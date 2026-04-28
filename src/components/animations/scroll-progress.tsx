'use client';

import { motion, useScroll, useReducedMotion } from 'motion/react';

export interface ScrollProgressProps {
  readonly className?: string;
  readonly color?: string;
}

export function ScrollProgress({
  className,
  color = '#0a0a0a',
}: ScrollProgressProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (shouldReduceMotion) {
    return null;
  }

  const baseClasses =
    'fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] pointer-events-none';
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <motion.div
      className={classes}
      style={{ scaleX: scrollYProgress, backgroundColor: color }}
      aria-hidden="true"
    />
  );
}
