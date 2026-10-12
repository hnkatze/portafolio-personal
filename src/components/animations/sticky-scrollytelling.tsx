'use client';

import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useInView, useScroll, useReducedMotion, type MotionValue } from 'motion/react';

// ---------------------------------------------------------------------------
// Context — shared state from scenes → left column
// ---------------------------------------------------------------------------

interface ScrollytellingContextValue {
  /** 0-based index of the currently active scene */
  readonly activeScene: number;
  /** Total number of scenes (set once at mount) */
  readonly totalScenes: number;
  /** Smooth MotionValue<number> 0..1 for the whole scrollytelling block */
  readonly scrollProgress: MotionValue<number>;
}

const ScrollytellingContext = createContext<ScrollytellingContextValue | null>(null);

export function useScrollytelling(): ScrollytellingContextValue {
  const ctx = useContext(ScrollytellingContext);
  if (!ctx) {
    throw new Error('useScrollytelling must be used inside <StickyScrollytelling>');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Per-scene observer — updates active index via useInView
// ---------------------------------------------------------------------------

interface SceneObserverProps {
  readonly index: number;
  readonly children: ReactNode;
  readonly onActivate: (index: number) => void;
  readonly className?: string;
  readonly style?: CSSProperties;
}

function SceneObserver({ index, children, onActivate, className, style }: SceneObserverProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Activate this scene when its content is ≥30% visible.
  // useInView returns a boolean; we use useEffect to fire the callback.
  const isInView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      onActivate(index);
    }
  }, [isInView, index, onActivate]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface StickyScrollytellingProps {
  /**
   * Left column — the sticky narrative content (counter, progress, copy).
   * Receives context via useScrollytelling().
   */
  readonly left: ReactNode;
  /**
   * Right column children — each child is one "scene" and gets an InView
   * observer. The count determines totalScenes in context.
   */
  readonly right: ReactNode;
  /** CSS class for the outer wrapper */
  readonly className?: string;
  /** CSS class for the left sticky column */
  readonly leftClassName?: string;
  /** CSS class for the right scenes column */
  readonly rightClassName?: string;
  /**
   * Each scene's minimum height (CSS value). Default: "100vh".
   * Scenes stack vertically; the left column sticks alongside.
   */
  readonly sceneHeight?: string;
  /**
   * `top` value for the sticky left column. Defaults to '6.5rem' so the
   * column clears the editorial header (z-50). Pass '0' for no offset.
   */
  readonly stickyTop?: string;
}

/**
 * StickyScrollytelling
 *
 * Two-column layout:
 * - Left: sticky column with ScrollCounter + HairlineProgress wired via context
 * - Right: scenes stacked vertically; per-scene useInView drives activeScene
 *
 * The progress MotionValue comes from useScroll on the outer container so it
 * fills smoothly between scenes (not just on discrete index changes).
 *
 * Reduced-motion: sticky positioning is removed; scenes flow normally;
 * activeScene still updates (used by counters if visible).
 */
export function StickyScrollytelling({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
  sceneHeight = '100vh',
  stickyTop = '6.5rem',
}: StickyScrollytellingProps) {
  const shouldReduceMotion = useReducedMotion();
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [activeScene, setActiveScene] = useState(0);

  const rightChildren = Children.toArray(right);
  const totalScenes = rightChildren.length;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  const handleActivate = useCallback((index: number) => {
    setActiveScene(index);
  }, []);

  const outerClasses = className ?? '';
  const leftBase = 'self-start';
  const leftClasses = leftClassName
    ? `${leftBase} ${leftClassName}`
    : leftBase;

  const leftStyle: CSSProperties = shouldReduceMotion
    ? {}
    : { position: 'sticky', top: stickyTop };

  const sceneMinHeight: CSSProperties = { minHeight: sceneHeight };

  return (
    <ScrollytellingContext.Provider
      value={{ activeScene, totalScenes, scrollProgress: scrollYProgress }}
    >
      <div ref={outerRef} className={outerClasses}>
        <div className="flex">
          {/* Left sticky column */}
          <div className={leftClasses} style={leftStyle}>
            {left}
          </div>

          {/* Right scenes column */}
          <div className={rightClassName ?? 'flex-1'}>
            {rightChildren.map((child, i) => (
              <SceneObserver
                key={i}
                index={i}
                onActivate={handleActivate}
                style={sceneMinHeight}
              >
                {child}
              </SceneObserver>
            ))}
          </div>
        </div>
      </div>
    </ScrollytellingContext.Provider>
  );
}
