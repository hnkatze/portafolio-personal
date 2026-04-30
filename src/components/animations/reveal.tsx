'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';
type RevealAs = 'div' | 'section' | 'article' | 'li' | 'span';

export interface RevealProps {
  readonly children: ReactNode;
  readonly direction?: RevealDirection;
  readonly delay?: number;
  readonly duration?: number;
  readonly stagger?: number;
  readonly once?: boolean;
  readonly amount?: number;
  readonly className?: string;
  readonly blur?: number;
  readonly scale?: number;
  readonly rotate?: number;
  readonly as?: RevealAs;
}

const OFFSET_PRESETS: Record<RevealDirection, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -40 },
  right: { x: 40 },
  fade: {},
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  stagger: _stagger,
  once = false,
  amount = 0.15,
  className,
  blur = 12,
  scale = 0.95,
  rotate = 0,
  as = 'div',
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, amount });
  const Tag = motion[as];
  const offset = OFFSET_PRESETS[direction];

  void _stagger;

  if (shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      ref={ref as never}
      className={className}
      initial={{
        opacity: 0,
        x: offset.x ?? 0,
        y: offset.y ?? 0,
        scale,
        rotate,
        filter: `blur(${blur}px)`,
      }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
          : {
              opacity: 0,
              x: offset.x ?? 0,
              y: offset.y ?? 0,
              scale,
              rotate,
              filter: `blur(${blur}px)`,
            }
      }
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
