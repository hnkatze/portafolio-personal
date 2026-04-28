import type { Experience, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal } from '@/components/animations/reveal';
import { ParallaxLayer } from '@/components/animations/parallax-layer';

interface ExperienceSectionProps {
  readonly experience: Experience[];
  readonly lang: Lang;
}

export function ExperienceSection({ experience, lang }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="relative min-h-screen py-24 overflow-hidden"
      aria-labelledby="experience-heading"
    >
      {/* Background parallax blur circles */}
      <ParallaxLayer
        speed={-0.15}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" aria-hidden="true" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        {/* Section heading */}
        <Reveal direction="up">
          <div className="text-center mb-16">
            <h2
              id="experience-heading"
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              data-i18n-en="Experience"
              data-i18n-es="Experiencia"
            >
              {lang === 'es' ? 'Experiencia' : 'Experience'}
            </h2>
            <p
              className="text-gray-400 max-w-xl mx-auto"
              data-i18n-en="My professional journey building web applications"
              data-i18n-es="Mi trayectoria profesional construyendo aplicaciones web"
            >
              {lang === 'es'
                ? 'Mi trayectoria profesional construyendo aplicaciones web'
                : 'My professional journey building web applications'}
            </p>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gradient line */}
          <div
            className="hidden md:block absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400/40 via-blue-400/20 to-transparent"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {experience.map((entry, index) => (
              <Reveal
                key={`${entry.company}-${index}`}
                direction="up"
                delay={index * 0.1}
              >
                <div className="relative flex flex-col md:flex-row md:items-start gap-6 pl-0 md:pl-12">
                  {/* Timeline dot */}
                  <div
                    className="hidden md:block absolute left-3 top-2 w-3 h-3 rounded-full bg-blue-400 border-2 border-[#0a0a0a] z-10 -translate-x-1/2"
                    aria-hidden="true"
                  />

                  {/* Content card */}
                  <div className="w-full p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-400/20 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(96,165,250,0.06)]">
                    {/* Date range */}
                    <span className="text-xs text-blue-400 font-medium mb-1 block">
                      {entry.startDate} — {entry.endDate}
                    </span>

                    {/* Role */}
                    <h3
                      className="text-lg font-bold text-white mb-1"
                      data-i18n-en={t(entry.role, 'en')}
                      data-i18n-es={t(entry.role, 'es')}
                    >
                      {t(entry.role, lang)}
                    </h3>

                    {/* Company */}
                    <span className="text-sm text-gray-400 mb-3 block">
                      {entry.company}
                    </span>

                    {/* Description */}
                    <p
                      className="text-sm text-gray-400 leading-relaxed mb-3"
                      data-i18n-en={t(entry.description, 'en')}
                      data-i18n-es={t(entry.description, 'es')}
                    >
                      {t(entry.description, lang)}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-1" aria-label="Highlights">
                      {entry.highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="text-xs text-gray-500 flex items-start gap-1.5"
                          data-i18n-en={`- ${t(highlight, 'en')}`}
                          data-i18n-es={`- ${t(highlight, 'es')}`}
                        >
                          <span className="text-blue-400/60 mt-0.5 shrink-0" aria-hidden="true">—</span>
                          <span>{t(highlight, lang)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
