import type { Experience, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal } from '@/components/animations';

/* ============================================================
   Experience Section — Swiss editorial-minimal (section 04)
   Server component. White background, near-black text,
   massive Inter headline, Geist Mono uppercase metadata,
   hairline gray dividers, generous whitespace.
   No gradients, no glow, no glassmorphism.
   ============================================================ */

interface ExperienceSectionProps {
  readonly experience: Experience[];
  readonly lang: Lang;
}

export function ExperienceSection({ experience, lang }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="relative bg-white px-[var(--shell-padding-x)] py-[var(--section-padding-y)]"
      aria-labelledby="experience-heading"
    >
      {/* Section number + label row — leaf spans, hydration-safe */}
      <header className="-mx-[var(--shell-padding-x)] grid grid-cols-3 items-center border-t border-b border-[#e4e4e7] py-3 px-[var(--shell-padding-x)]">
        <span className="label-mono">04</span>
        <span
          className="label-mono-muted text-center"
          data-i18n-en="EXPERIENCE"
          data-i18n-es="EXPERIENCIA"
        >
          {lang === 'en' ? 'EXPERIENCE' : 'EXPERIENCIA'}
        </span>
        <span
          className="label-mono-muted text-right"
          data-i18n-en="WORK HISTORY"
          data-i18n-es="HISTORIAL LABORAL"
        >
          {lang === 'en' ? 'WORK HISTORY' : 'HISTORIAL LABORAL'}
        </span>
      </header>

      {/* Massive headline */}
      <div className="mt-16">
        <Reveal direction="up" duration={0.7}>
          <h2
            id="experience-heading"
            className="sticky top-[6.5rem] z-10 font-extrabold text-[#0a0a0a] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            data-i18n-en="Experience."
            data-i18n-es="Experiencia."
          >
            {lang === 'en' ? 'Experience.' : 'Experiencia.'}
          </h2>
        </Reveal>
      </div>

      {/* Timeline entries */}
      <Reveal direction="up" delay={0.15} duration={0.6}>
      <ol className="mt-24 list-none p-0 m-0">
        {experience.map((entry, index) => {
          const period = `${entry.startDate} — ${entry.endDate}`.toUpperCase();
          const isFirst = index === 0;

          return (
            <li
              key={`${entry.company}-${index}`}
              className={
                isFirst
                  ? ''
                  : 'divider-hairline mt-12 pt-12'
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6 lg:gap-12">
                {/* Period — left column */}
                <div>
                  <span className="label-mono">{period}</span>
                </div>

                {/* Content — right column */}
                <div>
                  <h3
                    className="font-semibold text-[#0a0a0a] leading-tight"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
                    data-i18n-en={t(entry.role, 'en')}
                    data-i18n-es={t(entry.role, 'es')}
                  >
                    {t(entry.role, lang)}
                  </h3>

                  <p className="mt-2 label-mono-muted">
                    {entry.company}
                  </p>

                  <p
                    className="mt-6 max-w-2xl text-base leading-relaxed text-[#1a1a1a]"
                    data-i18n-en={t(entry.description, 'en')}
                    data-i18n-es={t(entry.description, 'es')}
                  >
                    {t(entry.description, lang)}
                  </p>

                  {entry.highlights.length > 0 && (
                    <ul className="mt-6 max-w-2xl list-none p-0 m-0 space-y-2">
                      {entry.highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-sm leading-relaxed text-[#1a1a1a] pl-6 relative before:content-['—'] before:absolute before:left-0 before:text-[#71717a]"
                          data-i18n-en={t(highlight, 'en')}
                          data-i18n-es={t(highlight, 'es')}
                        >
                          {t(highlight, lang)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      </Reveal>

      {/* Bottom hairline divider */}
      <div className="divider-hairline mt-24" />
    </section>
  );
}
