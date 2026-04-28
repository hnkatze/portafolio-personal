'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

const OUTER_SIZE = 40;
const INNER_SIZE = 8;

const OUTER_SPRING = { stiffness: 150, damping: 15 } as const;
const INNER_SPRING = { stiffness: 400, damping: 28 } as const;

export function CursorFollower() {
  const shouldReduceMotion = useReducedMotion();
  const [shouldMount, setShouldMount] = useState(false);
  const [isGrowing, setIsGrowing] = useState(false);

  const xRaw = useMotionValue(-100);
  const yRaw = useMotionValue(-100);

  const outerX = useSpring(xRaw, OUTER_SPRING);
  const outerY = useSpring(yRaw, OUTER_SPRING);
  const innerX = useSpring(xRaw, INNER_SPRING);
  const innerY = useSpring(yRaw, INNER_SPRING);

  const outerScale = useSpring(1, OUTER_SPRING);
  const innerScale = useSpring(1, INNER_SPRING);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px) and (hover: hover)');
    const update = () => setShouldMount(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!shouldMount || shouldReduceMotion) return;
    if (typeof window === 'undefined') return;

    const handleMove = (event: MouseEvent) => {
      xRaw.set(event.clientX);
      yRaw.set(event.clientY);
    };

    const handleEnter = () => {
      outerScale.set(2.5);
      innerScale.set(0.5);
      setIsGrowing(true);
    };

    const handleLeave = () => {
      outerScale.set(1);
      innerScale.set(1);
      setIsGrowing(false);
    };

    window.addEventListener('mousemove', handleMove);

    const targets = document.querySelectorAll<HTMLElement>('[data-cursor-grow]');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    // Also observe DOM for dynamically added [data-cursor-grow] elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches('[data-cursor-grow]')) {
              node.addEventListener('mouseenter', handleEnter);
              node.addEventListener('mouseleave', handleLeave);
            }
            node.querySelectorAll?.('[data-cursor-grow]').forEach((el) => {
              el.addEventListener('mouseenter', handleEnter);
              el.addEventListener('mouseleave', handleLeave);
            });
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMove);
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
      observer.disconnect();
    };
  }, [shouldMount, shouldReduceMotion, xRaw, yRaw, outerScale, innerScale]);

  if (shouldReduceMotion || !shouldMount) {
    return null;
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 rounded-full border border-white/80"
        style={{
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
          scale: outerScale,
          zIndex: 9999,
          mixBlendMode: 'difference',
          borderWidth: 1.5,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 rounded-full bg-white"
        style={{
          width: INNER_SIZE,
          height: INNER_SIZE,
          x: innerX,
          y: innerY,
          translateX: '-50%',
          translateY: '-50%',
          scale: innerScale,
          zIndex: 9999,
          mixBlendMode: 'difference',
          opacity: isGrowing ? 0.6 : 1,
        }}
      />
    </>
  );
}
