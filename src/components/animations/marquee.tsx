'use client';

import { Fragment, useRef, type JSX } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';

export interface MarqueeProps {
  readonly items: readonly string[];
  readonly direction?: 'left' | 'right';
  readonly speed?: number;
  readonly className?: string;
  readonly separator?: string;
}

/**
 * Wraps a value within a [min, max] range, useful for seamless looping.
 */
function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

/**
 * Scroll-velocity-driven marquee. The strip has a base velocity
 * (`speed` × direction) and accelerates / reverses with the page's scroll
 * velocity. Reduced-motion users get a static, single-block fallback.
 */
export function Marquee({
  items,
  direction = 'left',
  speed = 25,
  className,
  separator = ' / ',
}: MarqueeProps): JSX.Element | null {
  const reduce = useReducedMotion() ?? false;
  const baseVelocity = direction === 'left' ? -speed : speed;

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // Scroll-velocity boost is now subtle: 1000px/s of scroll only adds 40% speed
  // (was 150%). Keeps the cinematic feel without making the strip turbo-charged.
  const velocityFactor = useTransform(
    smoothVelocity,
    [0, 1000],
    [0, 0.4],
    { clamp: false },
  );
  const x = useTransform(baseX, (v) => `${wrap(-25, -75, v)}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  if (items.length === 0) {
    return null;
  }

  const containerClasses = [
    'relative w-full overflow-hidden whitespace-nowrap',
    '[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Screen-reader fallback list — always rendered so AT users get the content.
  const srOnly = (
    <ul className="sr-only">
      {items.map((item, index) => (
        <li key={`${item}-sr-${index}`}>{item}</li>
      ))}
    </ul>
  );

  if (reduce) {
    return (
      <div className={containerClasses}>
        {srOnly}
        <div
          aria-hidden="true"
          className="flex justify-center"
        >
          {items.map((item, index) => (
            <Fragment key={`${item}-${index}`}>
              <span className="label-mono-muted">{item}</span>
              {index < items.length - 1 ? (
                <span className="label-mono-muted" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  // One repeatable block of all items joined by separator, ending with a
  // trailing separator so adjacent blocks read continuously when looped.
  const renderBlock = (key: number): JSX.Element => (
    <span
      key={`block-${key}`}
      className="flex shrink-0 items-center pr-8"
    >
      {items.map((item, index) => (
        <Fragment key={`block-${key}-${item}-${index}`}>
          <span className="label-mono-muted whitespace-nowrap">{item}</span>
          {index < items.length - 1 ? (
            <span
              className="label-mono-muted mx-2"
              aria-hidden="true"
            >
              {separator.trim()}
            </span>
          ) : null}
        </Fragment>
      ))}
      <span
        className="label-mono-muted mx-2"
        aria-hidden="true"
      >
        {separator.trim()}
      </span>
    </span>
  );

  return (
    <div className={containerClasses}>
      {srOnly}
      <motion.div
        aria-hidden="true"
        className="flex"
        style={{ x }}
      >
        {renderBlock(0)}
        {renderBlock(1)}
        {renderBlock(2)}
        {renderBlock(3)}
      </motion.div>
    </div>
  );
}
