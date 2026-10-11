'use client';

import { useLang } from '@/components/i18n/i18n-provider';
import { LangToggle } from '@/components/i18n/lang-toggle';
import { SECTION_NAV_ITEMS } from './section-nav';

/* ============================================================
   EditorialHeader — sticky top bar (T-09a). Client component.

   Uses useLang() directly instead of data-i18n-* leaf spans:
   this header lives in the root layout, which must stay static
   (no cookies() read) for cacheComponents, so it never receives
   a server-resolved `lang` prop. The i18n provider only syncs
   REACT STATE on mount for the real cookie value — it does not
   run the DOM-swap (that's reserved for user-triggered toggles,
   see i18n-provider.tsx) — so a component here needs to be a
   genuinely reactive client component to render the right
   language on first paint. Same pattern/gotcha already logged
   for contact-section.tsx in T-08.

   Two rows:
     Row 1: logo + primary nav (all 8 sections) + lang toggle + CTA
     Row 2: section counter + tagline + EST. label
   ============================================================ */
export function EditorialHeader() {
  const { lang } = useLang();

  return (
    <header className="print:hidden sticky top-0 z-50 border-b border-border-hairline bg-canvas-base/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 gap-4 px-[var(--shell-padding-x)]">
        <a
          href="/"
          className="flex items-center gap-3 min-w-0"
          aria-label="Camilo Henriquez — Home"
        >
          <span
            aria-hidden="true"
            className="block h-3 w-3 shrink-0 bg-accent-vermilion"
          />
          <span className="text-label-mono truncate text-text-primary">
            <span className="hidden sm:inline">CAMILO HENRIQUEZ</span>
            <span className="sm:hidden">CAMILO H.</span>
          </span>
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
