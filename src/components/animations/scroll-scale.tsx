'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

export interface ScrollScaleProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly from?: number;
  readonly to?: number;
  readonly fromOpacity?: number;
  readonly toOpacity?: number;
}

export function ScrollScale({
  children,
  className,
  from = 0.7,
  to = 1.05,
  fromOpacity = 0.4,
  toOpacity = 1,
}: ScrollScaleProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [from, to, from]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [fromOpacity, toOpacity, toOpacity, fromOpacity],
  );

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}
