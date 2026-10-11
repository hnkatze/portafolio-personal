import type { BilingualText, Lang, Skill, SkillCategory, SkillLevel } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal, SplitWords } from '@/components/animations';

/* ============================================================
   Skills Section — Swiss Editorial "Stack Técnico" dossier
   Server component. 4-quadrant grid (Frontend / Backend /
   Datos, Cloud & IA / Tools & DevOps), hairline borders, zero
   radius, pure typography — no stock icons. Domain mastery
   shown as a mono DEEP/WORKING/STARTING badge, derived
   directly from src/lib/data.ts `Skill.level`.

   "Datos, Cloud & IA" is a new quadrant with no entry in
   data.ts — content sourced verbatim from PERFIL.md "Stack
   técnico > Datos, Cloud & IA (nuevo)" and "Formación y cursos
   completados" (badges reflect what PERFIL.md actually states,
   not an invented skill level).
   ============================================================ */

interface SkillsSectionProps {
  readonly skills: readonly Skill[];
  readonly lang: Lang;
}

interface QuadrantMeta {
  readonly index: string;
  readonly tag: BilingualText;
  readonly title: BilingualText;
  readonly description: BilingualText;
}

interface SpecializationItem {
  readonly name: string;
  readonly note: BilingualText;
  readonly badge: BilingualText;
}

const LEVEL_LABEL: Record<SkillLevel, BilingualText> = {
  expert: { es: 'PROFUNDO', en: 'DEEP' },
  proficient: { es: 'FUNCIONAL', en: 'WORKING' },
  familiar: { es: 'INICIAL', en: 'STARTING' },
};

const LEVEL_BADGE_CLASS: Record<SkillLevel, string> = {
  expert: 'bg-text-primary text-canvas-base font-semibold',
  proficient:
    'border border-border-hairline text-text-secondary group-hover:border-text-secondary group-hover:text-text-primary',
  familiar: 'border border-border-hairline bg-canvas-subtle text-text-muted',
};

const LEVEL_DOT_CLASS: Record<SkillLevel, string> = {
  expert: 'bg-text-primary',
  proficient: 'bg-text-secondary',
  familiar: 'bg-border-hairline',
};

const FRONTEND_META: QuadrantMeta = {
  index: '01',
  tag: { es: 'INTERFAZ Y CLIENTE', en: 'INTERFACE & CLIENT CORE' },
  title: { es: 'Frontend Engineering', en: 'Frontend Engineering' },
  description: {
    es: 'React, Next.js y TypeScript como núcleo diario; Angular (v17–v21), Astro, Lit Element y Flutter para proyectos enterprise y mobile.',
    en: 'React, Next.js, and TypeScript as the daily core; Angular (v17–v21), Astro, Lit Element, and Flutter for enterprise and mobile work.',
  },
};

const BACKEND_META: QuadrantMeta = {
  index: '02',
  tag: { es: 'SERVICIOS Y DATOS RELACIONALES', en: 'SERVICES & RELATIONAL ENGINES' },
  title: { es: 'Backend & Systems', en: 'Backend & Systems' },
  description: {
    es: 'NestJS como framework principal sobre PostgreSQL — incluyendo una API de 130+ endpoints en producción — con Go y C# para integraciones puntuales.',
    en: 'NestJS as the primary framework over PostgreSQL — including a production API with 130+ endpoints — with Go and C# for targeted integrations.',
  },
};

const DATA_CLOUD_META: QuadrantMeta = {
  index: '03',
  tag: { es: 'ESPECIALIZACIÓN NUEVA · 2026', en: 'NEW SPECIALIZATION · 2026' },
  title: { es: 'Datos, Cloud & IA', en: 'Data, Cloud & AI' },
  description: {
    es: 'Línea sumada en 2026: captura de cambios, migración de datos, analítica serverless, RAG y diseño de agentes conversacionales sobre AWS.',
    en: 'Line added in 2026: change capture, data migration, serverless analytics, RAG, and conversational agent design on AWS.',
  },
};

const TOOLS_META: QuadrantMeta = {
  index: '04',
  tag: { es: 'ENTREGA, INFRAESTRUCTURA Y QA', en: 'DELIVERY, INFRASTRUCTURE & QA' },
  title: { es: 'Tools & DevOps', en: 'Tools & DevOps' },
  description: {
    es: 'Git y GitHub Actions como columna de CI/CD, testing con Jest/Vitest y Playwright, despliegue en Vercel, Railway y Firebase.',
    en: 'Git and GitHub Actions as the CI/CD backbone, testing with Jest/Vitest and Playwright, deployment on Vercel, Railway, and Firebase.',
  },
};

// Sourced verbatim from PERFIL.md "Stack técnico > Datos, Cloud & IA (nuevo)"
// and "Formación y cursos completados". No skill level is stated for these
// in PERFIL.md, so the badge reflects what the source actually says
// (certified / training / consumption context) instead of an invented
// expert/proficient/familiar rating.
const DATA_CLOUD_ITEMS: readonly SpecializationItem[] = [
  {
    name: 'CDC (Change Data Capture)',
    note: {
      es: 'Captura de cambios incrementales sobre bases de datos para sincronización y streaming.',
      en: 'Incremental change capture over databases for sync and streaming.',
    },
    badge: { es: 'STREAMING', en: 'STREAMING' },
  },
  {
    name: 'AWS DMS',
    note: {
      es: 'Database Migration Service — migración y replicación de bases de datos.',
      en: 'Database Migration Service — database migration and replication.',
    },
    badge: { es: 'CERTIFICADO: BEST PRACTICES', en: 'CERTIFIED: BEST PRACTICES' },
  },
  {
    name: 'Amazon Athena',
    note: {
      es: 'Consultas analíticas serverless, consumidas desde MCP servers privados.',
      en: 'Serverless analytical queries, consumed from private MCP servers.',
    },
    badge: { es: 'MCP-LINKED', en: 'MCP-LINKED' },
  },
  {
    name: 'RAG (Retrieval-Augmented Generation)',
    note: {
      es: 'Arquitecturas de recuperación + generación para IA contextual.',
      en: 'Retrieval + generation architectures for contextual AI.',
    },
    badge: { es: 'IA CONTEXTUAL', en: 'CONTEXTUAL AI' },
  },
  {
    name: 'Amazon Connect + ACXD',
    note: {
      es: 'Diseño de experiencias de cliente agénticas (Agentic CX Designer) sobre Amazon Connect.',
      en: 'Agentic customer experience design (Agentic CX Designer) on Amazon Connect.',
    },
    badge: { es: 'AWS TRAINING 2026', en: 'AWS TRAINING 2026' },
  },
  {
    name: 'Fundamentos de ML/IA (AWS)',
    note: {
      es: 'Fundamentals of Machine Learning and Artificial Intelligence.',
      en: 'Fundamentals of Machine Learning and Artificial Intelligence.',
    },
    badge: { es: 'AWS TRAINING 2026', en: 'AWS TRAINING 2026' },
  },
] as const;

function byCategory(skills: readonly Skill[], category: SkillCategory): Skill[] {
  return skills.filter((s) => s.category === category);
}

export function SkillsSection({ skills, lang }: SkillsSectionProps) {
  const frontend = byCategory(skills, 'frontend');
  const backend = byCategory(skills, 'backend');
  const tools = byCategory(skills, 'tools');

  const quadrants = [
    { meta: FRONTEND_META, items: frontend },
    { meta: BACKEND_META, items: backend },
  ] as const;

  const introEn =
    'Production tools and technologies organized by domain — daily-driver stack plus the 2026 data/cloud/AI specialization line.';
  const introEs =
    'Herramientas y tecnologías de producción organizadas por dominio — stack diario más la línea de especialización en datos/cloud/IA sumada en 2026.';

  return (
    <section id="skills" className="relative bg-canvas-base">
      {/* Dossier breadcrumb bar — mirrors hero's "02 /" pattern */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-text-primary">
            03 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-accent-vermilion"
            data-i18n-en="STACK"
            data-i18n-es="STACK"
          >
            STACK
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en="CORE TECHNOLOGIES"
            data-i18n-es="TECNOLOGÍAS CORE"
          >
            {lang === 'en' ? 'CORE TECHNOLOGIES' : 'TECNOLOGÍAS CORE'}
          </span>
        </div>
      </header>

      {/* Section headline + intro + legend */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <div className="grid grid-cols-1 gap-xl lg:grid-cols-12 lg:items-end lg:gap-[var(--shell-gutter)]">
          <div className="lg:col-span-8">
            <h2 className="text-headline-xl text-text-primary">
              <SplitWords text="Stack." />
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

          {/* Legend — domain mastery */}
          <div className="flex flex-col gap-xs border-t border-border-hairline pt-sm lg:col-span-4 lg:items-end lg:border-t-0 lg:border-l lg:pl-md lg:pt-0">
            <span
              className="text-label-index uppercase tracking-widest text-text-muted"
              data-i18n-en="LEGEND / DOMAIN MASTERY"
              data-i18n-es="LEYENDA / DOMINIO"
            >
              {lang === 'en' ? 'LEGEND / DOMAIN MASTERY' : 'LEYENDA / DOMINIO'}
            </span>
            <div className="flex flex-wrap items-center gap-md text-label-mono">
              {(['expert', 'proficient', 'familiar'] as const).map((level) => (
                <span
                  key={level}
                  className="inline-flex items-center gap-1.5 text-text-secondary"
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 ${LEVEL_DOT_CLASS[level]}`}
                    aria-hidden="true"
                  />
                  <span
                    data-i18n-en={LEVEL_LABEL[level].en}
                    data-i18n-es={LEVEL_LABEL[level].es}
                  >
                    {t(LEVEL_LABEL[level], lang)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4-quadrant Swiss matrix */}
      <div className="px-[var(--shell-padding-x)] pb-2xl">
        <div className="grid grid-cols-1 border border-border-hairline md:grid-cols-2 md:divide-x divide-y divide-border-hairline md:divide-y-0">
          {quadrants.map(({ meta, items }, qi) => (
            <Reveal
              key={meta.title.en}
              direction="up"
              delay={0.1 * qi}
              duration={0.5}
            >
              <article className="flex h-full flex-col bg-canvas-base p-lg transition-colors hover:bg-canvas-subtle lg:p-xl">
                <div className="mb-lg flex items-start justify-between border-b border-border-hairline pb-md">
                  <div>
                    <span
                      className="block text-label-index uppercase tracking-widest text-text-muted"
                      data-i18n-en={`QUADRANT ${meta.index} // ${meta.tag.en}`}
                      data-i18n-es={`CUADRANTE ${meta.index} // ${meta.tag.es}`}
                    >
                      {lang === 'en'
                        ? `QUADRANT ${meta.index} // ${meta.tag.en}`
                        : `CUADRANTE ${meta.index} // ${meta.tag.es}`}
                    </span>
                    <h3
                      className="mt-2xs text-headline-lg text-text-primary"
                      data-i18n-en={meta.title.en}
                      data-i18n-es={meta.title.es}
                    >
                      {t(meta.title, lang)}
                    </h3>
                  </div>
                  <span className="shrink-0 border border-border-hairline bg-canvas-subtle px-xs py-2xs text-label-mono text-text-muted">
                    {lang === 'en'
                      ? `DOM: ${String(items.length).padStart(2, '0')} ITEMS`
                      : `DOM: ${String(items.length).padStart(2, '0')} ITEMS`}
                  </span>
                </div>

                <p
                  className="mb-lg text-body-md leading-relaxed text-text-secondary"
                  data-i18n-en={meta.description.en}
                  data-i18n-es={meta.description.es}
                >
                  {t(meta.description, lang)}
                </p>

                <div className="mt-auto flex flex-col divide-y divide-border-hairline">
                  {items.map((skill, i) => (
                    <div
                      key={skill.name}
                      className="group flex items-center justify-between py-sm"
                    >
                      <div className="flex items-center gap-sm">
                        <span className="text-label-index text-text-muted">
                          {meta.index}.{String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-body-md font-semibold text-text-primary transition-colors group-hover:text-accent-vermilion">
                          {skill.name}
                        </span>
                        {skill.favorite && (
                          <span
                            className="text-label-index font-bold text-accent-vermilion"
                            data-i18n-en="[FAVORITE]"
                            data-i18n-es="[FAVORITO]"
                          >
                            {lang === 'en' ? '[FAVORITE]' : '[FAVORITO]'}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-sm py-2xs text-[10px] uppercase tracking-wider ${LEVEL_BADGE_CLASS[skill.level]}`}
                        data-i18n-en={LEVEL_LABEL[skill.level].en}
                        data-i18n-es={LEVEL_LABEL[skill.level].es}
                      >
                        {t(LEVEL_LABEL[skill.level], lang)}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Row 2: Datos, Cloud & IA + Tools & DevOps */}
        <div className="grid grid-cols-1 border-x border-b border-border-hairline md:grid-cols-2 md:divide-x divide-y divide-border-hairline md:divide-y-0">
          {/* Datos, Cloud & IA — new quadrant, no data.ts entry */}
          <Reveal direction="up" delay={0.2} duration={0.5}>
            <article className="flex h-full flex-col bg-canvas-base p-lg transition-colors hover:bg-canvas-subtle lg:p-xl">
              <div className="mb-lg flex items-start justify-between border-b border-border-hairline pb-md">
                <div>
                  <span
                    className="block text-label-index uppercase tracking-widest text-accent-vermilion"
                    data-i18n-en={`QUADRANT ${DATA_CLOUD_META.index} // ${DATA_CLOUD_META.tag.en}`}
                    data-i18n-es={`CUADRANTE ${DATA_CLOUD_META.index} // ${DATA_CLOUD_META.tag.es}`}
                  >
                    {lang === 'en'
                      ? `QUADRANT ${DATA_CLOUD_META.index} // ${DATA_CLOUD_META.tag.en}`
                      : `CUADRANTE ${DATA_CLOUD_META.index} // ${DATA_CLOUD_META.tag.es}`}
                  </span>
                  <h3
                    className="mt-2xs text-headline-lg text-text-primary"
                    data-i18n-en={DATA_CLOUD_META.title.en}
                    data-i18n-es={DATA_CLOUD_META.title.es}
                  >
                    {t(DATA_CLOUD_META.title, lang)}
                  </h3>
                </div>
                <span
                  className="shrink-0 border border-accent-vermilion bg-accent-vermilion-subtle px-xs py-2xs text-label-mono font-semibold text-accent-vermilion"
                  data-i18n-en="NEW · 2026"
                  data-i18n-es="NUEVO · 2026"
                >
                  {lang === 'en' ? 'NEW · 2026' : 'NUEVO · 2026'}
                </span>
              </div>

              <p
                className="mb-lg text-body-md leading-relaxed text-text-secondary"
                data-i18n-en={DATA_CLOUD_META.description.en}
                data-i18n-es={DATA_CLOUD_META.description.es}
              >
                {t(DATA_CLOUD_META.description, lang)}
              </p>

              <div className="mt-auto flex flex-col divide-y divide-border-hairline">
                {DATA_CLOUD_ITEMS.map((item, i) => (
                  <div
                    key={item.name}
                    className="group flex items-start justify-between gap-sm py-sm"
                  >
                    <div className="flex items-start gap-sm">
                      <span className="mt-1 text-label-index text-text-muted">
                        {DATA_CLOUD_META.index}.{String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <span className="block text-body-md font-semibold text-text-primary transition-colors group-hover:text-accent-vermilion">
                          {item.name}
                        </span>
                        <span
                          className="text-[12px] font-normal text-text-muted"
                          data-i18n-en={item.note.en}
                          data-i18n-es={item.note.es}
                        >
                          {t(item.note, lang)}
                        </span>
                      </div>
                    </div>
                    <span
                      className="ml-2 shrink-0 whitespace-nowrap border border-border-hairline bg-canvas-subtle px-sm py-2xs text-[10px] uppercase tracking-wider text-text-secondary"
                      data-i18n-en={item.badge.en}
                      data-i18n-es={item.badge.es}
                    >
                      {t(item.badge, lang)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>

          {/* Tools & DevOps */}
          <Reveal direction="up" delay={0.3} duration={0.5}>
            <article className="flex h-full flex-col bg-canvas-base p-lg transition-colors hover:bg-canvas-subtle lg:p-xl">
              <div className="mb-lg flex items-start justify-between border-b border-border-hairline pb-md">
                <div>
                  <span
                    className="block text-label-index uppercase tracking-widest text-text-muted"
                    data-i18n-en={`QUADRANT ${TOOLS_META.index} // ${TOOLS_META.tag.en}`}
                    data-i18n-es={`CUADRANTE ${TOOLS_META.index} // ${TOOLS_META.tag.es}`}
                  >
                    {lang === 'en'
                      ? `QUADRANT ${TOOLS_META.index} // ${TOOLS_META.tag.en}`
                      : `CUADRANTE ${TOOLS_META.index} // ${TOOLS_META.tag.es}`}
                  </span>
                  <h3
                    className="mt-2xs text-headline-lg text-text-primary"
                    data-i18n-en={TOOLS_META.title.en}
                    data-i18n-es={TOOLS_META.title.es}
                  >
                    {t(TOOLS_META.title, lang)}
                  </h3>
                </div>
                <span className="shrink-0 border border-border-hairline bg-canvas-subtle px-xs py-2xs text-label-mono text-text-muted">
                  {`DOM: ${String(tools.length).padStart(2, '0')} ITEMS`}
                </span>
              </div>

              <p
                className="mb-lg text-body-md leading-relaxed text-text-secondary"
                data-i18n-en={TOOLS_META.description.en}
                data-i18n-es={TOOLS_META.description.es}
              >
                {t(TOOLS_META.description, lang)}
              </p>

              <div className="mt-auto flex flex-col divide-y divide-border-hairline">
                {tools.map((skill, i) => (
                  <div
                    key={skill.name}
                    className="group flex items-center justify-between py-sm"
                  >
                    <div className="flex items-center gap-sm">
                      <span className="text-label-index text-text-muted">
                        {TOOLS_META.index}.{String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-body-md font-semibold text-text-primary transition-colors group-hover:text-accent-vermilion">
                        {skill.name}
                      </span>
                      {skill.favorite && (
                        <span
                          className="text-label-index font-bold text-accent-vermilion"
                          data-i18n-en="[FAVORITE]"
                          data-i18n-es="[FAVORITO]"
                        >
                          {lang === 'en' ? '[FAVORITE]' : '[FAVORITO]'}
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-sm py-2xs text-[10px] uppercase tracking-wider ${LEVEL_BADGE_CLASS[skill.level]}`}
                      data-i18n-en={LEVEL_LABEL[skill.level].en}
                      data-i18n-es={LEVEL_LABEL[skill.level].es}
                    >
                      {t(LEVEL_LABEL[skill.level], lang)}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </div>

      <div className="divider-hairline" />
    </section>
  );
}
