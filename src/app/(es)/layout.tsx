import type { Metadata } from 'next';
import '../globals.css';
import { fontVariables } from '../fonts';
import { buildMetadata, viewport } from '@/lib/metadata';
import { SiteChrome } from '@/components/layout/site-chrome';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = buildMetadata('es');
export { viewport };

/* ============================================================
   Root layout — Spanish document (`/es`).

   Same chrome as the English layout, but `<html lang="es">` and
   I18nProvider seeded with `es`, so the served HTML is Spanish text
   that crawlers and AI answer engines can read without JavaScript.
   ============================================================ */
export default function EsRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${fontVariables} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <StructuredData lang="es" />
        {/* syncFromCookie={false}: the route language wins on /es. The
            provider persists lang=es instead of reading the cookie, so a
            later visit to / opens in Spanish. */}
        <SiteChrome lang="es" syncFromCookie={false}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
