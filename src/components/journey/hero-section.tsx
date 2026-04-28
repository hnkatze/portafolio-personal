import Image from 'next/image';
import type { Lang, PersonalInfo } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal } from '@/components/animations';

/* ============================================================
   Hero Section — Swiss editorial-minimal
   Server component. White background, near-black text,
   massive Inter headline, Geist Mono uppercase metadata,
   hairline gray dividers, generous whitespace.
   No gradients, no glow, no glassmorphism.
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
      id="about"
      className="relative bg-white"
    >
      {/* Section number + label row — leaf spans, hydration-safe */}
      <header className="grid grid-cols-3 items-center border-t border-b border-[#e4e4e7] py-3 px-[var(--shell-padding-x)]">
        <span className="label-mono">02</span>
        <span
          className="label-mono-muted text-center"
          data-i18n-en="ABOUT"
          data-i18n-es="SOBRE MÍ"
        >
          {lang === 'en' ? 'ABOUT' : 'SOBRE MÍ'}
        </span>
        <span className="label-mono-muted text-right">
          FULL-STACK ENGINEER
        </span>
      </header>

      {/* Body */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-start">
          {/* Headline column */}
          <Reveal direction="up" duration={0.7}>
            <h1
              className="font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            >
              {data.name}
            </h1>

            <p
              className="mt-6 font-medium text-[#1a1a1a] leading-snug"
              style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
              data-i18n-en={titleEn}
              data-i18n-es={titleEs}
            >
              {t(data.title, lang)}
            </p>

            <p
              className="mt-8 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]"
              data-i18n-en={summaryEn}
              data-i18n-es={summaryEs}
            >
              {t(data.summary, lang)}
            </p>
          </Reveal>

          {/* Photo — small grayscale square */}
          <div className="order-first lg:order-last">
            <Image
              src={data.photo}
              alt={data.name}
              width={300}
              height={300}
              className="grayscale aspect-square object-cover w-48 h-48 lg:w-56 lg:h-56"
              priority
            />
          </div>
        </div>

        {/* Social links — pure typography */}
        <div className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href={`https://github.com/${data.socials.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            GITHUB <span aria-hidden="true">↗</span>
          </a>
          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            LINKEDIN <span aria-hidden="true">↗</span>
          </a>
          <a
            href={`mailto:${data.email}`}
            className="label-mono inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            EMAIL <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* Bottom hairline divider — flow into next section */}
      <div className="divider-hairline mt-24" />
    </section>
  );
}
