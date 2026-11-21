import type { Metadata, Viewport } from 'next';
import { env } from '@/lib/env';
import { personalInfo } from '@/lib/data';
import type { Lang } from '@/lib/types';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;

/** Path of the crawlable document for a language. `/` is English, `/es` Spanish. */
export const ROUTE_PATH: Record<Lang, string> = {
  en: '/',
  es: '/es',
};

const EN_DESCRIPTION =
  'Camilo Henriquez — Full-Stack Engineer & AI Tooling. I build web applications with React, Next.js, Angular, and TypeScript, and create open source MCP servers for AI developer workflows.';

const TITLE = 'Camilo Henriquez — Full-Stack Engineer & AI Tooling';

/* ============================================================
   Per-language metadata.

   Two root layouts mean two crawlable documents, so every signal
   that names a URL has to be built per language: canonical, the
   hreflang set, openGraph.url/locale. The ES description reuses the
   Spanish summary already in data.ts — no new copy.
   ============================================================ */
export function buildMetadata(lang: Lang): Metadata {
  const path = ROUTE_PATH[lang];
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const description = lang === 'es' ? personalInfo.summary.es : EN_DESCRIPTION;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: TITLE,
      template: '%s | Camilo Henriquez',
    },
    description,
    keywords: [
      'full stack developer',
      'frontend engineer',
      'react',
      'nextjs',
      'angular',
      'astro',
      'typescript',
      'nestjs',
      'postgresql',
      'mcp server',
      'model context protocol',
      'ai tooling',
      'developer tools',
      'honduras',
      'remote developer',
    ],
    authors: [{ name: 'Camilo Henriquez', url: SITE_URL }],
    creator: 'Camilo Henriquez',
    publisher: 'Camilo Henriquez',
    openGraph: {
      title: TITLE,
      description,
      url,
      siteName: 'Camilo Henriquez',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          type: 'image/jpeg',
          alt: TITLE,
        },
      ],
      locale: lang === 'es' ? 'es_HN' : 'en_US',
      alternateLocale: lang === 'es' ? ['en_US'] : ['es_HN'],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description,
      creator: '@camilohenriquez',
      images: ['/twitter-card.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.webmanifest',
    alternates: {
      canonical: url,
      languages: {
        en: SITE_URL,
        es: `${SITE_URL}/es`,
        'x-default': SITE_URL,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#0D0D11',
  colorScheme: 'dark',
};
