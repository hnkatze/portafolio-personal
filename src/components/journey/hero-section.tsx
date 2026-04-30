import Image from 'next/image';
import type { Lang, PersonalInfo } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Reveal, CountUp, SplitWords, ScrollParallax, ScrollScale, MagneticButton } from '@/components/animations';

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
          <div>
            <h1
              className="font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            >
              <SplitWords text={data.name} stagger={0.08} />
            </h1>

            <Reveal direction="up" delay={0.15} duration={0.6}>
              <p
                className="mt-6 font-medium text-[#1a1a1a] leading-snug"
                style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
                data-i18n-en={titleEn}
                data-i18n-es={titleEs}
              >
                {t(data.title, lang)}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.3} duration={0.6}>
              <p
                className="mt-8 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]"
                data-i18n-en={summaryEn}
                data-i18n-es={summaryEs}
              >
                {t(data.summary, lang)}
              </p>
            </Reveal>
          </div>

          {/* Photo — large editorial portrait */}
          <div className="order-first lg:order-last">
            <ScrollParallax offset={-100}>
              <Image
                src={data.photo}
                alt={data.name}
                width={520}
                height={650}
                className="grayscale aspect-[4/5] object-cover w-64 sm:w-72 lg:w-80 xl:w-[26rem]"
                priority
              />
            </ScrollParallax>
          </div>
        </div>

        {/* Stats row — animated metrics, editorial framing */}
        <ScrollScale from={0.92} to={1} fromOpacity={0.4} toOpacity={1}>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-b border-[#e4e4e7] py-8">
          <div>
            <p
              className="font-extrabold text-[#0a0a0a] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              <CountUp to={4} suffix="+" duration={1.4} />
            </p>
            <p
              className="label-mono-muted mt-3"
              data-i18n-en="YEARS EXPERIENCE"
              data-i18n-es="AÑOS EXPERIENCIA"
            >
              {lang === 'en' ? 'YEARS EXPERIENCE' : 'AÑOS EXPERIENCIA'}
            </p>
          </div>
          <div>
            <p
              className="font-extrabold text-[#0a0a0a] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              <CountUp to={130} suffix="+" duration={1.8} />
            </p>
            <p
              className="label-mono-muted mt-3"
              data-i18n-en="API ENDPOINTS"
              data-i18n-es="ENDPOINTS API"
            >
              {lang === 'en' ? 'API ENDPOINTS' : 'ENDPOINTS API'}
            </p>
          </div>
          <div>
            <p
              className="font-extrabold text-[#0a0a0a] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              <CountUp to={25} suffix="+" duration={1.6} />
            </p>
            <p
              className="label-mono-muted mt-3"
              data-i18n-en="PROJECTS DELIVERED"
              data-i18n-es="PROYECTOS ENTREGADOS"
            >
              {lang === 'en' ? 'PROJECTS DELIVERED' : 'PROYECTOS ENTREGADOS'}
            </p>
          </div>
          <div>
            <p
              className="font-extrabold text-[#0a0a0a] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              <CountUp to={2} duration={1.2} />
            </p>
            <p
              className="label-mono-muted mt-3"
              data-i18n-en="OPEN SOURCE MCP SERVERS"
              data-i18n-es="MCP SERVERS OPEN SOURCE"
            >
              {lang === 'en' ? 'OPEN SOURCE MCP SERVERS' : 'MCP SERVERS OPEN SOURCE'}
            </p>
          </div>
        </div>
        </ScrollScale>

        {/* Primary CTA — magnetic editorial button */}
        <Reveal direction="up" delay={0.4} duration={0.7} className="mt-20">
          <MagneticButton asChild className="inline-block">
            <a
              href="#contact"
              className="inline-flex items-center gap-4 bg-[#0a0a0a] text-white px-10 py-5 hover:bg-[#1a1a1a] transition-colors label-mono"
              data-i18n-en="LET'S BUILD →"
              data-i18n-es="CONSTRUYAMOS →"
            >
              {lang === 'en' ? "LET'S BUILD" : 'CONSTRUYAMOS'}
              <span aria-hidden="true" className="text-lg">→</span>
            </a>
          </MagneticButton>
        </Reveal>

        {/* Secondary social links — sutil, debajo del CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href={`https://github.com/${data.socials.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono-muted inline-flex items-center gap-1 hover:text-[#0a0a0a] transition-colors"
          >
            GITHUB <span aria-hidden="true">↗</span>
          </a>
          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono-muted inline-flex items-center gap-1 hover:text-[#0a0a0a] transition-colors"
          >
            LINKEDIN <span aria-hidden="true">↗</span>
          </a>
          <a
            href={`mailto:${data.email}`}
            className="label-mono-muted inline-flex items-center gap-1 hover:text-[#0a0a0a] transition-colors"
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
