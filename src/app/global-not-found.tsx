import type { Metadata } from 'next';
import './globals.css';
import { fontVariables } from './fonts';

export const metadata: Metadata = {
  title: 'Camilo Henriquez — Page not found',
  robots: { index: false, follow: false },
};

/* ============================================================
   global-not-found — 404 for URLs that match no route at all.

   Required because the app has two root layouts: no single layout
   can wrap an unmatched URL, so Next skips normal rendering and
   returns this file directly. That means everything the page needs
   — globals.css, the font variables, html/body — has to be imported
   and rendered here, not inherited.
   ============================================================ */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="min-h-screen bg-canvas-base text-text-primary">
        <main className="min-h-screen flex flex-col items-center justify-center gap-lg px-[var(--shell-padding-x)] text-center">
          <p className="text-label-mono uppercase tracking-widest text-text-muted">
            404 — NOT FOUND
          </p>
          <h1 className="text-headline-xl text-text-primary">
            This page does not exist.
          </h1>
          <p className="text-body-md text-text-secondary max-w-[46ch]">
            The URL you requested is not part of this site. Everything lives on
            the profile page, in English or Spanish.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-md">
            <a
              href="/"
              className="text-label-mono border border-text-primary px-lg py-sm transition-colors hover:bg-text-primary hover:text-canvas-base"
            >
              ENGLISH PROFILE
            </a>
            <a
              href="/es"
              className="text-label-mono border border-border-hairline px-lg py-sm text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
            >
              PERFIL EN ESPAÑOL
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
