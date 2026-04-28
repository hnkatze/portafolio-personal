'use client';

import { motion, useReducedMotion } from 'motion/react';

type Rounded = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ShimmerSkeletonProps {
  readonly className?: string;
  readonly width?: number | string;
  readonly height?: number | string;
  readonly rounded?: Rounded;
}

const ROUNDED_MAP: Record<Rounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export function ShimmerSkeleton({
  className,
  width,
  height,
  rounded = 'md',
}: ShimmerSkeletonProps) {
  const shouldReduceMotion = useReducedMotion();

  const style: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  const base = `relative overflow-hidden bg-white/5 ${ROUNDED_MAP[rounded]} ${className ?? ''}`.trim();

  if (shouldReduceMotion) {
    return <div className={base} style={style} aria-hidden="true" />;
  }

  return (
    <div className={base} style={style} aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
