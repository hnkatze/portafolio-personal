'use client';

import { motion, useReducedMotion } from 'motion/react';

export interface MeshGradientProps {
  readonly className?: string;
  readonly colors?: readonly string[];
  readonly animate?: boolean;
}

const DEFAULT_COLORS = ['#60a5fa', '#a78bfa', '#3b82f6', '#8b5cf6'] as const;

interface Blob {
  readonly id: string;
  readonly color: string;
  readonly baseCx: number;
  readonly baseCy: number;
  readonly r: number;
  readonly duration: number;
  readonly cxRange: readonly [number, number];
  readonly cyRange: readonly [number, number];
}

const BASE_BLOBS: readonly Omit<Blob, 'color'>[] = [
  {
    id: 'mg-0',
    baseCx: 25,
    baseCy: 30,
    r: 35,
    duration: 12,
    cxRange: [20, 40],
    cyRange: [25, 45],
  },
  {
    id: 'mg-1',
    baseCx: 75,
    baseCy: 25,
    r: 32,
    duration: 14,
    cxRange: [60, 80],
    cyRange: [20, 35],
  },
  {
    id: 'mg-2',
    baseCx: 60,
    baseCy: 75,
    r: 38,
    duration: 15,
    cxRange: [45, 70],
    cyRange: [65, 85],
  },
  {
    id: 'mg-3',
    baseCx: 20,
    baseCy: 80,
    r: 30,
    duration: 10,
    cxRange: [15, 35],
    cyRange: [70, 90],
  },
];

export function MeshGradient({
  className,
  colors = DEFAULT_COLORS,
  animate = true,
}: MeshGradientProps) {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animate && !shouldReduceMotion;

  const blobs: Blob[] = BASE_BLOBS.map((b, i) => ({
    ...b,
    color: colors[i % colors.length] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]!,
  }));

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`.trim()}
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{ filter: 'blur(60px)' }}
    >
      <defs>
        {blobs.map((blob) => (
          <radialGradient key={`${blob.id}-grad`} id={`${blob.id}-grad`}>
            <stop offset="0%" stopColor={blob.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={blob.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {blobs.map((blob) =>
        isAnimated ? (
          <motion.circle
            key={blob.id}
            r={blob.r}
            fill={`url(#${blob.id}-grad)`}
            style={{ mixBlendMode: 'screen' }}
            initial={{ cx: blob.baseCx, cy: blob.baseCy }}
            animate={{
              cx: [blob.cxRange[0], blob.cxRange[1], blob.cxRange[0]],
              cy: [blob.cyRange[0], blob.cyRange[1], blob.cyRange[0]],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ) : (
          <circle
            key={blob.id}
            cx={blob.baseCx}
            cy={blob.baseCy}
            r={blob.r}
            fill={`url(#${blob.id}-grad)`}
            style={{ mixBlendMode: 'screen' }}
          />
        ),
      )}
    </svg>
  );
}
