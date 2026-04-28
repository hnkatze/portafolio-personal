'use client';

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';

export interface MagneticButtonProps {
  readonly children: ReactNode;
  readonly strength?: number;
  readonly radius?: number;
  readonly className?: string;
  /**
   * When true, renders a `motion.span` wrapper around the child instead of a `motion.button`.
   * Useful when the child is already an interactive element (anchor, button, etc.).
   */
  readonly asChild?: boolean;
  readonly onClick?: () => void;
}

const SPRING_CONFIG = { stiffness: 200, damping: 15 } as const;

export function MagneticButton({
  children,
  strength = 0.3,
  radius = 80,
  className,
  asChild = false,
  onClick,
}: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);

  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, SPRING_CONFIG);
  const y = useSpring(yRaw, SPRING_CONFIG);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (typeof window === 'undefined') return;

    const handleMove = (event: MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        xRaw.set(dx * strength);
        yRaw.set(dy * strength);
      } else {
        xRaw.set(0);
        yRaw.set(0);
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [radius, strength, shouldReduceMotion, xRaw, yRaw]);

  const handleMouseLeave = useCallback(() => {
    xRaw.set(0);
    yRaw.set(0);
  }, [xRaw, yRaw]);

  if (shouldReduceMotion) {
    if (asChild) {
      return <span className={className}>{children}</span>;
    }
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (asChild) {
    return (
      <motion.span
        ref={(node: HTMLSpanElement | null) => {
          ref.current = node;
        }}
        className={className}
        data-cursor-grow="true"
        onMouseLeave={handleMouseLeave}
        style={{ x, y, display: 'inline-block' }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.button
      type="button"
      ref={(node: HTMLButtonElement | null) => {
        ref.current = node;
      }}
      className={className}
      data-cursor-grow="true"
      onClick={onClick}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: 'inline-block' }}
    >
      {children}
    </motion.button>
  );
}
