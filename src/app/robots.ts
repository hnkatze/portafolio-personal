import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /cv-print is a print-only utility route (feeds scripts/generate-cv-pdf.ts)
        // with the same content as the homepage in a different layout — keeping it
        // out of the index avoids thin/duplicate-content indexing.
        disallow: ['/api/', '/actions/', '/_next/', '/static/', '/cv-print'],
      },
    ],
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    host: env.NEXT_PUBLIC_SITE_URL,
  };
}
