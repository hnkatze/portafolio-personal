import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();

  // Two crawlable documents since the (en)/(es) split: `/` (English) and
  // `/es` (Spanish). Each declares the other as `alternate`, so crawlers
  // treat them as one page in two languages instead of duplicates.
  const languages = { en: base, es: `${base}/es` } as const;

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${base}/es`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
