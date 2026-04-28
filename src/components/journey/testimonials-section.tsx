import type { Testimonial, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal, SplitWords } from '@/components/animations';

/* ============================================================
   Testimonials Section — Swiss editorial-minimal (06)
   Server component. White background, near-black text,
   massive Inter headline, Geist Mono uppercase metadata,
   text-first testimonials. No photos, no gradients, no glow.
   ============================================================ */

interface TestimonialsSectionProps {
  readonly testimonials: Testimonial[];
  readonly lang: Lang;
}

export function TestimonialsSection({
  testimonials,
  lang,
}: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className="relative bg-white px-[var(--shell-padding-x)] py-[var(--section-padding-y)]"
      aria-labelledby="testimonials-heading"
    >
      {/* Section number + label row — leaf spans, hydration-safe */}
      <header className="grid grid-cols-3 items-center border-t border-b border-[#e4e4e7] py-3 -mx-[var(--shell-padding-x)] px-[var(--shell-padding-x)]">
        <span className="label-mono">06</span>
        <span
          className="label-mono-muted text-center"
          data-i18n-en="VOICES"
          data-i18n-es="VOCES"
        >
          {lang === 'en' ? 'VOICES' : 'VOCES'}
        </span>
        <span
          className="label-mono-muted text-right"
          data-i18n-en="WHAT CLIENTS SAY"
          data-i18n-es="LO QUE DICEN"
        >
          {lang === 'en' ? 'WHAT CLIENTS SAY' : 'LO QUE DICEN'}
        </span>
      </header>

      {/* Massive headline */}
      <div className="mt-16">
        <h2
          id="testimonials-heading"
          className="sticky top-[6.5rem] z-10 font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
        >
          <SplitWords text="Voices." />
        </h2>
      </div>

      {/* Testimonials grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {testimonials.map((item, index) => {
          const quoteEn = t(item.quote, 'en');
          const quoteEs = t(item.quote, 'es');
          const roleEn = t(item.role, 'en');
          const roleEs = t(item.role, 'es');
          const attributionEn = `— ${item.name} · ${roleEn} · ${item.project}`;
          const attributionEs = `— ${item.name} · ${roleEs} · ${item.project}`;
          const isLast = index === testimonials.length - 1;

          return (
            <Reveal
              key={`${item.name}-${index}`}
              direction="up"
              delay={index * 0.08}
            >
              <figure
                className={`flex flex-col ${
                  !isLast
                    ? 'pb-12 border-b border-[#e4e4e7] md:pb-0 md:border-b-0'
                    : ''
                }`}
              >
                {/* Quote — decorative quote marks via CSS pseudo-elements */}
                <p
                  className="text-lg md:text-xl font-normal italic text-[#1a1a1a] leading-relaxed before:content-['“'] after:content-['”']"
                  data-i18n-en={quoteEn}
                  data-i18n-es={quoteEs}
                >
                  {t(item.quote, lang)}
                </p>

                {/* Attribution — single mono line: NAME · ROLE · COMPANY */}
                <figcaption
                  className="label-mono mt-6"
                  data-i18n-en={attributionEn}
                  data-i18n-es={attributionEs}
                >
                  {lang === 'en' ? attributionEn : attributionEs}
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>

      {/* Bottom hairline divider */}
      <div className="divider-hairline mt-24" />
    </section>
  );
}
