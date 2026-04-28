'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Skill, SkillCategory, SkillLevel } from '@/lib/types';
import { ParallaxLayer, TiltCard } from '@/components/animations';

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
  readonly color: string;
  readonly dotColor: string;
  readonly bg: string;
  readonly border: string;
}

const CATEGORIES: readonly CategoryConfig[] = [
  { key: 'frontend', label: 'Frontend', labelEs: 'Frontend' },
  { key: 'backend', label: 'Backend', labelEs: 'Backend' },
  { key: 'tools', label: 'Tools', labelEs: 'Herramientas' },
] as const;

const LEVEL_CONFIG = {
  expert: {
    label: 'Expert',
    labelEs: 'Experto',
    dots: 3,
    color: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  proficient: {
    label: 'Proficient',
    labelEs: 'Competente',
    dots: 2,
    color: 'text-blue-400',
    dotColor: 'bg-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  familiar: {
    label: 'Familiar',
    labelEs: 'Familiar',
    dots: 1,
    color: 'text-gray-400',
    dotColor: 'bg-gray-400',
    bg: 'bg-white/5',
    border: 'border-white/10',
  },
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

  return (
    <section
      id="skills"
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
    >
      {/* Parallax decorations */}
      <ParallaxLayer
        speed={-0.2}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-10 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            data-i18n-en="Skills & Technologies"
            data-i18n-es="Habilidades y Tecnologías"
          >
            Skills &amp; Technologies
          </h2>
          <p
            className="text-gray-400 max-w-xl mx-auto"
            data-i18n-en="Technologies I work with daily to build modern web applications"
            data-i18n-es="Tecnologías con las que trabajo a diario para construir aplicaciones web modernas"
          >
            Technologies I work with daily to build modern web applications
          </p>

          {/* Level legend */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs">
            {LEVELS.map((level) => {
              const cfg = LEVEL_CONFIG[level];
              return (
                <div key={level} className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i < cfg.dots ? cfg.dotColor : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={cfg.color}
                    data-i18n-en={cfg.label}
                    data-i18n-es={cfg.labelEs}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category tabs with shared layout indicator */}
        <div className="flex justify-center gap-2 mb-12">
          {CATEGORIES.map(({ key, label, labelEs }) => {
            const isActive = key === activeCategory;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 border ${
                  isActive
                    ? 'text-blue-400 border-blue-400/30'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                }`}
                aria-pressed={isActive}
              >
                {isActive && !shouldReduceMotion && (
                  <motion.span
                    layoutId="skills-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-blue-500/20 border border-blue-400/30"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                    aria-hidden="true"
                  />
                )}
                {isActive && shouldReduceMotion && (
                  <span
                    className="absolute inset-0 rounded-xl bg-blue-500/20"
                    aria-hidden="true"
                  />
                )}
                <span
                  className="relative z-10"
                  data-i18n-en={label}
                  data-i18n-es={labelEs}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Skill grids for active category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            {LEVELS.map((level) => {
              const group = grouped[activeCategory][level];
              if (group.length === 0) return null;
              const cfg = LEVEL_CONFIG[level];

              return (
                <div key={level}>
                  {/* Level header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < cfg.dots ? cfg.dotColor : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-sm font-medium ${cfg.color}`}
                      data-i18n-en={cfg.label}
                      data-i18n-es={cfg.labelEs}
                    >
                      {cfg.label}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  {/* Cards grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {group.map((skill, i) => (
                      <motion.div
                        key={`${skill.category}-${skill.name}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.03,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        <TiltCard maxTilt={8} scale={1.02}>
                          <div
                            className={`relative flex items-center gap-3 p-4 rounded-2xl border cursor-default transition-colors duration-300 ${cfg.bg} ${cfg.border} hover:border-blue-400/40 hover:bg-white/[0.06]`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={skill.icon}
                              alt={skill.name}
                              className="w-8 h-8 object-contain shrink-0"
                              loading="lazy"
                            />
                            <span className="text-sm font-medium text-white truncate">
                              {skill.name}
                            </span>
                            {skill.favorite && (
                              <span
                                className="ml-auto text-xs text-yellow-400 shrink-0"
                                aria-label="Favorite skill"
                              >
                                ★
                              </span>
                            )}
                          </div>
                        </TiltCard>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
