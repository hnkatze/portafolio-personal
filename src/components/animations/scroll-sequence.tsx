'use client';

import { Children, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';

export interface ScrollSequenceStep {
  readonly opacity?: readonly [number, number];
  readonly y?: readonly [number, number];
  readonly scale?: readonly [number, number];
  readonly rotate?: readonly [number, number];
}

export interface ScrollSequenceProps {
  readonly children: ReactNode;
  readonly steps?: readonly ScrollSequenceStep[];
  readonly className?: string;
}

type StepTransforms = {
  readonly opacity?: MotionValue<number>;
  readonly y?: MotionValue<number>;
  readonly scale?: MotionValue<number>;
  readonly rotate?: MotionValue<number>;
};

function useStepTransforms(
  progress: MotionValue<number>,
  step: ScrollSequenceStep,
): StepTransforms {
  const opacity = useTransform(progress, [0, 1], [...(step.opacity ?? [1, 1])]);
  const y = useTransform(progress, [0, 1], [...(step.y ?? [0, 0])]);
  const scale = useTransform(progress, [0, 1], [...(step.scale ?? [1, 1])]);
  const rotate = useTransform(progress, [0, 1], [...(step.rotate ?? [0, 0])]);

  return {
    opacity: step.opacity ? opacity : undefined,
    y: step.y ? y : undefined,
    scale: step.scale ? scale : undefined,
    rotate: step.rotate ? rotate : undefined,
  };
}

interface SequenceChildProps {
  readonly child: ReactNode;
  readonly step: ScrollSequenceStep | undefined;
  readonly progress: MotionValue<number>;
}

function SequenceChild({ child, step, progress }: SequenceChildProps) {
  // We must always call the hook; when step is undefined, pass a no-op step
  const resolvedStep = step ?? {};
  const transforms = useStepTransforms(progress, resolvedStep);

  if (!step) {
    return <div>{child}</div>;
  }

  return (
    <motion.div
      style={{
        ...(transforms.opacity ? { opacity: transforms.opacity } : {}),
        ...(transforms.y ? { y: transforms.y } : {}),
        ...(transforms.scale ? { scale: transforms.scale } : {}),
        ...(transforms.rotate ? { rotate: transforms.rotate } : {}),
      }}
    >
      {child}
    </motion.div>
  );
}

export function ScrollSequence({ children, steps = [], className }: ScrollSequenceProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const childArray = Children.toArray(children);

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {childArray.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, i) => (
        <SequenceChild key={i} child={child} step={steps[i]} progress={scrollYProgress} />
      ))}
    </div>
  );
}
