'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Skill, SkillCategory, SkillLevel } from '@/lib/types';
import { Reveal } from '@/components/animations';

interface SkillsSectionProps {
  readonly skills: readonly Skill[];
}

interface CategoryConfig {
  readonly key: SkillCategory;
  readonly label: string;
  readonly labelEs: string;
}

interface LevelConfig {
  readonly label: string;
  readonly labelEs: string;
  readonly dots: number;
}

const CATEGORIES: readonly CategoryConfig[] = [
  { key: 'frontend', label: 'Frontend', labelEs: 'Frontend' },
  { key: 'backend', label: 'Backend', labelEs: 'Backend' },
  { key: 'tools', label: 'Tools', labelEs: 'Herramientas' },
] as const;

const LEVEL_CONFIG = {
  expert: { label: 'Expert', labelEs: 'Experto', dots: 3 },
  proficient: { label: 'Proficient', labelEs: 'Competente', dots: 2 },
  familiar: { label: 'Familiar', labelEs: 'Familiar', dots: 1 },
} as const satisfies Record<SkillLevel, LevelConfig>;

const LEVELS: readonly SkillLevel[] = ['expert', 'proficient', 'familiar'];

type GroupedSkills = Record<SkillCategory, Record<SkillLevel, Skill[]>>;

function emptyGrouped(): GroupedSkills {
  return {
    frontend: { expert: [], proficient: [], familiar: [] },
    backend: { expert: [], proficient: [], familiar: [] },
    tools: { expert: [], proficient: [], familiar: [] },
  };
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] =
    useState<SkillCategory>('frontend');

  const grouped = useMemo<GroupedSkills>(() => {
    const acc = emptyGrouped();
    for (const s of skills) acc[s.category][s.level].push(s);
    return acc;
  }, [skills]);

  const transitionDuration = shouldReduceMotion ? 0 : 0.2;

  return (
    <section
      id="skills"
      className="relative bg-white"
      style={{
        paddingTop: 'var(--section-padding-y)',
        paddingBottom: 'var(--section-padding-y)',
      }}
    >
      {/* Section number + label row */}
      <div
        className="flex items-center justify-between border-t border-b border-[#e4e4e7] py-3"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <span className="label-mono">03</span>
        <span
          className="label-mono-muted"
          data-i18n-en="STACK"
          data-i18n-es="STACK"
        >
          STACK
        </span>
        <span
          className="label-mono-muted"
          data-i18n-en="CORE TECHNOLOGIES"
          data-i18n-es="TECNOLOGÍAS CORE"
        >
          CORE TECHNOLOGIES
        </span>
      </div>

      {/* Massive headline */}
      <div
        className="mt-16"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <Reveal direction="up" duration={0.7}>
          <h2
            className="sticky top-[6.5rem] z-10 font-extrabold text-[#0a0a0a] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            Stack.
          </h2>
        </Reveal>
      </div>

      {/* Tabs */}
      <Reveal
        direction="up"
        delay={0.15}
        duration={0.6}
        className="mt-16"
      >
        <div
          style={{
            paddingLeft: 'var(--shell-padding-x)',
            paddingRight: 'var(--shell-padding-x)',
          }}
        >
        <div
          role="tablist"
          aria-label="Skill categories"
          className="flex flex-wrap items-center gap-8 pb-3"
        >
          {CATEGORIES.map(({ key, label, labelEs }) => {
            const isActive = key === activeCategory;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(key)}
                className={`label-mono pb-2 transition-colors ${
                  isActive
                    ? 'text-[#0a0a0a] border-b-2 border-[#0a0a0a]'
                    : 'text-[#71717a] border-b-2 border-transparent hover:text-[#0a0a0a]'
                }`}
                data-i18n-en={label}
                data-i18n-es={labelEs}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="divider-hairline" />
        </div>
      </Reveal>

      {/* Skills display: typography rows by level */}
      <Reveal
        direction="up"
        delay={0.25}
        duration={0.6}
        className="mt-16"
      >
        <div
          style={{
            paddingLeft: 'var(--shell-padding-x)',
            paddingRight: 'var(--shell-padding-x)',
          }}
        >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: transitionDuration, ease: 'easeOut' }}
            className="space-y-16"
          >
            {LEVELS.map((level) => {
              const group = grouped[activeCategory][level];
              if (group.length === 0) return null;
              const cfg = LEVEL_CONFIG[level];

              return (
                <div key={level}>
                  {/* Level header: dots + mono label */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="flex gap-1"
                      aria-hidden="true"
                    >
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < cfg.dots ? 'bg-[#1a1a1a]' : 'bg-[#e4e4e7]'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className="label-mono"
                      data-i18n-en={cfg.label.toUpperCase()}
                      data-i18n-es={cfg.labelEs.toUpperCase()}
                    >
                      {cfg.label.toUpperCase()}
                    </span>
                    <span className="flex-1 divider-hairline" />
                  </div>

                  {/* Skills row: flex-wrap of icon + name */}
                  <ul className="flex flex-wrap items-center gap-x-8 gap-y-4 list-none p-0 m-0">
                    {group.map((skill, i) => (
                      <li
                        key={`${skill.category}-${skill.name}`}
                        className="flex items-center gap-3"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={skill.icon}
                          alt=""
                          aria-hidden="true"
                          className="w-5 h-5 object-contain shrink-0"
                          loading="lazy"
                        />
                        <span className="text-[#1a1a1a] text-base sm:text-lg font-normal">
                          {skill.name}
                        </span>
                        {skill.favorite && (
                          <span
                            className="text-[#0a0a0a] text-sm"
                            aria-label="Favorite skill"
                          >
                            ★
                          </span>
                        )}
                        {i < group.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="text-[#d4d4d8] text-lg ml-5 select-none"
                          >
                            /
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
        </div>
      </Reveal>

      {/* Bottom hairline divider */}
      <div
        className="divider-hairline mt-24"
        style={{
          marginLeft: 'var(--shell-padding-x)',
          marginRight: 'var(--shell-padding-x)',
        }}
      />
    </section>
  );
}
