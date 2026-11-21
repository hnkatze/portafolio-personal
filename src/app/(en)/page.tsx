import { Suspense } from 'react';
import { connection } from 'next/server';
import { getLang } from '@/lib/cookies';
import { PortfolioPage } from '@/components/portfolio-page';
import type { Lang } from '@/lib/types';

/* ============================================================
   LangBoundary — defers to request time so getLang() (cookies)
   runs under <Suspense> as required by cacheComponents: true.
   ============================================================ */
async function LangBoundary({
  children,
}: {
  children: (lang: Lang) => React.ReactNode;
}) {
  await connection();
  const lang = await getLang();
  return <>{children(lang)}</>;
}

/* ============================================================
   SectionsFallback — lightweight skeleton while LangBoundary resolves.
   ============================================================ */
function SectionsFallback() {
  return (
    <div
      aria-hidden="true"
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center px-6">
        <div className="h-16 md:h-24 w-64 mx-auto bg-[#f4f4f5] animate-pulse mb-4" />
        <div className="h-8 w-48 mx-auto bg-[#f4f4f5] animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Home page — Server Component, English document.
 *
 * Architecture (cacheComponents: true / dynamicIO):
 * - Static shell: SiteChrome / EditorialHeader (in the (en) layout).
 * - Dynamic subtree: the page body needs the lang cookie, so it hangs
 *   off <Suspense> around <LangBoundary>, which calls connection() +
 *   getLang() to opt into request-time rendering.
 *
 * Cookie behavior is unchanged on purpose: a visitor who chose ES keeps
 * landing on Spanish content at `/`. The crawlable Spanish document
 * lives at `/es` (see the (es) route group).
 */
export default function Home() {
  return (
    <Suspense fallback={<SectionsFallback />}>
      <LangBoundary>{(lang) => <PortfolioPage lang={lang} />}</LangBoundary>
    </Suspense>
  );
}
