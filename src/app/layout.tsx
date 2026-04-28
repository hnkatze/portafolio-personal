import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { env } from '@/lib/env';
import { I18nProvider } from '@/components/i18n/i18n-provider';

/* ============================================================
   Fonts — Inter (body/headings, variable 100-900) + Geist Mono
   (labels, metadata, code). CSS variables injected on <html>;
   consumed by globals.css @theme.
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
   Viewport — editorial light theme
   ============================================================ */
export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

/* ============================================================
   EditorialHeader — sticky top bar (server component, no interactivity)
   Two rows:
     Row 1: logo + primary nav + CTA
     Row 2: section number + tagline + EST. label  (matches reference)
   ============================================================ */
function EditorialHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between h-16 px-[var(--shell-padding-x)]">
        <a href="/" className="flex items-center gap-3" aria-label="Camilo Henriquez — Home">
          <span aria-hidden="true" className="block h-3 w-3 bg-[#0a0a0a]" />
          <span className="label-mono">CAMILO HENRIQUEZ</span>
        </a>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-10">
          <a href="#about" className="label-mono-muted hover:text-[#1a1a1a] transition-colors">
            SOBRE MÍ
          </a>
          <a href="#experience" className="label-mono-muted hover:text-[#1a1a1a] transition-colors">
            EXPERIENCIA
          </a>
          <a href="#projects" className="label-mono-muted hover:text-[#1a1a1a] transition-colors">
            PROYECTOS
          </a>
          <a href="#contact" className="label-mono-muted hover:text-[#1a1a1a] transition-colors">
            CONTACTO
          </a>
        </nav>

        <a
          href="#contact"
          className="label-mono inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          AGENDAR <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="flex items-center justify-between py-3 px-[var(--shell-padding-x)] border-t border-b border-[#e4e4e7]">
        <span className="label-mono-muted">01</span>
        <span className="label-mono-muted hidden md:inline">FULL-STACK ENGINEER</span>
        <span className="label-mono-muted">EST. 2020</span>
      </div>
    </header>
  );
}

/* ============================================================
   Root Layout — Server Component
   - cacheComponents: true compatible (no dynamic APIs read here)
   - <html lang> defaults to "en"; I18nProvider (client) hydrates
     to actual cookie value on mount.
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
        <I18nProvider initialLang="en">
          <EditorialHeader />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
