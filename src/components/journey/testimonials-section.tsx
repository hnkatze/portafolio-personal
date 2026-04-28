import type { Testimonial, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal } from '@/components/animations/reveal';
import { ParallaxLayer } from '@/components/animations/parallax-layer';

interface TestimonialsSectionProps {
  readonly testimonials: Testimonial[];
  readonly lang: Lang;
}

const ARC_DIRECTIONS = ['up', 'left', 'right'] as const;
type ArcDirection = (typeof ARC_DIRECTIONS)[number];

function getArcDirection(index: number): ArcDirection {
  return ARC_DIRECTIONS[index % ARC_DIRECTIONS.length];
}

export function TestimonialsSection({ testimonials, lang }: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className="relative min-h-screen py-24 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Background parallax blur circles */}
      <ParallaxLayer
        speed={-0.15}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" aria-hidden="true" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <Reveal direction="up">
          <div className="text-center mb-16">
            <h2
              id="testimonials-heading"
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              data-i18n-en="What Clients Say"
              data-i18n-es="Lo que dicen mis clientes"
            >
              {lang === 'es' ? 'Lo que dicen mis clientes' : 'What Clients Say'}
            </h2>
            <p
              className="text-gray-400 max-w-xl mx-auto"
              data-i18n-en="Real feedback from people I've worked with"
              data-i18n-es="Opiniones reales de personas con las que he trabajado"
            >
              {lang === 'es'
                ? 'Opiniones reales de personas con las que he trabajado'
                : "Real feedback from people I've worked with"}
            </p>
          </div>
        </Reveal>

        {/* Testimonials grid with arc stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <Reveal
              key={`${item.name}-${index}`}
              direction={getArcDirection(index)}
              delay={index * 0.12}
            >
              <article className="group relative flex flex-col h-full p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-400/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(251,191,36,0.06)]">
                {/* Quote icon */}
                <svg
                  className="w-8 h-8 text-amber-400/40 mb-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>

                {/* Quote text */}
                <blockquote
                  className="text-gray-300 text-sm leading-relaxed mb-6 flex-1"
                  data-i18n-en={`"${t(item.quote, 'en')}"`}
                  data-i18n-es={`"${t(item.quote, 'es')}"`}
                >
                  &ldquo;{t(item.quote, lang)}&rdquo;
                </blockquote>

                {/* Separator */}
                <div className="border-t border-white/5 pt-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar with initials */}
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/20 flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      <span className="text-xs font-bold text-amber-400">
                        {item.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                    </div>

                    {/* Author info */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p
                        className="text-xs text-gray-500 truncate"
                        data-i18n-en={t(item.role, 'en')}
                        data-i18n-es={t(item.role, 'es')}
                      >
                        {t(item.role, lang)}
                      </p>
                      {item.project && (
                        <p className="text-xs text-gray-600 truncate">{item.project}</p>
                      )}
                    </div>
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
