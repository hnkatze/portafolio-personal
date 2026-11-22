'use client';

import { LazyMotion, domAnimation } from 'motion/react';
import type { ReactNode } from 'react';

export interface LazyMotionProviderProps {
  readonly children: ReactNode;
}

/**
 * Single `LazyMotion` boundary for the whole site.
 *
 * Every animated component imports the lightweight `m` component instead of
 * the full `motion` component; this provider is the one place that registers
 * the animation/gesture feature definitions they depend on. Mounting it once
 * at the root (rather than per component) keeps the feature bundle from being
 * duplicated and keeps the tree free of `motion`'s layout + drag machinery,
 * which nothing on this site uses.
 *
 * `domAnimation` covers: animations, exit animations (AnimatePresence), hover,
 * tap, focus and inView gestures. It deliberately excludes layout animations
 * and drag — using either would require `domMax`.
 *
 * Features are passed synchronously. Measured on this repo (HEAD 0a701ce +
 * T2), an async `features={() => import('./motion-features')}` split produced
 * a 2.3 KB LARGER total chunk payload (865,002 vs 862,699 B) plus an extra
 * request, and it would delay the whole animation timeline to a post-hydration
 * fetch. Sync keeps the feature bundle in one place and keeps the entrance
 * animations starting at hydration, as before.
 */
export function LazyMotionProvider({ children }: LazyMotionProviderProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
