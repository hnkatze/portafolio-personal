import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { env } from '@/lib/env';
import { personalInfo } from '@/lib/data';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { SectionNav } from '@/components/layout/section-nav';
import { EditorialHeader } from '@/components/layout/editorial-header';
import { ScrollProgress } from '@/components/animations';
import { LenisProvider } from '@/components/lenis-provider';

/* ============================================================
   Fonts — Swiss editorial system (Stitch design tokens):
   Space Grotesk (headlines) + Hanken Grotesk (body) + JetBrains Mono
   (metadata/labels/indices). CSS variables injected on <html>;
   consumed by globals.css @theme.
   ============================================================ */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['600', '700'],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
  display: 'swap',
  weight: ['400'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

/* ============================================================
   Metadata — static, SEO-complete
   ============================================================ */
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Camilo Henriquez — Full-Stack Engineer & AI Tooling',
    template: '%s | Camilo Henriquez',
  },
  description:
    'Camilo Henriquez — Full-Stack Engineer & AI Tooling. I build web applications with React, Next.js, Angular, and TypeScript, and create open source MCP servers for AI developer workflows.',
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
  authors: [{ name: 'Camilo Henriquez', url: env.NEXT_PUBLIC_SITE_URL }],
  creator: 'Camilo Henriquez',
  publisher: 'Camilo Henriquez',
  openGraph: {
    title: 'Camilo Henriquez — Full-Stack Engineer & AI Tooling',
    description:
      'Camilo Henriquez — Full-Stack Engineer & AI Tooling. I build web applications with React, Next.js, Angular, and TypeScript, and create open source MCP servers for AI developer workflows.',
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Camilo Henriquez',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Camilo Henriquez — Full-Stack Engineer & AI Tooling',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Camilo Henriquez — Full-Stack Engineer & AI Tooling',
    description:
      'Camilo Henriquez — Full-Stack Engineer & AI Tooling. I build web applications with React, Next.js, Angular, and TypeScript, and create open source MCP servers for AI developer workflows.',
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
  manifest: '/manifest.json',
  alternates: {
    canonical: env.NEXT_PUBLIC_SITE_URL,
  },
};

/* ============================================================
   Viewport — editorial light theme
   ============================================================ */
export const viewport: Viewport = {
  themeColor: '#0D0D11',
  colorScheme: 'dark',
};

/* ============================================================
   Structured data (JSON-LD) — lets search engines and AI answer
   engines (ChatGPT browsing, Perplexity, Google AI Overviews) read
   who this is as clean facts instead of inferring from rendered
   text. Person + WebSite, sourced from the same personalInfo used
   across the site — nothing invented here.
   ============================================================ */
function StructuredData() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: personalInfo.name,
        url: siteUrl,
        image: `${siteUrl}/og-image.jpg`,
        jobTitle: personalInfo.title.en,
        description: personalInfo.summary.en,
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
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Camilo Henriquez',
        description: personalInfo.summary.en,
        publisher: { '@id': `${siteUrl}/#person` },
        inLanguage: ['en', 'es'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ============================================================
   Root Layout — Static Server Component (cacheComponents-friendly)

   The layout MUST stay static — reading cookies()/headers() here
   would block the entire route. Instead, the layout passes
   `initialLang="en"` and the I18nProvider syncs to the actual
   cookie value in a post-hydration useEffect (see provider).
   ============================================================ */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <StructuredData />
        <LenisProvider>
          <I18nProvider initialLang="en">
            {/* print:hidden on each component (not a shared wrapper) — a
                wrapper div here would become EditorialHeader's sticky
                containing block, collapsed to just the header's own
                height instead of the full page, breaking position:sticky.
                /cv-print renders its own printable page; this site chrome
                must never bleed into the exported PDF
                (scripts/generate-cv-pdf.ts calls page.pdf() under the
                print media type). */}
            <ScrollProgress className="print:hidden" />
            <EditorialHeader />
            <SectionNav />
            {children}
          </I18nProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
