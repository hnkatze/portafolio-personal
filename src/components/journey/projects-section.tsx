import type { BilingualText, Lang, Project } from '@/lib/types';
import { t } from '@/lib/i18n';
import { I18nSplitWords, Reveal } from '@/components/animations';
import { ProjectCard, type ProjectAccent } from './project-card';

/* ============================================================
   Projects Section — Swiss Editorial "Proyectos Seleccionados"
   dossier (T-06). Server component. Dark canvas, same breadcrumb
   /headline/legend skeleton as Skills (T-04) and Experience
   (T-05), then two groups mirroring PERFIL.md "Proyectos
   destacados" verbatim: "Dev Tools & MCP" (cobalt accent — the
   design tokens reserve cobalt for MCP/certifications) and
   "Clientes / Real-World" (vermilion accent).

   Reference: Stitch screen ed0680fc4cc94f95b0ff912055d90349
   ("Proyectos — Interactive Studio Edition") for the breadcrumb +
   two-category + numbered-row structure only. Its per-project type
   labels ("MCP-SERVER", "WEB APP"...) and statuses ("STABLE",
   "PRODUCTION BUILD"...) were dropped — same criterion as T-04/T-05
   (unverifiable invented metrics). The only per-project status
   this section shows is derived programmatically from real
   `Project.projectUrl`/`repoUrl` presence in data.ts (LIVE+REPO /
   LIVE ONLY / REPO ONLY).

   This replaces the previous cinematic ProjectsHorizontalScene
   (HorizontalPin horizontal-scroll pin) — dropped per the redesign
   decision to stop building on the cinematic work. The file is
   left in the repo, just no longer imported here.

   Respects that "El Carbonal FC" and "Template Catalog" were
   removed from data.ts `projects` (client decision, deprecated).
   ============================================================ */

interface ProjectsSectionProps {
  readonly projects: Project[];
  readonly lang: Lang;
}

interface ProjectGroup {
  readonly key: string;
  readonly index: string;
  readonly title: BilingualText;
  readonly accent: ProjectAccent;
  readonly items: Project[];
}

// Matches PERFIL.md "Proyectos destacados > Dev Tools & MCP" verbatim —
// the first 4 entries in data.ts `projects` (comment-delimited there too).
const DEV_TOOL_TITLES = new Set([
  'Swagger Extractor',
  'Swagger Extractor MCP',
  'PrimeNG MCP Server',
  'FetchMate',
]);

export function ProjectsSection({ projects, lang }: ProjectsSectionProps) {
  const devTools = projects.filter((p) => DEV_TOOL_TITLES.has(p.title));
  const clientWork = projects.filter((p) => !DEV_TOOL_TITLES.has(p.title));

  const groups: readonly ProjectGroup[] = [
    {
      key: 'dev-tools',
      index: '01',
      title: { es: 'Dev Tools & MCP', en: 'Dev Tools & MCP' },
      accent: 'cobalt',
      items: devTools,
    },
    {
      key: 'client-work',
      index: '02',
      title: { es: 'Clientes / Real-World', en: 'Clients / Real-World' },
      accent: 'vermilion',
      items: clientWork,
    },
  ];

  const introEn =
    'Ten public projects, organized the same way as my profile: developer tools and MCP servers for AI workflows, and client / real-world projects in production.';
  const introEs =
    'Diez proyectos públicos, organizados igual que en mi perfil: herramientas y servidores MCP para flujos de IA, y proyectos cliente / real-world en producción.';

  const privateNoteEn =
    'Private MCP servers built to consume Amazon Athena (analytical queries), authentication services, and other internal sources, exposing them as tools for AI assistants in client/company-specific workflows.';
  const privateNoteEs =
    'MCP servers privados construidos para consumir Amazon Athena (consultas analíticas), servicios de autenticación y otras fuentes internas, exponiéndolas como herramientas para asistentes de IA en flujos de trabajo específicos de cliente/empresa.';

  return (
    <section id="projects" className="relative bg-canvas-base">
      {/* Dossier breadcrumb bar — mirrors Skills/Experience "0N /" pattern */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-text-primary">
            05 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-accent-vermilion"
            data-i18n-en="PROJECTS"
            data-i18n-es="PROYECTOS"
          >
            {lang === 'en' ? 'PROJECTS' : 'PROYECTOS'}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en="SELECTED WORK"
            data-i18n-es="TRABAJOS SELECCIONADOS"
          >
            {lang === 'en' ? 'SELECTED WORK' : 'TRABAJOS SELECCIONADOS'}
          </span>
        </div>
      </header>

      {/* Headline + lead + registry legend */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <div className="grid grid-cols-1 gap-xl lg:grid-cols-12 lg:items-end lg:gap-[var(--shell-gutter)]">
          <div className="lg:col-span-8">
            <h2 className="text-headline-xl text-text-primary">
              <I18nSplitWords textEn="Projects." textEs="Proyectos." />
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

          {/* Registry legend — group counts */}
          <div className="flex flex-col gap-xs border-t border-border-hairline pt-sm lg:col-span-4 lg:items-end lg:border-t-0 lg:border-l lg:pl-md lg:pt-0">
            <span
              className="text-label-index uppercase tracking-widest text-text-muted"
              data-i18n-en="REGISTRY"
              data-i18n-es="REGISTRO"
            >
              {lang === 'en' ? 'REGISTRY' : 'REGISTRO'}
            </span>
            <div className="flex flex-col gap-2xs text-label-mono lg:items-end">
              {groups.map((group) => (
                <span
                  key={group.key}
                  className="inline-flex items-center gap-1.5 text-text-secondary"
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 ${
                      group.accent === 'cobalt' ? 'bg-accent-cobalt' : 'bg-accent-vermilion'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{String(group.items.length).padStart(2, '0')}</span>
                  <span
                    data-i18n-en={group.title.en}
                    data-i18n-es={group.title.es}
                  >
                    {t(group.title, lang)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project groups */}
      <div className="px-[var(--shell-padding-x)] pb-2xl">
        {groups.map((group, gi) => (
          <Reveal
            key={group.key}
            direction="up"
            delay={0.1 * gi}
            duration={0.5}
            amount={0.1}
            className={gi < groups.length - 1 ? 'mb-2xl' : ''}
          >
            <div>
              <div className="mb-md flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline pb-sm">
                <div className="flex items-center gap-sm">
                  <span
                    className={`text-label-index font-semibold ${
                      group.accent === 'cobalt' ? 'text-accent-cobalt' : 'text-accent-vermilion'
                    }`}
                  >
                    {group.index} /
                  </span>
                  <h3
                    className="text-headline-lg text-text-primary"
                    data-i18n-en={group.title.en}
                    data-i18n-es={group.title.es}
                  >
                    {t(group.title, lang)}
                  </h3>
                </div>
                <span className="shrink-0 border border-border-hairline bg-canvas-subtle px-xs py-2xs text-label-mono text-text-muted">
                  {String(group.items.length).padStart(2, '0')}{' '}
                  {lang === 'en' ? 'ITEMS' : 'ITEMS'}
                </span>
              </div>

              <div className="flex flex-col divide-y divide-border-hairline border-t border-border-hairline">
                {group.items.map((project, i) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    lang={lang}
                    groupIndex={group.index}
                    itemIndex={i + 1}
                    accent={group.accent}
                  />
                ))}
              </div>

              {/* Private MCP servers note — sourced verbatim from PERFIL.md
                  "MCP Servers > Privados" (not a data.ts project; no public
                  repo/URL exists to link, so it's informational only). */}
              {group.key === 'dev-tools' && (
                <div className="mt-lg border border-border-hairline bg-canvas-subtle p-md">
                  <div className="mb-xs flex items-center justify-between border-b border-border-hairline pb-xs">
                    <span
                      className="text-label-index uppercase tracking-widest text-text-muted"
                      data-i18n-en="MCP SERVERS — PRIVATE"
                      data-i18n-es="MCP SERVERS — PRIVADOS"
                    >
                      {lang === 'en' ? 'MCP SERVERS — PRIVATE' : 'MCP SERVERS — PRIVADOS'}
                    </span>
                    <span className="text-label-index text-accent-cobalt">
                      NDA
                    </span>
                  </div>
                  <p
                    className="text-body-sm leading-relaxed text-text-secondary"
                    data-i18n-en={privateNoteEn}
                    data-i18n-es={privateNoteEs}
                  >
                    {lang === 'en' ? privateNoteEn : privateNoteEs}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="divider-hairline" />
    </section>
  );
}
