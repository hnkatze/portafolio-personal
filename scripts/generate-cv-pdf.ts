/**
 * Generate real cv-en.pdf and cv-es.pdf using Puppeteer or Playwright.
 *
 * NOT YET IMPLEMENTED.
 * Run manually post-deploy OR as a prebuild step once the /cv-print route exists.
 *
 * Pseudo-flow:
 * 1. Start Next.js dev server (or point to a deployed URL).
 * 2. Launch Puppeteer / Playwright → navigate to http://localhost:3000/cv-print?lang=en
 * 3. await page.pdf({ format: 'A4', printBackground: true, path: 'public/cv-en.pdf' })
 * 4. Same for ?lang=es → cv-es.pdf
 * 5. Close browser.
 *
 * TODO: implement with `playwright` or `puppeteer`.
 * Requires a /cv-print page route which is out of scope for this migration phase.
 *
 * Example (Playwright):
 *
 *   import { chromium } from 'playwright';
 *
 *   const browser = await chromium.launch();
 *   const page = await browser.newPage();
 *
 *   for (const lang of ['en', 'es'] as const) {
 *     await page.goto(`http://localhost:3000/cv-print?lang=${lang}`);
 *     await page.waitForLoadState('networkidle');
 *     await page.pdf({
 *       path: `public/cv-${lang}.pdf`,
 *       format: 'A4',
 *       printBackground: true,
 *       margin: { top: 0, right: 0, bottom: 0, left: 0 },
 *     });
 *   }
 *
 *   await browser.close();
 */

export {};
