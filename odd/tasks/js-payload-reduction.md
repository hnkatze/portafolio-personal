# JS payload reduction (mobile Performance 96 → ~100)

Lighthouse 13 on an emulated Moto G Power over Slow 4G scores the site 96. FCP,
LCP, TBT and CLS are already green; the score is held back by the client JS
payload (54 KB unused, 24 KB legacy polyfills) and by Speed Index, which is the
deliberate cost of the entrance animations. This change attacks the payload only.

## Specs

S1. User report (mobile Lighthouse, 2026-11-21): Performance 96, FCP 1.8 s,
LCP 1.8 s, Total Blocking Time 10 ms, CLS 0, Speed Index 4.5 s; "Reduce el
contenido JavaScript que no se use" estimated saving 54 KiB across the
`0x2ng59.o8~u0.js` (46.5 KiB, 30.0 KiB unused) and `0uo-ika7q4ye~.js` (70.6 KiB,
23.6 KiB unused) chunks; "JavaScript antiguo" 24 KiB of polyfills (13.9 KiB of
ours plus 10.4 KiB from Cloudflare's beacon); render-blocking CSS 12 KiB / 300 ms.

S2. User request: "funciono, pero esto le falto para llegar a 100 en rendimiento
… tiene 96 y no esta mal, pero podriamos mejorarlo ?" then "dale dale, vamos con
eso pls" — approving items 1 (modern `browserslist`) and 2 (`LazyMotion`
migration), plus the small ones (image dimensions, long tasks).

S3. Non-goal: do NOT reduce above-the-fold animations to raise Speed Index. The
user's "exaggerated animations" preference stands; SI 4.5 s is the accepted cost.

S4. No visual or behavioral regression: every reveal, marquee, counter, scroll
effect and page transition must keep working, including `prefers-reduced-motion`.

S5. Deploy protocol (added after the 2026-11-21 production incident): after
pushing, purge the Cloudflare cache, wait for a marker specific to the new
commit, then run the Playwright probe THREE times against the deployed URL and
hard-reload once before calling the deploy healthy. Local `next start` alone is
not evidence.

S6. Out of scope: Cloudflare Web Analytics (third-party, the user turns it off in
the dashboard) and the missing `<!DOCTYPE html>` (framework issue).

## Tasks

- T1 (S1, S2) Modern `browserslist` in `package.json` (chrome/edge 111,
  firefox 111, safari 16.4). Route: inline. Commit: pending.
- T2 (S1, S2, S4) `LazyMotion` + `domAnimation` with the `m` component instead of
  `motion` across the animation components, so the full feature bundle is not
  shipped. Route: worker. Commit: pending.
- T3 (S2) Give width/height to any image element Lighthouse flags. Route:
  worker. Commit: pending.
- T4 (S1, S4, S5) Measure: chunk bytes before/after, Playwright render + animation
  smoke check, Lighthouse mobile on the local production build. Route: parent.
  Commit: pending.

## Log

L1. "funciono, pero esto le falto para llegar a 100 en rendimiento … tiene 96 y no
esta mal, pero podriamos mejorarlo ?" (with the full Lighthouse mobile report)

L2. "dale dale, vamos con eso pls"

L3. Baseline measured in this repo before T1: `.next/static/chunks` = 914,176 B
total, 32 client components, `motion` v12 imported as the full `motion` component
in ~19 animation components. Speed Index 4.5 s vs LCP 1.8 s is the animation
cost, explicitly accepted as a non-goal (S3).

L4. T1 (browserslist) measured and REVERTED: chunks 914,176 -> 914,195 B, i.e.
noise. Reason: the 13.9 KiB Lighthouse attributes to us lives in
`0uo-ika7q4ye~.js`, which is Next/React's runtime chunk (same hash server-side on
prod), not app code. `browserslist` cannot remove framework polyfills.

L5. T2 done (worker, reviewed). One `LazyMotion features={domAnimation}` provider
in the root layout (`src/components/animations/lazy-motion-provider.tsx`), every
`motion` import replaced by `m` across 17 files. No component needed a feature
outside domAnimation: `layout`, `layoutId`, `drag` are absent from the repo, and
`AnimatePresence` exit is part of domAnimation. An async
`features={() => import(...)}` split was implemented and measured: 865,002 B
(2,303 B WORSE) plus a post-hydration fetch, so it was rejected.

L6. Measured: `.next/static/chunks` 914,195 -> 862,699 B (-51,496 B, -5.6%);
JS 856,871 -> 805,375 B. The 141,786 B chunk holding the unused features is gone.
Served `/` HTML +285 B (one more client boundary). LCP 2,410 ms / CLS 0.00 on
Slow 4G + 4x CPU — unchanged within noise versus 2,378 ms before. Playwright at
390x844: 8 sections, Reveal 0 -> 1 on scroll, marquee translateX advances, a
reduced-motion context still renders everything, 0 console/page errors.

L7. T3 completed by the parent: the image Lighthouse actually flags is the
external contribution chart in `src/components/integrations/github-contributions.tsx`
(676x128); the file inside the worker's surfaces was dead code.
