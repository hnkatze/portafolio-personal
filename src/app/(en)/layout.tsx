import type { Metadata } from 'next';
import '../globals.css';
import { fontVariables } from '../fonts';
import { buildMetadata, viewport } from '@/lib/metadata';
import { SiteChrome } from '@/components/layout/site-chrome';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = buildMetadata('en');
export { viewport };

/* ============================================================
   Root layout — English document (`/`, `/cv-print`).

   The app has two root layouts (see the (es) group) so each language
   is a real document: `<html lang>` is the route's language, not
   something patched after hydration.
   ============================================================ */
export default function EnRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fontVariables} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <StructuredData lang="en" />
        <SiteChrome lang="en">{children}</SiteChrome>
      </body>
    </html>
  );
}
