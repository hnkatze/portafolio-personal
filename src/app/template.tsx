'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface TemplateProps {
  children: ReactNode;
}

/**
 * Page transition wrapper.
 *
 * Uses AnimatePresence to animate between routes. When `prefers-reduced-motion`
 * is active, children are rendered without any motion wrapper to respect the
 * user preference (spec §Animation Reveals — reduced motion must yield 0ms).
 *
 * Subtle transition: opacity 0→1, y 8→0, duration 0.35s.
 */
export default function Template({ children }: TemplateProps) {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
