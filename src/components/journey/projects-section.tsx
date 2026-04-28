import type { Project, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal } from '@/components/animations/reveal';
import { ParallaxLayer } from '@/components/animations/parallax-layer';
import { MagneticButton } from '@/components/animations/magnetic-button';

interface ProjectsSectionProps {
  readonly projects: Project[];
  readonly lang: Lang;
}

export function ProjectsSection({ projects, lang }: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="relative min-h-screen py-24 overflow-hidden"
      aria-labelledby="projects-heading"
    >
      {/* Background parallax blur circles */}
      <ParallaxLayer
        speed={-0.1}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" aria-hidden="true" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Section heading */}
        <Reveal direction="up">
          <div className="text-center mb-12">
            <h2
              id="projects-heading"
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              data-i18n-en="Projects"
              data-i18n-es="Proyectos"
            >
              {lang === 'es' ? 'Proyectos' : 'Projects'}
            </h2>
            <p
              className="text-gray-400 max-w-xl mx-auto"
              data-i18n-en="A selection of projects I've built"
              data-i18n-es="Una selección de proyectos que he construido"
            >
              {lang === 'es'
                ? 'Una selección de proyectos que he construido'
                : "A selection of projects I've built"}
            </p>
          </div>
        </Reveal>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Reveal
              key={project.title}
              direction="up"
              delay={index * 0.08}
            >
              <article className="group h-full rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-blue-400/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(96,165,250,0.08)]">
                {/* Project image / placeholder */}
                {project.image ? (
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"
                      aria-hidden="true"
                    />
                  </div>
                ) : (
                  <div
                    className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/5 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="text-3xl font-bold text-white/10 select-none">
                      {project.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="p-5 flex flex-col h-full">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3 flex-1"
                    data-i18n-en={t(project.description, 'en')}
                    data-i18n-es={t(project.description, 'es')}
                  >
                    {t(project.description, lang)}
                  </p>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Technologies used">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-400/10 text-blue-400 border border-blue-400/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action links */}
                  <div className="flex gap-3">
                    {project.projectUrl && (
                      <MagneticButton strength={0.25} asChild>
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                          aria-label={`View demo of ${project.title}`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                          Demo
                        </a>
                      </MagneticButton>
                    )}
                    {project.repoUrl && (
                      <MagneticButton strength={0.25} asChild>
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                          aria-label={`View source code of ${project.title}`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Code
                        </a>
                      </MagneticButton>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
