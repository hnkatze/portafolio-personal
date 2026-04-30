import { Suspense } from 'react';
import type { IntegrationConfig, Lang } from '@/lib/types';
import { Reveal, SplitWords } from '@/components/animations';
import { ShimmerSkeleton } from '@/components/animations/shimmer-skeleton';
import { GitHubStatStrip } from '@/components/integrations/github-stat-strip';
import { GitHubLangRanking } from '@/components/integrations/github-lang-ranking';
import { GitHubContributions } from '@/components/integrations/github-contributions';
import { GitHubRepos } from '@/components/integrations/github-repos';
import { LinkedInBadge } from '@/components/integrations/linkedin-badge';

/* ============================================================
   Integrations Section — Swiss editorial-minimal (07)
   Server component. Compact layout: typography-first stat strip,
   editorial repo list, hairline contribution chart.
   ============================================================ */

interface IntegrationsSectionProps {
  readonly config: IntegrationConfig;
  readonly lang?: Lang;
}

export function IntegrationsSection({
  config,
  lang = 'en',
}: IntegrationsSectionProps) {
  const { username } = config.github;

  return (
    <section
      id="integrations"
      className="relative bg-white px-[var(--shell-padding-x)] py-[var(--section-padding-y)]"
      aria-labelledby="integrations-heading"
    >
      {/* Section number + label row — leaf spans, hydration-safe */}
      <header className="grid grid-cols-3 items-center border-t border-b border-[#e4e4e7] py-3 -mx-[var(--shell-padding-x)] px-[var(--shell-padding-x)]">
        <span className="label-mono">07</span>
        <span
          className="label-mono-muted text-center"
          data-i18n-en="INTEGRATIONS"
          data-i18n-es="INTEGRACIONES"
        >
          {lang === 'en' ? 'INTEGRATIONS' : 'INTEGRACIONES'}
        </span>
        <span
          className="label-mono-muted text-right"
          data-i18n-en="LIVE METRICS"
          data-i18n-es="MÉTRICAS EN VIVO"
        >
          {lang === 'en' ? 'LIVE METRICS' : 'MÉTRICAS EN VIVO'}
        </span>
      </header>

      {/* Massive headline */}
      <div className="mt-16">
        <h2
          id="integrations-heading"
          className="sticky top-[6.5rem] z-10 font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
          style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
        >
          <SplitWords text="Integrations." />
        </h2>
      </div>

      {/* Centered content stack — 80% on desktop */}
      <div className="mt-20 mx-auto w-[80%] flex flex-col gap-16">
        {/* GitHub stat strip — replaces the 3 dark SVG embeds */}
        <Reveal direction="up" amount={0.1}>
          <div>
            <p
              className="label-mono-muted mb-6"
              data-i18n-en="GITHUB · LIVE STATS"
              data-i18n-es="GITHUB · ESTADÍSTICAS EN VIVO"
            >
              {lang === 'en' ? 'GITHUB · LIVE STATS' : 'GITHUB · ESTADÍSTICAS EN VIVO'}
            </p>
            <Suspense
              fallback={<ShimmerSkeleton height={140} className="w-full" />}
            >
              <GitHubStatStrip username={username} lang={lang} />
            </Suspense>
          </div>
        </Reveal>

        {/* Language ranking — proportional hairline bars */}
        <Reveal direction="up" amount={0.1}>
          <div>
            <p
              className="label-mono-muted mb-6"
              data-i18n-en="LANGUAGE RANKING · BY REPO COUNT"
              data-i18n-es="RANKING DE LENGUAJES · POR REPOS"
            >
              {lang === 'en'
                ? 'LANGUAGE RANKING · BY REPO COUNT'
                : 'RANKING DE LENGUAJES · POR REPOS'}
            </p>
            <Suspense
              fallback={<ShimmerSkeleton height={180} className="w-full" />}
            >
              <GitHubLangRanking username={username} lang={lang} />
            </Suspense>
          </div>
        </Reveal>

        {/* Contribution heatmap */}
        <Reveal direction="up" amount={0.1}>
          <div>
            <p
              className="label-mono-muted mb-4"
              data-i18n-en="CONTRIBUTION HEATMAP"
              data-i18n-es="MAPA DE CONTRIBUCIONES"
            >
              {lang === 'en' ? 'CONTRIBUTION HEATMAP' : 'MAPA DE CONTRIBUCIONES'}
            </p>
            <Suspense
              fallback={<ShimmerSkeleton height={140} className="w-full" />}
            >
              <GitHubContributions username={username} />
            </Suspense>
          </div>
        </Reveal>

        {/* Top repos — editorial list, sorted by stars */}
        <Reveal direction="up" amount={0.1}>
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <p
                className="label-mono-muted"
                data-i18n-en="TOP REPOSITORIES · BY STARS"
                data-i18n-es="REPOSITORIOS DESTACADOS · POR STARS"
              >
                {lang === 'en'
                  ? 'TOP REPOSITORIES · BY STARS'
                  : 'REPOSITORIOS DESTACADOS · POR STARS'}
              </p>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono text-[#0a0a0a] hover:opacity-70 transition-opacity"
                data-i18n-en="ALL REPOS ↗"
                data-i18n-es="TODOS ↗"
              >
                {lang === 'en' ? 'ALL REPOS ↗' : 'TODOS ↗'}
              </a>
            </div>
            <Suspense
              fallback={<ShimmerSkeleton height={400} className="w-full" />}
            >
              <GitHubRepos username={username} lang={lang} />
            </Suspense>
          </div>
        </Reveal>

        {/* LinkedIn — minimal editorial CTA */}
        <Reveal direction="up" amount={0.1}>
          <div>
            <p
              className="label-mono-muted mb-4"
              data-i18n-en="LINKEDIN"
              data-i18n-es="LINKEDIN"
            >
              LINKEDIN
            </p>
            <LinkedInBadge profileUrl={config.linkedin.profileUrl} lang={lang} />
          </div>
        </Reveal>
      </div>

      {/* Bottom hairline divider */}
      <div className="divider-hairline mt-24" />
    </section>
  );
}
