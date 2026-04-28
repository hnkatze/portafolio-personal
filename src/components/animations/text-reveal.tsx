'use client';

import { useEffect, useRef, useState, type ElementType, type Ref } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import SplitType from 'split-type';

type TextRevealTag = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
type SplitBy = 'chars' | 'words' | 'lines';

export interface TextRevealProps {
  readonly text: string;
  readonly as?: TextRevealTag;
  readonly splitBy?: SplitBy;
  readonly stagger?: number;
  readonly delay?: number;
  readonly className?: string;
}

const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export function TextReveal({
  text,
  as = 'span',
  splitBy = 'words',
  stagger = 0.04,
  delay = 0,
  className,
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [parts, setParts] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (typeof window === 'undefined') return;
    const node = ref.current;
    if (!node) return;

    const split = new SplitType(node, {
      types: splitBy,
      tagName: 'span',
    });

    const collected: HTMLElement[] =
      splitBy === 'chars'
        ? (split.chars ?? [])
        : splitBy === 'lines'
          ? (split.lines ?? [])
          : (split.words ?? []);

    collected.forEach((el) => {
      el.style.display = 'inline-block';
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.willChange = 'opacity, transform';
    });

    setParts(collected);

    return () => {
      split.revert();
      setParts([]);
    };
  }, [text, splitBy, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!isInView) return;
    if (parts.length === 0) return;

    parts.forEach((el, index) => {
      const total = delay + index * stagger;
      el.style.transition = `opacity 0.5s ${EASE} ${total}s, transform 0.5s ${EASE} ${total}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, [isInView, parts, delay, stagger, shouldReduceMotion]);

  const Tag = as as ElementType;

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className}>
      {text}
    </Tag>
  );
}
