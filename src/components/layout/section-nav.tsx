'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface NavItem {
  readonly id: string;
  readonly num: string;
  readonly labelEn: string;
  readonly labelEs: string;
}

const ITEMS: readonly NavItem[] = [
  { id: 'about', num: '02', labelEn: 'ABOUT', labelEs: 'SOBRE MÍ' },
  { id: 'skills', num: '03', labelEn: 'STACK', labelEs: 'STACK' },
  { id: 'experience', num: '04', labelEn: 'EXPERIENCE', labelEs: 'EXPERIENCIA' },
  { id: 'projects', num: '05', labelEn: 'PROJECTS', labelEs: 'PROYECTOS' },
  { id: 'testimonials', num: '06', labelEn: 'VOICES', labelEs: 'VOCES' },
  { id: 'integrations', num: '07', labelEn: 'INTEGRATIONS', labelEs: 'INTEGRACIONES' },
  { id: 'contact', num: '08', labelEn: 'CONTACT', labelEs: 'CONTACTO' },
] as const;

/**
 * Editorial section nav — fixed right rail on desktop only.
 * Each entry is a numbered tick + hover-revealed label.
 * Active section highlights via IntersectionObserver.
 */
export function SectionNav() {
  const reduce = useReducedMotion() ?? false;
  const [activeId, setActiveId] = useState<string>('about');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sections = ITEMS.map((it) => document.getElementById(it.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first?.target.id) {
          setActiveId(first.target.id);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 pointer-events-none"
    >
      {ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={`Jump to ${item.labelEn}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center justify-end gap-3 pointer-events-auto"
          >
            {/* Hover label */}
            <span
              className={`label-mono whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'opacity-100 translate-x-0 text-[#0a0a0a]'
                  : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[#71717a]'
              }`}
            >
              {item.num}
            </span>
            {/* Tick */}
            <motion.span
              aria-hidden="true"
              className="block h-px bg-[#0a0a0a] origin-right"
              initial={false}
              animate={{
                width: isActive ? 32 : 12,
                opacity: isActive ? 1 : 0.35,
              }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </a>
        );
      })}
    </nav>
  );
}
