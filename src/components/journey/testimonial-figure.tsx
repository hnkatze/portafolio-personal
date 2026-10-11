import type { Testimonial, Lang } from '@/lib/types';
import { t } from '@/lib/i18n';

/* ================================================================
   TestimonialFigure — Server Component, Swiss Editorial dossier row
   (T-06b). Rewritten from the old light-mode card: index "06.0N" +
   name/role attribution column, quote + visit-link column. No stock
   icons/avatars, no shadow — hairline border between rows only.
   ================================================================ */

interface TestimonialFigureProps {
  readonly testimonial: Testimonial;
  readonly lang: Lang;
  /** 1-based position within the testimonials list — drives the "06.0N" index. */
  readonly index: number;
  /** Last item has no border-bottom. */
  readonly isLast?: boolean;
}

export function TestimonialFigure({
  testimonial,
  lang,
  index,
  isLast = false,
}: TestimonialFigureProps) {
  const quoteEn = t(testimonial.quote, 'en');
  const quoteEs = t(testimonial.quote, 'es');
  const roleEn = t(testimonial.role, 'en');
  const roleEs = t(testimonial.role, 'es');
  const projectUrl = toProjectUrl(testimonial.project);

  return (
    <figure
      className={`grid grid-cols-1 gap-lg py-xl lg:grid-cols-12 lg:gap-[var(--shell-gutter)] ${
        !isLast ? 'border-b border-border-hairline' : ''
      }`}
    >
      {/* Index + attribution column — name is identity content, never uppercased */}
      <div className="flex flex-col gap-xs lg:col-span-4">
        <span className="text-label-index text-text-muted">
          06.{String(index).padStart(2, '0')}
        </span>
        <figcaption className="text-headline-md text-text-primary">
          {testimonial.name}
        </figcaption>
        <span
          className="text-label-mono text-text-secondary"
          data-i18n-en={roleEn}
          data-i18n-es={roleEs}
        >
          {lang === 'en' ? roleEn : roleEs}
        </span>
      </div>

      {/* Quote + link column */}
      <div className="flex flex-col gap-md lg:col-span-8">
        <p
          className="text-body-lead leading-relaxed text-text-primary before:content-['“'] before:text-accent-vermilion after:content-['”'] after:text-accent-vermilion"
          data-i18n-en={quoteEn}
          data-i18n-es={quoteEs}
        >
          {t(testimonial.quote, lang)}
        </p>

        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 self-start border-b border-border-hairline text-label-mono text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
            aria-label={`Visit ${testimonial.project} (opens in new tab)`}
          >
            <span
              data-i18n-en={`VISIT ${testimonial.project.toUpperCase()}`}
              data-i18n-es={`VISITAR ${testimonial.project.toUpperCase()}`}
            >
              {lang === 'en' ? 'VISIT' : 'VISITAR'} {testimonial.project.toUpperCase()}
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </figure>
  );
}

/**
 * Builds a clickable URL from the testimonial's `project` field.
 * If `project` already includes a protocol, returns it as-is.
 * If it looks like a bare domain (contains a dot), prepends https://.
 * Otherwise returns null and no link is rendered.
 */
export function toProjectUrl(project: string): string | null {
  const trimmed = project.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/\.[a-z]{2,}$/i.test(trimmed)) return `https://${trimmed}`;
  return null;
}
