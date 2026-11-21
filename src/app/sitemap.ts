import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();

  // Only one real route exists — the language toggle is a cookie-driven
  // DOM swap on the same URL, not a distinct /es path, so it has no
  // entry of its own here (an /es entry would 404 for crawlers).
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
