'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export interface ScrollParallaxProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly offset?: number;
  readonly scaleTo?: number;
}

export function ScrollParallax({
  children,
  className,
  offset = -120,
  scaleTo,
}: ScrollParallaxProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [scaleTo ?? 1, 1, scaleTo ?? 1],
  );

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, scale: scaleTo !== undefined ? scale : undefined }}
    >
      {children}
    </motion.div>
  );
}
