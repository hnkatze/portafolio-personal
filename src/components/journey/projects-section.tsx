import type { Project, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal } from '@/components/animations';

/* ============================================================
   Projects Section — Swiss editorial-minimal (section 05)
   Server component. White background, near-black text,
   massive Inter headline, Geist Mono uppercase metadata,
   hairline gray dividers, generous whitespace.
   Pure typography, no images — tech projects read editorial.
   ============================================================ */

interface ProjectsSectionProps {
  readonly projects: Project[];
  readonly lang: Lang;
}

export function ProjectsSection({ projects, lang }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="relative bg-white px-[var(--shell-padding-x)] py-[var(--section-padding-y)]"
      aria-labelledby="projects-heading"
    >
      {/* Section number + label row — leaf spans, hydration-safe */}
      <header className="-mx-[var(--shell-padding-x)] grid grid-cols-3 items-center border-t border-b border-[#e4e4e7] py-3 px-[var(--shell-padding-x)]">
        <span className="label-mono">05</span>
        <span
          className="label-mono-muted text-center"
          data-i18n-en="PROJECTS"
          data-i18n-es="PROYECTOS"
        >
          {lang === 'en' ? 'PROJECTS' : 'PROYECTOS'}
        </span>
        <span
          className="label-mono-muted text-right"
          data-i18n-en="SELECTED WORK"
          data-i18n-es="TRABAJOS SELECCIONADOS"
        >
          {lang === 'en' ? 'SELECTED WORK' : 'TRABAJOS SELECCIONADOS'}
        </span>
      </header>

      {/* Massive headline */}
      <div className="mt-16">
        <Reveal direction="up" duration={0.7}>
          <h2
            id="projects-heading"
            className="sticky top-[6.5rem] z-10 font-extrabold text-[#0a0a0a] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            data-i18n-en="Projects."
            data-i18n-es="Proyectos."
          >
            {lang === 'en' ? 'Projects.' : 'Proyectos.'}
          </h2>
        </Reveal>
      </div>

      {/* Projects grid — pure typography */}
      <Reveal direction="up" delay={0.15} duration={0.6}>
      <ul className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 list-none p-0 m-0">
        {projects.map((project, index) => {
          const num = String(index + 1).padStart(2, '0');
          const stack = project.technologies.join(' / ').toUpperCase();

          return (
            <li key={project.title}>
              <article className="flex flex-col h-full">
                {/* Number */}
                <span className="label-mono">{num}</span>

                {/* Title */}
                <h3 className="mt-4 text-2xl font-semibold text-[#0a0a0a] leading-tight">
                  {project.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-3 max-w-md text-base leading-relaxed text-[#1a1a1a]"
                  data-i18n-en={t(project.description, 'en')}
                  data-i18n-es={t(project.description, 'es')}
                >
                  {t(project.description, lang)}
                </p>

                {/* Tech stack */}
                {project.technologies.length > 0 && (
                  <p className="mt-6 label-mono-muted">{stack}</p>
                )}

                {/* Links */}
                {(project.projectUrl || project.repoUrl) && (
                  <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-mono inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                        aria-label={`View live demo of ${project.title}`}
                      >
                        LIVE <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-mono inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                        aria-label={`View source code of ${project.title}`}
                      >
                        CODE <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ul>
      </Reveal>

      {/* Bottom hairline divider */}
      <div className="divider-hairline mt-24" />
    </section>
  );
}
