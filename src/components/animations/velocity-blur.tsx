'use client';

import {
  useReducedMotion,
  useVelocity,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';

const MAX_BLUR_PX = 4;
const VELOCITY_CLAMP = 2000; // px/s — maps to MAX_BLUR_PX

const SPRING_CONFIG = { damping: 50, stiffness: 400 } as const;

/**
 * Given a scrollYProgress MotionValue, returns a MotionValue<string> formatted
 * as `blur(${n}px)` (n: 0..4) that peaks with fast scroll velocity and decays
 * smoothly to blur(0px) at rest.
 *
 * Consumers wire it directly to `style.filter` — no per-frame React re-renders.
 *
 * When prefers-reduced-motion is active, returns a constant `blur(0px)` value.
 */
export function useVelocityBlur(scrollProgress: MotionValue<number>): MotionValue<string> {
  const shouldReduceMotion = useReducedMotion();

  // Derive velocity in progress-units/s (not pixels — progress is 0..1)
  const rawVelocity = useVelocity(scrollProgress);

  // Smooth it to avoid jitter
  const smoothVelocity = useSpring(rawVelocity, SPRING_CONFIG);

  // Map |velocity| → blur amount in px, capped at MAX_BLUR_PX
  const blurPx = useTransform(
    smoothVelocity,
    [-VELOCITY_CLAMP, 0, VELOCITY_CLAMP],
    [MAX_BLUR_PX, 0, MAX_BLUR_PX],
  );

  // Format as CSS blur() string
  const blurString = useTransform(blurPx, (px: number) =>
    `blur(${Math.min(Math.max(px, 0), MAX_BLUR_PX).toFixed(2)}px)`,
  );

  // Return static blur(0px) when reduced motion requested.
  // We still call all hooks above to respect rules of hooks, then override.
  const staticBlur = useTransform(blurString, () => 'blur(0px)');

  return shouldReduceMotion ? staticBlur : blurString;
}
