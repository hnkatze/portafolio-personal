import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { env } from '@/lib/env';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { CursorFollower } from '@/components/animations/cursor-follower';

/* ============================================================
   Fonts — Option C (user decision)
   - Inter: body + headings, variable font, weights 100-900
   - Geist Mono: code blocks, CV dates, mono contexts
   CSS variables injected on <html>; consumed by globals.css @theme
   ============================================================ */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

/* ============================================================
   Metadata — static, SEO-complete
   Sources: Astro Layout.astro lines 9-57 (verbatim copy intent)
   Note: themeColor / colorScheme moved to viewport export per Next.js 14+ deprecation
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
  authors: [{ name: 'Camilo Henriquez' }],
  openGraph: {
    title: 'Camilo Henriquez — Full-Stack Engineer & AI Tooling',
    description:
      'Camilo Henriquez — Full-Stack Engineer & AI Tooling. I build web applications with React, Next.js, Angular, and TypeScript, and create open source MCP servers for AI developer workflows.',
    url: env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Camilo Henriquez',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@camilohenriquez',
    images: ['/twitter-card.png'],
  },
  robots: {
    index: true,
    follow: true,
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
   Viewport — separated from metadata per Next.js 14+ requirement
   themeColor and colorScheme must be exported here, NOT in metadata
   ============================================================ */
export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

/* ============================================================
   Root Layout — Server Component (no 'use client')

   cacheComponents: true / dynamicIO mode design notes:
   - Layout does NOT read cookies (no getLang() here) — it is static.
   - <html lang> defaults to "en"; I18nProvider (client) reads the cookie
     on mount and updates the DOM, ensuring correct lang without layout
     being dynamic.
   - Pages that need server-side lang resolution call connection() +
     getLang() themselves, opting only that page into dynamic rendering.
   - This keeps the layout prerenderable as a static shell.
   ============================================================ */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {/* I18nProvider: client component — reads lang cookie on mount,
            initialLang="en" is SSR default; client hydrates from actual cookie */}
        <I18nProvider initialLang="en">
          {children}
          {/* CursorFollower — desktop-only magnetic cursor overlay.
              Self-gates on matchMedia(min-width:768px) + hover:hover
              and respects prefers-reduced-motion. */}
          <CursorFollower />
        </I18nProvider>
      </body>
    </html>
  );
}
