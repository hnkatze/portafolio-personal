'use client';

import { useReducedMotion } from 'motion/react';

export interface ScrollCounterProps {
  /** 0-based current index from the scene system */
  readonly current: number;
  /** Total number of scenes */
  readonly total: number;
  /** Optional prefix label, e.g. "Proyecto" */
  readonly prefix?: string;
  readonly className?: string;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * Mono-spaced scene counter rendered as `${prefix} 01 / 04`.
 * Passes through current/total as formatted text — no DOM animation,
 * just a stable label that changes when the active scene index changes.
 * aria-live="polite" so screen readers announce transitions.
 */
export function ScrollCounter({
  current,
  total,
  prefix,
  className,
}: ScrollCounterProps) {
  const shouldReduceMotion = useReducedMotion();
  void shouldReduceMotion; // always renders — reduced motion has no effect on text

  const label = prefix
    ? `${prefix} ${pad2(current)} / ${pad2(total)}`
    : `${pad2(current)} / ${pad2(total)}`;

  const baseClasses = 'label-mono tabular-nums';
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <span className={classes} aria-live="polite" aria-atomic="true">
      {label}
    </span>
  );
}
