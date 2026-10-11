import type { BilingualText, Lang, PersonalInfo } from '@/lib/types';
import { t } from '@/lib/i18n';
import { CountUp, Reveal, SplitWords } from '@/components/animations';

/* ============================================================
   Hero Section — Swiss Editorial "Perfil" dossier
   Server component. Dark canvas, Space Grotesk display type,
   JetBrains Mono metadata, hairline dividers, zero radius.
   No photo — Stitch's Interactive Studio Edition is pure
   typography. No gradients, no glow, no glassmorphism.
   ============================================================ */

interface HeroSectionProps {
  readonly data: PersonalInfo;
  readonly lang: Lang;
}

interface Stat {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly label: BilingualText;
  readonly note: BilingualText;
  readonly dot: 'vermilion' | 'success' | 'cobalt';
}

// Verified figures only — src/lib/data.ts (experience, personalInfo) and
// PERFIL.md. The MCP count is the public/open-source servers listed in
// PERFIL.md "MCP Servers > Públicos": Swagger Extractor MCP, PrimeNG MCP
// Server, context_shared_mcp, context_shared_admin.
const STATS: readonly Stat[] = [
  {
    value: 4,
    suffix: '+',
    label: { es: 'Años de experiencia', en: 'Years of experience' },
    note: {
      es: 'Full-Stack Engineer enfocado en Angular, Next.js y Flutter desde 2021.',
      en: 'Full-Stack engineer focused on Angular, Next.js, and Flutter since 2021.',
    },
    dot: 'vermilion',
  },
  {
    value: 25,
    suffix: '+',
    label: { es: 'Proyectos entregados', en: 'Projects delivered' },
    note: {
      es: 'ONGs, e-commerce, talleres de servicio y herramientas para desarrolladores.',
      en: 'NGOs, e-commerce, service shops, and developer tooling.',
    },
    dot: 'success',
  },
  {
    value: 4,
    prefix: '0',
    label: { es: 'MCP servers OSS', en: 'OSS MCP servers' },
    note: {
      es: 'Servidores open source para integrar IA en flujos de desarrollo.',
      en: 'Open source servers for integrating AI into dev workflows.',
    },
    dot: 'cobalt',
  },
  {
    value: 100,
    suffix: '%',
    label: { es: 'Satisfacción de cliente', en: 'Client satisfaction' },
    note: {
      es: '25+ proyectos freelance entregados con satisfacción total del cliente.',
      en: '25+ freelance projects delivered with full client satisfaction.',
    },
    dot: 'success',
  },
] as const;

interface Pillar {
  readonly tag: string;
  readonly marker: string;
  readonly title: BilingualText;
  readonly description: BilingualText;
  readonly stack: readonly string[];
}

const PILLARS: readonly Pillar[] = [
  {
    tag: 'STACK_FRONT // 01',
    marker: 'v17—21',
    title: { es: 'Frontend & Mobile Nativo', en: 'Frontend & Native Mobile' },
    description: {
      es: 'Angular (v17–v21) con signals y standalone components, Next.js como runtime de servidor, y Flutter con componentes nativos para iOS en producción.',
      en: 'Angular (v17–v21) with signals and standalone components, Next.js as the server runtime, and Flutter with native iOS components in production.',
    },
    stack: ['ANGULAR', 'NEXT.JS', 'FLUTTER', 'SWIFT'],
  },
  {
    tag: 'AGENTIC_AI // 02',
    marker: 'OPEN_PROTOCOL',
    title: { es: 'MCP & Agentic Tooling', en: 'MCP & Agentic Tooling' },
    description: {
      es: 'Autor de MCP servers open source (Go, TypeScript) que exponen herramientas reales a asistentes de IA — Claude, Copilot y otros LLMs.',
      en: 'Author of open source MCP servers (Go, TypeScript) exposing real tools to AI assistants — Claude, Copilot, and other LLMs.',
    },
    stack: ['MCP_SERVER', 'CLAUDE', 'RAG'],
  },
  {
    tag: 'CLOUD_DATA // 03',
    marker: 'AWS',
    title: { es: 'Cloud Data & Pipelines', en: 'Cloud Data & Pipelines' },
    description: {
      es: 'CDC con AWS DMS, consultas serverless sobre Amazon Athena y diseño de experiencias agénticas con Amazon Connect (ACXD).',
      en: 'CDC with AWS DMS, serverless queries on Amazon Athena, and agentic experience design with Amazon Connect (ACXD).',
    },
    stack: ['AWS DMS', 'ATHENA', 'POSTGRESQL'],
  },
] as const;

const DOT_CLASS: Record<Stat['dot'], string> = {
  vermilion: 'bg-accent-vermilion',
  success: 'bg-status-success',
  cobalt: 'bg-accent-cobalt',
};

export function HeroSection({ data, lang }: HeroSectionProps) {
  const titleEn = t(data.title, 'en');
  const titleEs = t(data.title, 'es');
  const summaryEn = t(data.summary, 'en');
  const summaryEs = t(data.summary, 'es');

  return (
    <section id="about" className="relative bg-canvas-base">
      {/* Dossier breadcrumb bar — mirrors SectionNav's "02" for #about */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-text-primary">
            02 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-accent-vermilion"
            data-i18n-en="PERFIL"
            data-i18n-es="PERFIL"
          >
            PERFIL
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en="PRODUCTION ACTIVE"
            data-i18n-es="EN PRODUCCIÓN"
          >
            {lang === 'en' ? 'PRODUCTION ACTIVE' : 'EN PRODUCCIÓN'}
          </span>
        </div>
      </header>

      {/* Monumental hero grid */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <div className="grid grid-cols-1 items-start gap-2xl lg:grid-cols-12 lg:gap-[var(--shell-gutter)]">
          {/* Left — metadata spine */}
          <div className="flex flex-col gap-xl border-b border-border-hairline pb-xl lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-xl">
            <div className="flex flex-col gap-xs">
              <p className="text-label-mono uppercase tracking-wider text-text-muted">
                [{lang === 'en' ? 'ROLE' : 'ROL PRINCIPAL'}]
              </p>
              <p
                className="text-headline-md text-text-primary"
                data-i18n-en={titleEn}
                data-i18n-es={titleEs}
              >
                {t(data.title, lang)}
              </p>
            </div>

            <div className="flex flex-col gap-xs border-t border-border-hairline pt-sm">
              <p className="text-label-mono uppercase tracking-wider text-text-muted">
                [{lang === 'en' ? 'AVAILABILITY' : 'DISPONIBILIDAD'}]
              </p>
              <p className="text-body-md text-text-primary">{data.location}</p>
            </div>

            {/* Pipeline core micro matrix — real stack facts, PERFIL.md */}
            <div className="flex flex-col gap-sm bg-canvas-subtle border border-border-hairline p-md">
              <span className="text-label-index uppercase tracking-widest text-text-muted">
                PIPELINE CORE
              </span>
              <div className="grid grid-cols-2 gap-xs text-label-mono text-text-secondary">
                <div>
                  <span className="text-text-muted">FRONT:</span> Angular 17–21
                </div>
                <div>
                  <span className="text-text-muted">RUNTIME:</span> Next.js
                </div>
                <div>
                  <span className="text-text-muted">MOBILE:</span> Flutter / iOS
                </div>
                <div>
                  <span className="text-text-muted">AI/DATA:</span> MCP / Athena
                </div>
              </div>
            </div>
          </div>

          {/* Right — primary editorial type block */}
          <div className="flex flex-col gap-xl lg:col-span-8">
            <h1 className="text-display-hero text-text-primary leading-[0.95]">
              <SplitWords text={data.name} stagger={0.08} />
            </h1>

            <Reveal direction="up" delay={0.15} duration={0.6}>
              <p
                className="text-headline-lg text-text-secondary"
                data-i18n-en={titleEn}
                data-i18n-es={titleEs}
              >
                {t(data.title, lang)}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.3} duration={0.6}>
              <p
                className="max-w-[48rem] text-body-lead text-text-secondary"
                data-i18n-en={summaryEn}
                data-i18n-es={summaryEs}
              >
                {t(data.summary, lang)}
              </p>
            </Reveal>

            <Reveal
              direction="up"
              delay={0.4}
              duration={0.6}
              className="flex flex-wrap items-center gap-md border-t border-border-hairline pt-md"
            >
              <a
                href={`mailto:${data.email}`}
                className="inline-flex items-center gap-sm border border-text-primary bg-text-primary px-lg py-sm text-label-mono font-medium text-canvas-base transition-colors hover:bg-accent-vermilion hover:text-text-primary"
              >
                {data.email}
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={`https://github.com/${data.socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-xs border border-border-hairline bg-canvas-subtle px-md py-sm text-label-mono text-text-primary transition-colors hover:border-text-primary hover:bg-canvas-elevated"
              >
                <span className="text-text-muted">GH:</span>
                {data.socials.github}
                <span className="text-xs text-text-muted" aria-hidden="true">
                  ↗
                </span>
              </a>
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-xs border border-border-hairline bg-canvas-subtle px-md py-sm text-label-mono text-text-primary transition-colors hover:border-text-primary hover:bg-canvas-elevated"
              >
                <span className="text-text-muted">IN:</span>
                {data.socials.github}
                <span className="text-xs text-text-muted" aria-hidden="true">
                  ↗
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Metric telemetry matrix */}
      <div className="border-y border-border-hairline bg-canvas-subtle">
        <div className="grid grid-cols-2 divide-border-hairline px-[var(--shell-padding-x)] lg:grid-cols-4 lg:divide-x">
          {STATS.map((stat) => (
            <div
              key={stat.label.en}
              className="flex flex-col justify-between gap-md border-b border-border-hairline py-xl last:border-b-0 lg:border-b-0 lg:px-lg lg:first:pl-0 lg:last:pr-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-label-index uppercase tracking-widest text-text-muted">
                  [STAT]
                </span>
                <span
                  className={`inline-block h-1.5 w-1.5 ${DOT_CLASS[stat.dot]}`}
                  aria-hidden="true"
                />
              </div>
              <div>
                <div className="text-headline-xl text-text-primary">
                  <CountUp
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={1.4}
                  />
                </div>
                <p
                  className="text-headline-md text-text-secondary"
                  data-i18n-en={stat.label.en}
                  data-i18n-es={stat.label.es}
                >
                  {t(stat.label, lang)}
                </p>
              </div>
              <p
                className="text-body-sm text-text-muted"
                data-i18n-en={stat.note.en}
                data-i18n-es={stat.note.es}
              >
                {t(stat.note, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Capability pillars — real stack grouping, PERFIL.md */}
      <div className="px-[var(--shell-padding-x)] py-2xl">
        <div className="mb-lg flex flex-col gap-sm md:flex-row md:items-end md:justify-between">
          <div>
            <span className="block text-label-index uppercase tracking-widest text-text-muted">
              02 / {lang === 'en' ? 'CAPABILITIES' : 'CAPACIDADES'}
            </span>
            <h2 className="text-headline-lg text-text-primary">
              {lang === 'en'
                ? 'Production infrastructure & tooling'
                : 'Infraestructura y tooling de producción'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[var(--shell-gutter)] md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.tag}
              className="flex min-h-[300px] flex-col justify-between border border-border-hairline bg-canvas-subtle p-lg transition-colors hover:border-text-primary"
            >
              <div className="flex flex-col gap-sm">
                <div className="flex items-center justify-between text-label-mono text-text-muted">
                  <span>{pillar.tag}</span>
                  <span className="text-accent-vermilion">{pillar.marker}</span>
                </div>
                <h3 className="text-headline-md text-text-primary">
                  {t(pillar.title, lang)}
                </h3>
                <p
                  className="text-body-sm text-text-secondary"
                  data-i18n-en={pillar.description.en}
                  data-i18n-es={pillar.description.es}
                >
                  {t(pillar.description, lang)}
                </p>
              </div>
              <div className="flex flex-wrap gap-xs border-t border-border-hairline pt-md">
                {pillar.stack.map((item) => (
                  <span
                    key={item}
                    className="border border-border-hairline bg-canvas-elevated px-xs py-2xs text-label-index text-text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider-hairline" />
    </section>
  );
}
