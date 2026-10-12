import type { Testimonial, Lang } from '@/lib/types';
import { I18nSplitWords, Reveal } from '@/components/animations';
import { TestimonialFigure } from './testimonial-figure';

/* ============================================================
   Testimonials Section — Swiss Editorial "Voces" dossier (T-06b).
   Server component. Same breadcrumb/headline skeleton as
   Skills/Experience/Projects/Certifications (T-04..T-07) — no
   Stitch screen exists for this section, so the dossier pattern
   established by those is followed directly: breadcrumb, headline
   + lead, then a plain divided list of entries (index + attribution
   + quote), hairline borders, zero radius, no icons/shadows.

   The previous cinematic pinned-scroll "spotlight stack" scene
   (`TestimonialsSpotlightScene`) is no longer built on — same
   decision already made for the hero's breathing photo (T-03) and
   the projects horizontal pin (T-06): the file stays in the repo
   untouched, this section just stops importing it.

   Content: the 3 real entries in `testimonials` from src/lib/data.ts
   (Honduras Social Foundation, Taller Gerardito, Taller Los Camilos).
   No testimonial, quote, or metric is invented.
   ============================================================ */

interface TestimonialsSectionProps {
  readonly testimonials: Testimonial[];
  readonly lang: Lang;
}

export function TestimonialsSection({
  testimonials,
  lang,
}: TestimonialsSectionProps) {
  const leadEn =
    'Direct, unedited words from the people and businesses behind each shipped project.';
  const leadEs =
    'Palabras directas, sin editar, de las personas y negocios detrás de cada proyecto entregado.';

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative bg-canvas-base"
    >
      {/* Dossier breadcrumb bar — mirrors Skills/Experience/Projects/Certifications "0N /" pattern */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-accent-vermilion">
            06 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-text-primary"
            data-i18n-en="VOICES"
            data-i18n-es="VOCES"
          >
            {lang === 'en' ? 'VOICES' : 'VOCES'}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en="CLIENT RECORD"
            data-i18n-es="REGISTRO DE CLIENTES"
          >
            {lang === 'en' ? 'CLIENT RECORD' : 'REGISTRO DE CLIENTES'}
          </span>
        </div>
      </header>

      {/* Headline + lead */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <h2 id="testimonials-heading" className="text-headline-xl text-text-primary">
          <I18nSplitWords textEn="Voices." textEs="Voces." />
        </h2>
        <Reveal direction="up" delay={0.15} duration={0.6} className="mt-sm">
          <p
            className="max-w-[42rem] text-body-lead text-text-secondary"
            data-i18n-en={leadEn}
            data-i18n-es={leadEs}
          >
            {lang === 'en' ? leadEn : leadEs}
          </p>
        </Reveal>
      </div>

      {/* Divided list of testimonial dossier rows */}
      <div className="border-t border-border-hairline px-[var(--shell-padding-x)] pb-2xl">
        {testimonials.map((testimonial, i) => (
          <Reveal
            key={`${testimonial.name}-${i}`}
            direction="up"
            delay={0.1 * i}
            duration={0.5}
            amount={0.2}
          >
            <TestimonialFigure
              testimonial={testimonial}
              lang={lang}
              index={i + 1}
              isLast={i === testimonials.length - 1}
            />
          </Reveal>
        ))}
      </div>

      <div className="divider-hairline" />
    </section>
  );
}
