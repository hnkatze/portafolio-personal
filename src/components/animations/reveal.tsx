'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

export interface RevealProps {
  readonly children: ReactNode;
  readonly direction?: RevealDirection;
  readonly delay?: number;
  readonly duration?: number;
  readonly stagger?: number;
  readonly once?: boolean;
  readonly amount?: number;
  readonly className?: string;
}

const OFFSET_PRESETS: Record<RevealDirection, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -40 },
  right: { x: 40 },
  fade: {},
};

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  stagger,
  once = true,
  amount = 0.15,
  className,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, amount });

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = OFFSET_PRESETS[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0 }
      }
      transition={{
        duration,
        delay,
        ease: EASE,
        ...(stagger ? { staggerChildren: stagger } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}
