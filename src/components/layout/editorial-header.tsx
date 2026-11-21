'use client';

import { useLang } from '@/components/i18n/i18n-provider';
import { LangToggle } from '@/components/i18n/lang-toggle';
import { SECTION_NAV_ITEMS } from './section-nav';

/* ============================================================
   EditorialHeader — sticky top bar (T-09a). Client component.

   Renders the language through useLang() because this header lives in the
   root layout, which must stay static (no cookies() read) for
   cacheComponents, so it never receives a server-resolved `lang` prop.
   Each root layout seeds I18nProvider with its own document language, and
   a page body is server-rendered from that same value — so provider state
   and server markup agree, with no DOM swapping anywhere.

   Two rows:
     Row 1: logo + primary nav (all 8 sections) + lang toggle + CTA
     Row 2: section counter + tagline + EST. label
   ============================================================ */
export function EditorialHeader() {
  const { lang } = useLang();

  return (
    <header className="print:hidden sticky top-0 z-50 border-b border-border-hairline bg-canvas-base/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 gap-4 px-[var(--shell-padding-x)]">
        {/* No aria-label here on purpose: the visible wordmark abbreviates to
            "CAMILO H." on mobile, and an aria-label that does not contain the
            visible text fails WCAG 2.5.3 (label in name). The sr-only suffix
            completes the name at both breakpoints while the visible text stays
            the label. */}
        <a href="/" className="flex items-center gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="block h-3 w-3 shrink-0 bg-accent-vermilion"
          />
          <span className="text-label-mono truncate text-text-primary">
            <span className="hidden sm:inline">CAMILO HENRIQUEZ</span>
            <span className="sm:hidden">CAMILO H.</span>
          </span>
          <span className="sr-only">— Home</span>
        </a>

        {/* Primary nav — all 8 sections, only visible lg+ to avoid cramped tablet layout */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
          {SECTION_NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-label-mono text-text-secondary transition-colors hover:text-text-primary"
            >
              {lang === 'en' ? item.labelEn : item.labelEs}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <LangToggle />
          <a
            href="#contact"
            className="text-label-mono inline-flex items-center gap-1 text-text-primary hover:opacity-70 transition-opacity"
          >
            {lang === 'en' ? 'BOOK A CALL' : 'AGENDAR'}{' '}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 px-[var(--shell-padding-x)] border-t border-border-hairline">
        <span className="text-label-mono text-text-muted">01</span>
        <span className="text-label-mono text-text-muted hidden md:inline">
          FULL-STACK ENGINEER
        </span>
        <span className="text-label-mono text-text-muted">EST. 2020</span>
      </div>
    </header>
  );
}
