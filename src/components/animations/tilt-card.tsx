'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';

export interface TiltCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly maxTilt?: number;
  readonly scale?: number;
  readonly glare?: boolean;
}

const SPRING_CONFIG = { stiffness: 300, damping: 20 } as const;

export function TiltCard({
  children,
  className,
  maxTilt = 8,
  scale = 1.02,
  glare = false,
}: TiltCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  // Normalized mouse position in the element (-0.5..0.5)
  const xNorm = useMotionValue(0);
  const yNorm = useMotionValue(0);

  // Rotations (springed)
  const rotateX = useSpring(
    useTransform(yNorm, (v: number) => maxTilt * -v * 2),
    SPRING_CONFIG,
  );
  const rotateY = useSpring(
    useTransform(xNorm, (v: number) => maxTilt * v * 2),
    SPRING_CONFIG,
  );
  const scaleSpring = useSpring(1, SPRING_CONFIG);

  // Glare position (percentage)
  const glareX = useTransform(xNorm, (v: number) => `${(v + 0.5) * 100}%`);
  const glareY = useTransform(yNorm, (v: number) => `${(v + 0.5) * 100}%`);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.25), transparent 50%)`;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    xNorm.set(x);
    yNorm.set(y);
  };

  const handleMouseEnter = () => {
    scaleSpring.set(scale);
  };

  const handleMouseLeave = () => {
    xNorm.set(0);
    yNorm.set(0);
    scaleSpring.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        scale: scaleSpring,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}
