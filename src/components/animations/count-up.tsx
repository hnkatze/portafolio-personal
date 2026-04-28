'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';

export interface CountUpProps {
  readonly to: number;
  readonly from?: number;
  readonly suffix?: string;
  readonly prefix?: string;
  readonly duration?: number;
  readonly className?: string;
  readonly format?: (value: number) => string;
}

const defaultFormat = (value: number): string => {
  if (Math.abs(value) > 999) {
    return new Intl.NumberFormat('en-US').format(value);
  }
  return String(value);
};

export function CountUp({
  to,
  from = 0,
  suffix = '',
  prefix = '',
  duration = 1.5,
  className,
  format,
}: CountUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const motionValue = useMotionValue(from);
  const [display, setDisplay] = useState<number>(from);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (shouldReduceMotion) {
      setDisplay(to);
      return;
    }

    const controls = animate(motionValue, to, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    });

    const unsubscribe = motionValue.on('change', (v) => {
      setDisplay(Math.round(v));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [inView, shouldReduceMotion, to, duration, motionValue]);

  const formatter = format ?? defaultFormat;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatter(display)}
      {suffix}
    </span>
  );
}
