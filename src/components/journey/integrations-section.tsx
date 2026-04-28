import { Suspense } from 'react';
import type { IntegrationConfig, Lang } from '@/lib/types';
import { Reveal } from '@/components/animations';
import { ShimmerSkeleton } from '@/components/animations/shimmer-skeleton';
import { GitHubStats } from '@/components/integrations/github-stats';
import { GitHubTopLangs } from '@/components/integrations/github-top-langs';
import { GitHubStreak } from '@/components/integrations/github-streak';
import { GitHubContributions } from '@/components/integrations/github-contributions';
import { GitHubRepos } from '@/components/integrations/github-repos';
import { LinkedInBadge } from '@/components/integrations/linkedin-badge';

/* ============================================================
   Integrations Section — Swiss editorial-minimal (07)
   Server component. White background, near-black text,
   massive Inter headline, hairline cards, no shadows, no glow.
   Live integration components are wrapped, not modified.
   ============================================================ */

interface IntegrationsSectionProps {
  readonly config: IntegrationConfig;
  readonly lang?: Lang;
}

export function IntegrationsSection({
  config,
  lang = 'en',
}: IntegrationsSectionProps) {
  const { username, statsTheme } = config.github;

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
        <Reveal direction="up" duration={0.7}>
          <h2
            id="integrations-heading"
            className="sticky top-[6.5rem] z-10 font-extrabold text-[#0a0a0a] tracking-tight leading-[0.95]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
          >
            Integrations.
          </h2>
        </Reveal>
      </div>

      {/* Integration grid — hairline cards, 2-col on desktop */}
      <Reveal direction="up" delay={0.15} duration={0.6}>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* GitHub Stats */}
        <div className="border border-[#e4e4e7] p-6">
          <p
            className="label-mono-muted mb-4"
            data-i18n-en="GITHUB STATS"
            data-i18n-es="ESTADÍSTICAS GITHUB"
          >
            {lang === 'en' ? 'GITHUB STATS' : 'ESTADÍSTICAS GITHUB'}
          </p>
          <Suspense
            fallback={<ShimmerSkeleton height={180} className="w-full" />}
          >
            <GitHubStats username={username} theme={statsTheme} />
          </Suspense>
        </div>

        {/* Top Languages */}
        <div className="border border-[#e4e4e7] p-6">
          <p
            className="label-mono-muted mb-4"
            data-i18n-en="TOP LANGUAGES"
            data-i18n-es="LENGUAJES PRINCIPALES"
          >
            {lang === 'en' ? 'TOP LANGUAGES' : 'LENGUAJES PRINCIPALES'}
          </p>
          <Suspense
            fallback={<ShimmerSkeleton height={180} className="w-full" />}
          >
            <GitHubTopLangs username={username} theme={statsTheme} />
          </Suspense>
        </div>

        {/* Streak — full width */}
        <div className="border border-[#e4e4e7] p-6 md:col-span-2">
          <p
            className="label-mono-muted mb-4"
            data-i18n-en="STREAK"
            data-i18n-es="RACHA"
          >
            {lang === 'en' ? 'STREAK' : 'RACHA'}
          </p>
          <Suspense
            fallback={<ShimmerSkeleton height={180} className="w-full" />}
          >
            <GitHubStreak username={username} theme={statsTheme} />
          </Suspense>
        </div>

        {/* Contributions — full width */}
        <div className="border border-[#e4e4e7] p-6 md:col-span-2">
          <p
            className="label-mono-muted mb-4"
            data-i18n-en="CONTRIBUTIONS"
            data-i18n-es="CONTRIBUCIONES"
          >
            {lang === 'en' ? 'CONTRIBUTIONS' : 'CONTRIBUCIONES'}
          </p>
          <Suspense
            fallback={<ShimmerSkeleton height={200} className="w-full" />}
          >
            <GitHubContributions username={username} />
          </Suspense>
        </div>

        {/* Repos — full width */}
        <div className="border border-[#e4e4e7] p-6 md:col-span-2">
          <p
            className="label-mono-muted mb-4"
            data-i18n-en="REPOSITORIES"
            data-i18n-es="REPOSITORIOS"
          >
            {lang === 'en' ? 'REPOSITORIES' : 'REPOSITORIOS'}
          </p>
          <Suspense
            fallback={<ShimmerSkeleton height={400} className="w-full" />}
          >
            <GitHubRepos username={username} />
          </Suspense>
        </div>

        {/* LinkedIn — full width */}
        <div className="border border-[#e4e4e7] p-6 md:col-span-2">
          <p
            className="label-mono-muted mb-4"
            data-i18n-en="LINKEDIN"
            data-i18n-es="LINKEDIN"
          >
            LINKEDIN
          </p>
          <LinkedInBadge profileUrl={config.linkedin.profileUrl} />
        </div>
      </div>
      </Reveal>

      {/* Bottom hairline divider */}
      <div className="divider-hairline mt-24" />
    </section>
  );
}
