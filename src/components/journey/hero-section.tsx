import type { Lang, PersonalInfo } from '@/lib/types';
import { t } from '@/lib/i18n';
import {
  MagneticButton,
  MeshGradient,
  ParallaxLayer,
  TextReveal,
} from '@/components/animations';
import { BreathingPhoto } from './hero-breathing-photo';

/* ============================================================
   Hero Section — RSC composition
   Renders static markup on the server, hosts client-island
   animation primitives (MeshGradient, ParallaxLayer, TextReveal,
   MagneticButton, BreathingPhoto) as children.

   Design notes:
   - Only the NAME uses <TextReveal> because it is static text.
     Title and summary use data-i18n-en/es attrs so the
     DOM-swap in <I18nProvider> can swap text without splitting.
   - Background is layered: MeshGradient (animated SVG blobs)
     → slow parallax (blurred blobs) → fast parallax (pinpoints).
   ============================================================ */

interface HeroSectionProps {
  readonly data: PersonalInfo;
  readonly lang: Lang;
}

export function HeroSection({ data, lang }: HeroSectionProps) {
  const titleEn = t(data.title, 'en');
  const titleEs = t(data.title, 'es');
  const summaryEn = t(data.summary, 'en');
  const summaryEs = t(data.summary, 'es');

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Layer 1 — animated mesh gradient */}
      <MeshGradient
        className="opacity-60"
        colors={['#60a5fa', '#a78bfa', '#3b82f6', '#8b5cf6']}
      />

      {/* Layer 2 — slow parallax blur blobs */}
      <ParallaxLayer
        speed={-0.3}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/[0.03] rounded-full blur-[100px]" />
      </ParallaxLayer>

      {/* Layer 3 — fast parallax pinpoints */}
      <ParallaxLayer
        speed={0.2}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[15%] right-[20%] w-2 h-2 bg-blue-400/40 rounded-full" />
        <div className="absolute top-[35%] left-[15%] w-1.5 h-1.5 bg-purple-400/30 rounded-full" />
        <div className="absolute bottom-[25%] right-[30%] w-1 h-1 bg-white/20 rounded-full" />
        <div className="absolute top-[60%] left-[25%] w-2.5 h-2.5 bg-blue-300/20 rounded-full" />
      </ParallaxLayer>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Profile photo with breathing + glow */}
        <div className="mb-8">
          <BreathingPhoto src={data.photo} alt={data.name} />
        </div>

        {/* Name — static string, safe to split */}
        <TextReveal
          as="h1"
          text={data.name}
          splitBy="chars"
          stagger={0.025}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
        />

        {/* Title — bilingual, uses DOM-swap attrs */}
        <p
          className="text-xl md:text-2xl text-blue-400 font-medium mb-6"
          data-i18n-en={titleEn}
          data-i18n-es={titleEs}
        >
          {t(data.title, lang)}
        </p>

        {/* Summary — bilingual, uses DOM-swap attrs */}
        <p
          className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          data-i18n-en={summaryEn}
          data-i18n-es={summaryEs}
        >
          {t(data.summary, lang)}
        </p>

        {/* Social links — magnetic */}
        <div className="flex items-center justify-center gap-4">
          <MagneticButton asChild className="inline-block">
            <a
              href={`https://github.com/${data.socials.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 inline-flex"
              aria-label="GitHub"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </MagneticButton>

          <MagneticButton asChild className="inline-block">
            <a
              href={data.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 inline-flex"
              aria-label="LinkedIn"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </MagneticButton>

          <MagneticButton asChild className="inline-block">
            <a
              href={`mailto:${data.email}`}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 inline-flex"
              aria-label="Email"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
