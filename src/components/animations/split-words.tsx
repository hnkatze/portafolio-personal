'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

export interface SplitWordsProps {
  readonly text: string;
  readonly delay?: number;
  readonly stagger?: number;
  readonly className?: string;
  readonly amount?: number;
  readonly once?: boolean;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SplitWords({
  text,
  delay = 0,
  stagger = 0.06,
  className,
  amount = 0.5,
  once = true,
}: SplitWordsProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { amount, once });

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.12em]"
        >
          <motion.span
            className="inline-block will-change-transform origin-bottom"
            initial={{ y: '120%', rotateX: -50, opacity: 0 }}
            animate={
              inView
                ? { y: 0, rotateX: 0, opacity: 1 }
                : { y: '120%', rotateX: -50, opacity: 0 }
            }
            transition={{
              duration: 1,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
