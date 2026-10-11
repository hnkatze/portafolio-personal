import type { Experience, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { I18nSplitWords, Reveal } from '@/components/animations';

/* ============================================================
   Experience Section — Swiss Editorial "Historial Laboral" dossier
   Server component. Dark canvas, dossier breadcrumb, a verified-
   facts status card, then a 12-col timeline per role: identity +
   period on the left, engineering focus + numbered highlights +
   tech stack on the right. Reference: Stitch screen
   186479089bbc4ac5b4f3784508f1d76c ("Experiencia — Interactive
   Studio Edition"), adapted to real content from src/lib/data.ts
   only — the comparative spec table and the briefing/CV footer
   CTA from that mock were dropped (unverifiable invented metrics
   and overlap with contact-section's scope, respectively).
   ============================================================ */

interface ExperienceSectionProps {
  readonly experience: Experience[];
  readonly lang: Lang;
}

interface EntryMeta {
  readonly stackTags: readonly string[];
}

// Tags extracted verbatim from each entry's `description` in data.ts —
// not invented, just surfaced as chips (same pattern as Skills' tag row).
const ENTRY_META: Record<string, EntryMeta> = {
  'Creative Information Technologies': {
    stackTags: ['Angular (v17–v21)', 'Next.js', 'Astro', 'Lit Element', 'Flutter'],
  },
  Freelance: {
    stackTags: ['React', 'Next.js', 'Astro', 'Angular', 'Node.js', 'NestJS'],
  },
};

// Open source tools authored in the Freelance role (data.ts highlights),
// cross-referenced against each tool's own `projects` entry for its
// verified primary language.
const FREELANCE_OSS_TOOLS = [
  { name: 'Swagger Extractor MCP', lang: 'Go' },
  { name: 'PrimeNG MCP Server', lang: 'TypeScript' },
  { name: 'FetchMate', lang: 'TypeScript' },
] as const;

const isCurrent = (endDate: string): boolean =>
  endDate.trim().toLowerCase() === 'present';

export function ExperienceSection({ experience, lang }: ExperienceSectionProps) {
  const introEn =
    'Four years split between an enterprise frontend/mobile role and end-to-end freelance delivery — the same engineering bar on both sides.';
  const introEs =
    'Cuatro años repartidos entre un rol enterprise de frontend/mobile y entregas freelance end-to-end — la misma exigencia de ingeniería en ambos frentes.';

  return (
    <section id="experience" className="relative bg-canvas-base">
      {/* Dossier breadcrumb bar — mirrors Hero/Skills "0N /" pattern */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-text-primary">
            04 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-accent-vermilion"
            data-i18n-en="EXPERIENCE"
            data-i18n-es="EXPERIENCIA"
          >
            {lang === 'en' ? 'EXPERIENCE' : 'EXPERIENCIA'}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en="WORK HISTORY"
            data-i18n-es="HISTORIAL LABORAL"
          >
            {lang === 'en' ? 'WORK HISTORY' : 'HISTORIAL LABORAL'}
          </span>
        </div>
      </header>

      {/* Headline + lead + status card */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <div className="grid grid-cols-1 gap-xl lg:grid-cols-12 lg:items-end lg:gap-[var(--shell-gutter)]">
          <div className="lg:col-span-8">
            <h2 className="text-headline-xl text-text-primary">
              <I18nSplitWords textEn="Experience." textEs="Experiencia." />
            </h2>
            <Reveal direction="up" delay={0.15} duration={0.6} className="mt-sm">
              <p
                className="max-w-[42rem] text-body-lead text-text-secondary"
                data-i18n-en={introEn}
                data-i18n-es={introEs}
              >
                {lang === 'en' ? introEn : introEs}
              </p>
            </Reveal>
          </div>

          {/* Status card — verified facts only, from data.ts */}
          <div className="flex flex-col gap-sm border-t border-border-hairline pt-sm lg:col-span-4 lg:border-t-0 lg:border-l lg:pl-md lg:pt-0">
            <div className="flex flex-col gap-2xs border-b border-border-hairline pb-sm">
              <span
                className="text-label-index uppercase tracking-widest text-text-muted"
                data-i18n-en="AVAILABILITY STATUS"
                data-i18n-es="ESTATUS DE DISPONIBILIDAD"
              >
                {lang === 'en' ? 'AVAILABILITY STATUS' : 'ESTATUS DE DISPONIBILIDAD'}
              </span>
              <div className="flex items-center gap-xs">
                <span
                  className="inline-block h-1.5 w-1.5 bg-status-success"
                  aria-hidden="true"
                />
                <span
                  className="text-label-mono text-text-primary"
                  data-i18n-en="CIT (Associate) & Freelance"
                  data-i18n-es="CIT (Asociado) & Freelance"
                >
                  {lang === 'en'
                    ? 'CIT (Associate) & Freelance'
                    : 'CIT (Asociado) & Freelance'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2xs border-b border-border-hairline pb-sm">
              <span
                className="text-label-index uppercase tracking-widest text-text-muted"
                data-i18n-en="TRACK RECORD"
                data-i18n-es="HISTORIAL VERIFICADO"
              >
                {lang === 'en' ? 'TRACK RECORD' : 'HISTORIAL VERIFICADO'}
              </span>
              <span
                className="text-label-mono text-text-primary"
                data-i18n-en="25+ projects, 100% client satisfaction"
                data-i18n-es="25+ proyectos, 100% satisfacción del cliente"
              >
                {lang === 'en'
                  ? '25+ projects, 100% client satisfaction'
                  : '25+ proyectos, 100% satisfacción del cliente'}
              </span>
            </div>

            <div className="flex flex-col gap-2xs">
              <span
                className="text-label-index uppercase tracking-widest text-text-muted"
                data-i18n-en="PROTOCOL"
                data-i18n-es="PROTOCOLO"
              >
                {lang === 'en' ? 'PROTOCOL' : 'PROTOCOLO'}
              </span>
              <span
                className="text-label-mono text-accent-vermilion"
                data-i18n-en="Enterprise NDA (CIT)"
                data-i18n-es="NDA Enterprise (CIT)"
              >
                {lang === 'en' ? 'Enterprise NDA (CIT)' : 'NDA Enterprise (CIT)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline entries */}
      <div className="px-[var(--shell-padding-x)] pb-2xl">
        <div className="flex items-center justify-between border-b border-border-hairline pb-xs mb-xl text-label-index uppercase text-text-muted">
          <span
            data-i18n-en="LOG-ENTRY // WORK HISTORY"
            data-i18n-es="LOG-ENTRY // HISTORIAL LABORAL"
          >
            LOG-ENTRY // {lang === 'en' ? 'WORK HISTORY' : 'HISTORIAL LABORAL'}
          </span>
          <span>INDEX [01–{String(experience.length).padStart(2, '0')}]</span>
        </div>

        {experience.map((entry, index) => {
          const num = `01.${String(index + 1).padStart(2, '0')}`;
          const current = isCurrent(entry.endDate);
          const period = `${entry.startDate} — ${entry.endDate}`.toUpperCase();
          const meta = ENTRY_META[entry.company];
          const isFreelance = entry.company === 'Freelance';
          const isLastEntry = index === experience.length - 1;

          return (
            <Reveal
              key={`${entry.company}-${index}`}
              direction="up"
              amount={0.1}
              duration={0.5}
            >
              <article
                className={`group/exp grid grid-cols-1 gap-y-md border-b border-border-hairline pb-2xl transition-colors hover:border-text-secondary lg:grid-cols-12 lg:gap-[var(--shell-gutter)] ${
                  isLastEntry ? '' : 'mb-2xl'
                }`}
              >
                {/* Left — identity + period + OSS registry */}
                <div className="flex flex-col justify-between border-b border-border-hairline pb-md lg:col-span-4 lg:border-b-0 lg:pr-lg">
                  <div>
                    <div className="mb-xs flex items-center gap-xs text-label-mono text-accent-vermilion">
                      <span>{num}</span>
                      <span>•</span>
                      {current && (
                        <span
                          className="font-semibold text-status-success"
                          data-i18n-en="ACTIVE"
                          data-i18n-es="ACTIVO"
                        >
                          {lang === 'en' ? 'ACTIVE' : 'ACTIVO'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-headline-lg text-text-primary">
                      {entry.company}
                    </h3>
                    <p
                      className="mt-2xs text-body-md text-text-secondary"
                      data-i18n-en={t(entry.role, 'en')}
                      data-i18n-es={t(entry.role, 'es')}
                    >
                      {t(entry.role, lang)}
                    </p>

                    <div className="mt-lg flex justify-between border-b border-border-hairline pb-2xs text-label-mono">
                      <span
                        className="text-text-muted"
                        data-i18n-en="PERIOD"
                        data-i18n-es="PERIODO"
                      >
                        {lang === 'en' ? 'PERIOD' : 'PERIODO'}
                      </span>
                      <span
                        className={current ? 'text-text-primary' : 'text-text-secondary'}
                      >
                        {period}
                      </span>
                    </div>
                  </div>

                  {/* OSS registry — Freelance only, cross-checked against data.ts projects */}
                  {isFreelance && (
                    <div className="mt-lg border border-border-hairline bg-canvas-subtle p-md">
                      <div className="mb-xs flex items-center justify-between border-b border-border-hairline pb-xs">
                        <span
                          className="text-label-index uppercase tracking-widest text-text-muted"
                          data-i18n-en="OSS REGISTRY"
                          data-i18n-es="REGISTRO OSS"
                        >
                          {lang === 'en' ? 'OSS REGISTRY' : 'REGISTRO OSS'}
                        </span>
                        <span className="text-label-index text-accent-vermilion">
                          PUBLIC
                        </span>
                      </div>
                      <ul className="flex flex-col gap-2xs">
                        {FREELANCE_OSS_TOOLS.map((tool) => (
                          <li
                            key={tool.name}
                            className="flex items-center justify-between gap-sm"
                          >
                            <span className="text-body-sm font-medium text-text-primary">
                              {tool.name}
                            </span>
                            <span className="text-label-index text-text-muted">
                              {tool.lang}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right — engineering focus + highlights + stack */}
                <div className="lg:col-span-8 lg:border-l lg:border-border-hairline lg:pl-xl">
                  <div className="mb-lg border-b border-border-hairline pb-md">
                    <span
                      className="text-label-index uppercase tracking-widest text-text-muted"
                      data-i18n-en="ENGINEERING FOCUS"
                      data-i18n-es="FOCO DE INGENIERÍA"
                    >
                      {lang === 'en' ? 'ENGINEERING FOCUS' : 'FOCO DE INGENIERÍA'}
                    </span>
                    <p
                      className="mt-xs text-headline-md leading-snug text-text-primary"
                      data-i18n-en={t(entry.description, 'en')}
                      data-i18n-es={t(entry.description, 'es')}
                    >
                      {t(entry.description, lang)}
                    </p>
                  </div>

                  {entry.highlights.length > 0 && (
                    <ul className="mb-lg flex flex-col gap-md list-none m-0 p-0">
                      {entry.highlights.map((highlight, hIdx) => (
                        <Reveal
                          key={hIdx}
                          as="li"
                          direction="up"
                          delay={hIdx * 0.06}
                          duration={0.5}
                          amount={0.3}
                          className="flex items-start gap-md"
                        >
                          <span className="shrink-0 pt-2xs text-label-mono text-accent-vermilion">
                            {String(hIdx + 1).padStart(2, '0')}
                          </span>
                          <span
                            className="text-body-sm text-text-secondary"
                            data-i18n-en={t(highlight, 'en')}
                            data-i18n-es={t(highlight, 'es')}
                          >
                            {t(highlight, lang)}
                          </span>
                        </Reveal>
                      ))}
                    </ul>
                  )}

                  {meta && (
                    <div>
                      <span
                        className="mb-sm block text-label-index uppercase tracking-widest text-text-muted"
                        data-i18n-en="TECH STACK"
                        data-i18n-es="STACK TÉCNICO"
                      >
                        {lang === 'en' ? 'TECH STACK' : 'STACK TÉCNICO'}
                      </span>
                      <div className="flex flex-wrap gap-xs">
                        {meta.stackTags.map((tagName) => (
                          <span
                            key={tagName}
                            className="border border-border-hairline bg-canvas-subtle px-sm py-2xs text-[12px] font-medium text-text-primary transition-colors hover:border-text-primary hover:bg-canvas-elevated"
                          >
                            {tagName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <div className="divider-hairline" />
    </section>
  );
}
