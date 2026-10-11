import type { BilingualText, Lang, Project } from '@/lib/types';
import { t } from '@/lib/i18n';

/* ================================================================
   ProjectCard — Server Component (T-06)
   Swiss editorial dossier row for one project entry inside a
   ProjectsSection group (Dev Tools & MCP / Clientes / Real-World).
   Index, status and tech tags are all derived from the real
   src/lib/data.ts `Project` fields — no invented metrics (no
   "STABLE"/"PRODUCTION BUILD"-style status labels like the Stitch
   mock used): LIVE/REPO presence is the only verifiable signal
   available, so that's what the status badge reports.
   ================================================================ */

export type ProjectAccent = 'vermilion' | 'cobalt';

interface ProjectCardProps {
  readonly project: Project;
  readonly lang: Lang;
  /** Group index, e.g. "01" (Dev Tools & MCP) or "02" (Clientes / Real-World). */
  readonly groupIndex: string;
  /** 1-based position within the group. */
  readonly itemIndex: number;
  readonly accent: ProjectAccent;
}

const STATUS_LIVE_REPO: BilingualText = { es: 'LIVE + REPO', en: 'LIVE + REPO' };
const STATUS_LIVE_ONLY: BilingualText = { es: 'SOLO LIVE', en: 'LIVE ONLY' };
const STATUS_REPO_ONLY: BilingualText = { es: 'SOLO REPO', en: 'REPO ONLY' };

const ACCENT_TEXT: Record<ProjectAccent, string> = {
  vermilion: 'text-accent-vermilion',
  cobalt: 'text-accent-cobalt',
};

const ACCENT_HOVER_TEXT: Record<ProjectAccent, string> = {
  vermilion: 'group-hover:text-accent-vermilion',
  cobalt: 'group-hover:text-accent-cobalt',
};

const ACCENT_HOVER_BORDER: Record<ProjectAccent, string> = {
  vermilion: 'group-hover:border-accent-vermilion',
  cobalt: 'group-hover:border-accent-cobalt',
};

export function ProjectCard({
  project,
  lang,
  groupIndex,
  itemIndex,
  accent,
}: ProjectCardProps) {
  const num = `${groupIndex}.${String(itemIndex).padStart(2, '0')}`;
  const hasLive = Boolean(project.projectUrl);
  const hasRepo = Boolean(project.repoUrl);
  const status = hasLive && hasRepo
    ? STATUS_LIVE_REPO
    : hasLive
      ? STATUS_LIVE_ONLY
      : STATUS_REPO_ONLY;

  return (
    <article className="group grid grid-cols-1 gap-y-sm py-lg transition-colors lg:grid-cols-12 lg:gap-[var(--shell-gutter)]">
      {/* Left — index, status, title, tech tags */}
      <div className="lg:col-span-4">
        <div className="mb-xs flex items-center gap-xs text-label-mono">
          <span className={ACCENT_TEXT[accent]}>{num}</span>
          <span className="text-text-muted">•</span>
          <span
            className="text-text-secondary"
            data-i18n-en={status.en}
            data-i18n-es={status.es}
          >
            {t(status, lang)}
          </span>
        </div>
        <h4
          className={`text-headline-md text-text-primary transition-colors ${ACCENT_HOVER_TEXT[accent]}`}
        >
          {project.title}
        </h4>

        {project.technologies.length > 0 && (
          <div className="mt-sm flex flex-wrap gap-xs">
            {project.technologies.map((techName) => (
              <span
                key={techName}
                className="border border-border-hairline bg-canvas-subtle px-sm py-2xs text-[11px] font-medium text-text-secondary"
              >
                {techName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right — description + links */}
      <div className="lg:col-span-8 lg:border-l lg:border-border-hairline lg:pl-xl">
        <p
          className="text-body-sm leading-relaxed text-text-secondary lg:text-body-md"
          data-i18n-en={t(project.description, 'en')}
          data-i18n-es={t(project.description, 'es')}
        >
          {t(project.description, lang)}
        </p>

        {(project.projectUrl ?? project.repoUrl) && (
          <div className="mt-sm flex flex-wrap items-center gap-lg">
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-label-mono inline-flex items-center gap-1.5 border-b border-border-hairline pb-2xs text-text-primary transition-colors hover:border-text-primary ${ACCENT_HOVER_BORDER[accent]}`}
                aria-label={`View live demo of ${project.title}`}
              >
                {/* Leaf span — applyLangToDom only swaps elements with zero
                    children, so the i18n text and the arrow icon must be
                    separate leaf nodes, not combined in the <a> itself. */}
                <span data-i18n-en="LIVE DEMO" data-i18n-es="DEMO EN VIVO">
                  {lang === 'en' ? 'LIVE DEMO' : 'DEMO EN VIVO'}
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-mono inline-flex items-center gap-1.5 border-b border-border-hairline pb-2xs text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                aria-label={`View source code of ${project.title}`}
              >
                <span data-i18n-en="SOURCE CODE" data-i18n-es="CÓDIGO FUENTE">
                  {lang === 'en' ? 'SOURCE CODE' : 'CÓDIGO FUENTE'}
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
