'use client';

import { motion, useReducedMotion } from 'motion/react';

interface BreathingPhotoProps {
  readonly src: string;
  readonly alt: string;
}

/**
 * Circular profile photo with:
 * - infinite "breathing" scale loop (1.0 ↔ 1.02 over 3s)
 * - underlying glow gradient that pulses (CSS keyframe animate-glow-pulse)
 *
 * Respects prefers-reduced-motion: renders static.
 */
export function BreathingPhoto({ src, alt }: BreathingPhotoProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative inline-block">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 blur-lg opacity-30 animate-glow-pulse"
      />
      {shouldReduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-white/10"
          loading="eager"
        />
      ) : (
        <motion.img
          src={src}
          alt={alt}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-white/10"
          loading="eager"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}
