import { env } from '@/lib/env';
import { experience, personalInfo } from '@/lib/data';
import type { Lang } from '@/lib/types';
import { ROUTE_PATH } from '@/lib/metadata';

const SITE_URL = env.NEXT_PUBLIC_SITE_URL;
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/* ============================================================
   Structured data (JSON-LD) — lets search engines and AI answer
   engines (ChatGPT browsing, Perplexity, Google AI Overviews) read
   who this is as clean facts instead of inferring from rendered
   text. ProfilePage + Person + WebSite, sourced from the same
   personalInfo/experience used across the site — nothing invented here.

   Built per language: `/` and `/es` are two documents, each one
   naming its own URL and declaring its own inLanguage.
   ============================================================ */
export function buildJsonLd(lang: Lang) {
  const path = ROUTE_PATH[lang];
  const pageUrl = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  // Current employer comes from the same experience[] the Experience
  // section renders — never hardcoded, so it cannot drift from the page.
  const currentRole = experience.find((e) => e.endDate === 'Present') ?? experience[0];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: personalInfo.name,
        url: SITE_URL,
        image: `${SITE_URL}/og-image.jpg`,
        jobTitle: personalInfo.title[lang],
        description: personalInfo.summary[lang],
        email: `mailto:${personalInfo.email}`,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'HN',
        },
        sameAs: [
          `https://github.com/${personalInfo.socials.github}`,
          personalInfo.socials.linkedin,
        ],
        knowsAbout: [
          'React',
          'Next.js',
          'TypeScript',
          'Angular',
          'Astro',
          'Flutter',
          'NestJS',
          'PostgreSQL',
          'AWS',
          'Model Context Protocol (MCP)',
          'AI Tooling',
        ],
        // Both languages are genuinely spoken; this states the person,
        // not the document (the document language is on WebSite below).
        knowsLanguage: ['en', 'es'],
        hasOccupation: {
          '@type': 'Occupation',
          name: personalInfo.title[lang],
        },
        worksFor: currentRole
          ? {
              '@type': 'Organization',
              name: currentRole.company,
            }
          : undefined,
      },
      {
        // ProfilePage is the schema.org type search and AI answer engines use
        // for a personal profile page; it points back at the Person entity
        // instead of standing next to it as an unrelated node.
        '@type': 'ProfilePage',
        '@id': `${pageUrl}/#profilepage`,
        url: pageUrl,
        name: personalInfo.name,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
        inLanguage: lang,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/og-image.jpg`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: 'Camilo Henriquez',
        description: personalInfo.summary.en,
        publisher: { '@id': PERSON_ID },
        // The site publishes a crawlable document per language now, so
        // this claim is verifiable at /  and /es.
        inLanguage: ['en', 'es'],
      },
    ],
  };
}
