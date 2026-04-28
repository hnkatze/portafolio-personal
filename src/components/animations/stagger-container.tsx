'use client';

import { Children, useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

type StaggerDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

export interface StaggerContainerProps {
  readonly children: ReactNode;
  readonly stagger?: number;
  readonly direction?: StaggerDirection;
  readonly className?: string;
  readonly amount?: number;
}

const OFFSET_PRESETS: Record<StaggerDirection, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -40 },
  right: { x: 40 },
  fade: {},
};

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export function StaggerContainer({
  children,
  stagger = 0.1,
  direction = 'up',
  className,
  amount = 0.15,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount });

  const childArray = Children.toArray(children);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = OFFSET_PRESETS[direction];

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0 }}
          animate={
            isInView
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: offset.x ?? 0, y: offset.y ?? 0 }
          }
          transition={{
            duration: 0.6,
            delay: index * stagger,
            ease: EASE,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
