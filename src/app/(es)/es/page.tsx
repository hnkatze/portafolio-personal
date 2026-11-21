import { PortfolioPage } from '@/components/portfolio-page';

/* ============================================================
   Spanish home — the crawlable Spanish document.

   No cookies(), no connection(), no Suspense: the language is a
   property of the route, so this page is fully static and the
   Spanish text is in the served HTML. That is the whole point — an
   answer engine that never runs JavaScript can still read it.

   URL is `/es` (the (es) group is not part of the path).
   ============================================================ */
export default function SpanishHome() {
  return <PortfolioPage lang="es" />;
}
