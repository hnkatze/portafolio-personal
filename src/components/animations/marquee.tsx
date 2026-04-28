'use client';

import { Fragment } from 'react';
import { useReducedMotion } from 'motion/react';

export interface MarqueeProps {
  readonly items: readonly string[];
  readonly direction?: 'left' | 'right';
  readonly speed?: number;
  readonly className?: string;
  readonly separator?: string;
}

/**
 * Heuristic for animation duration:
 * We do NOT measure DOM width. Instead we assume an average rendered width
 * of ~120px per item (label-mono is uppercase + tracked). Total visible
 * strip length ≈ items.length * 120px. Duration = pixels / speed (px/sec).
 * `speed` is therefore "approximate pixels per second of scroll".
 * This is intentionally simple and looks acceptable for short editorial lists.
 */
const PX_PER_ITEM = 120;

export function Marquee({
  items,
  direction = 'left',
  speed = 60,
  className,
  separator = ' / ',
}: MarqueeProps) {
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) {
    return null;
  }

  const containerClasses = [
    'relative w-full overflow-hidden whitespace-nowrap py-4',
    '[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (shouldReduceMotion) {
    return (
      <div className={containerClasses}>
        <div className="flex justify-center">
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

  const totalPx = items.length * PX_PER_ITEM;
  const durationSeconds = Math.max(8, totalPx / speed);
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  const renderStrip = (ariaHidden: boolean) => (
    <div className="flex shrink-0" aria-hidden={ariaHidden ? 'true' : undefined}>
      {items.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          <span className="label-mono-muted">{item}</span>
          <span className="label-mono-muted" aria-hidden="true">
            {separator}
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className={containerClasses}>
      <ul className="sr-only">
        {items.map((item, index) => (
          <li key={`${item}-sr-${index}`}>{item}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="flex w-max"
        style={{
          animation: `${animationName} ${durationSeconds}s linear infinite`,
        }}
      >
        {renderStrip(true)}
        {renderStrip(true)}
      </div>

      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
