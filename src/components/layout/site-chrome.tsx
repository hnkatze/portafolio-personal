import type { ReactNode } from 'react';
import { LenisProvider } from '@/components/lenis-provider';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { ScrollProgress } from '@/components/animations';
import { EditorialHeader } from './editorial-header';
import { SectionNav } from './section-nav';
import type { Lang } from '@/lib/types';

/* ============================================================
   SiteChrome — everything that wraps a page in both root layouts:
   providers, scroll progress, header and section nav.

   `lang` is the document language of the route that renders it, so
   I18nProvider starts already in the right language instead of
   syncing from a cookie after hydration. That is what makes /es a
   real Spanish document rather than an English one that swaps text.

   print:hidden stays on each component, not on a shared wrapper — a
   wrapper div here would become EditorialHeader's sticky containing
   block and break position: sticky (see the /cv-print notes).
   ============================================================ */
export function SiteChrome({
  lang,
  syncFromCookie,
  children,
}: {
  readonly lang: Lang;
  /** Passed straight to I18nProvider; see its docblock. Omitted = legacy cookie sync. */
  readonly syncFromCookie?: boolean;
  readonly children: ReactNode;
}) {
  return (
    <LenisProvider>
      <I18nProvider initialLang={lang} syncFromCookie={syncFromCookie}>
        <ScrollProgress className="print:hidden" />
        <EditorialHeader />
        <SectionNav />
        {children}
      </I18nProvider>
    </LenisProvider>
  );
}
