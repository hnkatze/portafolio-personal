/**
 * Generate the real downloadable CV PDFs (EN + ES) from the live
 * /cv-print route (src/app/cv-print/page.tsx), which renders the
 * CV straight from src/lib/data.ts — the same source of truth the
 * rest of the site uses, so the PDF can never drift out of sync
 * the way the old hand-made PDFs in public/cv/ did (T-11..T-14).
 *
 * Precondition: a Next.js server (dev or prod) must already be
 * running and reachable — this script does not start one itself,
 * to avoid the complexity/fragility of managing a server process
 * (port readiness, teardown, etc.) inside a one-shot export script.
 *
 *   npm run build && npm run start   (or npm run dev)
 *   npm run cv:pdf
 *
 * Base URL defaults to http://localhost:3000, override with
 * CV_BASE_URL for a deployed target, e.g.:
 *   CV_BASE_URL=https://camilohenriquez.com npm run cv:pdf
 *
 * Output file names match the ones already hardcoded in
 * contact-section.tsx's download handler — kept as-is (T-14)
 * rather than renamed, so no other file needs to change.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.CV_BASE_URL ?? 'http://localhost:3000';
const OUT_DIR = path.join(process.cwd(), 'public', 'cv');

const TARGETS = [
  { lang: 'es', file: 'Camilo Henriquez — CV Desarrollador Full-Stack.pdf' },
  { lang: 'en', file: 'Camilo Henriquez — Full-Stack Engineer CV.pdf' },
] as const;

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();

    for (const { lang, file } of TARGETS) {
      const url = `${BASE_URL}/cv-print?lang=${lang}`;
      console.log(`→ ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });

      // @page { margin: 0 } in globals.css — the /cv-print page itself
      // sets its own 14mm/9mm vertical/horizontal padding, so margins
      // are controlled in exactly one place (T-12).
      await page.pdf({
        path: path.join(OUT_DIR, file),
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
      console.log(`  ✓ public/cv/${file}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
