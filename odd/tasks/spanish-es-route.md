# Spanish route (/es) — a crawlable Spanish document

Make the portfolio's Spanish version a real, indexable document at `/es` with a
correct `<html lang>`, canonical and hreflang signals, without touching design or
copy. Scope comes from the GEO review plus the approved plan; the current
architecture already server-renders Spanish (sections receive `lang` from
`getLang()`), so the only gap is that `getLang()` reads a cookie, not a URL.

## Specs

S1. User request (start of the GEO review): "revisemos el geo pls".

S2. User request (scope and priority): "Dale, revisemos lo necesario pls y
abordemos lo que se merezca, y priorizemos el rendimiento del sitio,".

S3. User request (apply the a11y adjustments): "Hagamos los ajustes necesarios
pls".

S4. User request (approve the plan): "dale".

S5. Approved plan, verification 1 — no regression: `curl -H 'Cookie: lang=es'
/` keeps returning Spanish visible text, exactly as today.

S6. Approved plan, verification 2 — the real success criterion: `curl /es`
without any cookie returns Spanish visible text in the served HTML.

S7. Approved plan, verification 3: `curl /` without any cookie returns English
visible text.

S8. Approved plan, verification 4: `/es` serves `<html lang="es">`; `/` serves
`<html lang="en">`.

S9. Approved plan, verification 5: each route declares its own `canonical` and
`alternates.languages` (`en → /`, `es → /es`, `x-default → /`); `sitemap.xml`
lists both URLs; `public/llms.txt` no longer claims "there is no /es route to
crawl".

S10. Approved plan, verification 6: JSON-LD `inLanguage` is correct per route
(`WebSite` back to `['en','es']`, `ProfilePage` per-route).

S11. Approved plan, verification 7: `npm run build` green with the dev server
stopped; Lighthouse on `/es` scores SEO 100 and Accessibility 100.

S12. Non-goals (approved plan): no design or copy changes, no new translations,
no change to the cookie strategy beyond preserving the visitor's preference.

## Tasks

- T1 (S5, S12) Extract the shared pieces: fonts module, metadata builder,
  JSON-LD builder, site chrome and `PortfolioPage` — behavior-preserving.
  Route: inline. Commit: pending.
- T2 (S5, S7, S8) Split the app into `(en)` and `(es)` route groups with two
  root layouts; move `/cv-print` under `(en)` so `scripts/generate-cv-pdf.ts`
  keeps working. Route: inline. Commit: pending.
- T3 (S6, S8) Add the static `/es` route rendering `PortfolioPage lang="es"`.
  Route: inline. Commit: pending.
- T4 (S9, S10) Per-route canonical + `alternates.languages`, `sitemap.xml`
  entries for both URLs, `llms.txt` correction, JSON-LD per route.
  Route: inline. Commit: pending.
- T5 (S11) Verify: build with dev stopped, the curl matrix S5–S7, JSON-LD and
  sitemap inspection, Lighthouse on `/es`. Route: inline + independent
  verifier (Risk item 3).
- T6 (S6, S8) Bug found during T5: `I18nProvider`'s post-hydration effect
  reads the `lang` cookie and overwrites `initialLang`. On `/es` with no cookie
  the default is `en`, so the provider flips to English after hydration — the
  toggle and the document language contradict the Spanish document. Fix: the
  route language wins; persist it to the cookie instead of reading it on the
  `(es)` route. Route: worker. Commit: pending.

## Log

L1. "revisemos el geo pls"

L2. "Dale, revisemos lo necesario pls y abordemos lo que se merezca, y
priorizemos el rendimiento del sitio,"

L3. "Hagamos los ajustes necesarios pls"

L4. "dale" — approve building the concrete `/es` plan.

L5. "dale" — approve implementing Slice 1 (routing + SEO) of that plan.

L6. Evidence gathered before T1: `src/app/page.tsx` already resolves
`lang` server-side (`getLang()` under `<Suspense>` via `connection()`) and
passes it to every section; `curl -H 'Cookie: lang=es' /` returned
"Desarrollador Full-Stack" 9× and "ROL PRINCIPAL" 2×, with "PRIMARY ROLE" 0×.
Therefore the 259 `data-i18n-en/es` attributes are legacy from the Astro port
and are NOT the mechanism. This reduces the change to routing + metadata.

L7. Evidence from the installed Next 16 docs
(`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md:142`):
multiple root layouts are supported via route groups, and navigating across
root layouts performs a full page load instead of a client-side transition.

L8. Prior work in this session, same review, already verified and left
uncommitted: JSON-LD ProfilePage + Person enrichment (`src/app/layout.tsx`),
and the three AA contrast tokens plus the header label-in-name fix
(`src/app/globals.css`, `src/components/layout/editorial-header.tsx`) reaching
Lighthouse 100/100/100/100. Those files are reorganized by T1/T2, so their
content moves into the new modules.

L9. T1-T4 done; build green with dev stopped, `/es` prerendered as `○ (Static)`.
Verified against the production server: visible text `/` = English, `/es` =
Spanish, `/` with `Cookie: lang=es` still Spanish (no regression); `<html
lang="en">` / `<html lang="es">`; canonical per route; 3 alternate links (en,
es, x-default) on both documents; sitemap lists both URLs with hreflang;
JSON-LD ProfilePage url+inLanguage per route. `curl /cv-print` = 200.
Lighthouse `/es`: Accessibility 100, SEO 100, Agentic Browsing 100, Best
Practices 92.

L10. Two defects found in L9. (a) NEW, caused by the split: the I18nProvider
cookie effect overwrites the route language on `/es` (T6). (b) PRE-EXISTING:
neither `/` nor `/es` emits `<!DOCTYPE html>`; Lighthouse fails the `doctype`
audit on `/es` only. Not caused by this change, not fixed here.

L11. T6 fix: `I18nProvider` gains `syncFromCookie` (default true). The `(es)`
layout passes false through `SiteChrome`, so the ES document keeps its route
language after hydration and writes `lang=es` to the cookie instead of reading
it, which also makes a later visit to `/` land in Spanish.

L12. T6 done (worker, verified by review): `I18nProvider` gained `syncFromCookie`
(default true — `/` path unchanged), a `useRef` mount guard and a
persist-instead-of-read branch; `SiteChrome` forwards the prop; the `(es)`
layout passes false. Worker evidence on a production server: `/es` after
hydration -> htmlLang 'es', ES toggle aria-pressed 'true', cookie lang=es,
Spanish text visible; `/` no cookie -> htmlLang 'en', Spanish not visible;
`/es` then `/` in one cookie jar -> `/` opens in Spanish (persistence works, no
effect loop); build exit 0 twice, `/es` still Static.

L13. Worker note accepted as designed: on `/es` a returning `lang=en` visitor'
preference is overwritten to `es`. Visiting the Spanish URL is an explicit
choice, and the route language winning is the whole point of T6.

L14. Independent verifier launched for S5-S11 under Risk item 3 (new public
URLs + canonical/hreflang contract). Result pending.

L15. Independent verifier verdict: S5-S11 PASS on real requests against
`next start -p 3002`. Lighthouse 12.8.2: `/es` and `/` both SEO 100,
Accessibility 100. No duplicate-content risk: per-route canonical, reciprocal
alternates, Spanish meta description on `/es`, hreflang in the sitemap.
Header nav rendering in English on `/` with `Cookie: lang=es` is PRE-EXISTING
(the old root layout hardcoded `initialLang="en"`), not a regression.

L16. T7/T8/T9 done in response to the verifier's out-of-spec findings:
- T7 `src/app/global-not-found.tsx` + `experimental.globalNotFound` in
  `next.config.ts`. Verified: `/nope` and `/es/nope` return 404 WITH site chrome
  ("ENGLISH PROFILE" link present), `noindex`, `<html lang="en">`.
- T8 `src/lib/metadata.ts` manifest `'/manifest.json'` ->
  `'/manifest.webmanifest'` (the declared path 404'd; verifier flagged it as a
  pre-existing console error). Verified: `rel="manifest"
  href="/manifest.webmanifest"` and the route returns 200.
- T9 JSON-LD `ProfilePage.@id` now `${pageUrl}/#profilepage`, consistent with
  the `#person` / `#website` ids. Verified on `/es`.
Lighthouse `/es` after these: Accessibility 100, SEO 100, Agentic 100, Best
Practices 96 (was 93) — the console error is gone, only `doctype` remains.

L17. `<!DOCTYPE html>` finding, final evidence: the PRERENDERED files
(`.next/server/app/{index,es,cv-print}.html`) also lack it, so it is not a
streaming artifact and cannot be fixed from app code — App Router must emit the
doctype. Identical on HEAD before this change. Reported as a framework-level
item (Next 16.2.4 + cacheComponents), not fixed here.
