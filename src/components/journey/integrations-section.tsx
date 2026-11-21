import { Suspense } from 'react';
import type { IntegrationConfig, Lang } from '@/lib/types';
import { Reveal, I18nSplitWords } from '@/components/animations';
import { ShimmerSkeleton } from '@/components/animations/shimmer-skeleton';
import { GitHubIcon } from '@/components/icons/tech-icons';
import { GitHubStatStrip } from '@/components/integrations/github-stat-strip';
import { GitHubLangRanking } from '@/components/integrations/github-lang-ranking';
import { GitHubContributions } from '@/components/integrations/github-contributions';
import { GitHubRepos } from '@/components/integrations/github-repos';
import { LinkedInBadge } from '@/components/integrations/linkedin-badge';
import { IntegrationsSceneBlock } from './integrations-scene-block';

/* ============================================================
   Integrations Section — Swiss Editorial dossier (07)
   Server component. No Stitch screen exists for this section —
   follows the same dossier pattern established in T-04..T-09a
   (breadcrumb, headline+lead, hairline-bordered panels, zero
   radius, no shadows). Dropped the pinned-scroll scrollytelling
   mechanism (IntegrationsScrollytellingScene / IntegrationsLeftColumn)
   this section used to build on — same decision already made for
   the hero (ScrollParallax/ScrollScale), projects
   (ProjectsHorizontalScene) and testimonials
   (TestimonialsSpotlightScene): those files stay in the repo
   untouched, this section just stopped importing them.

   All 5 live-data integrations (GitHub stats / lang ranking /
   contributions / repos, LinkedIn) are untouched functionally —
   this is a visual-only rewrite plus real GitHub/LinkedIn icons
   (src/components/icons/tech-icons.tsx, T-09b).
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

  const introEn =
    'Live data pulled straight from GitHub and LinkedIn at request time — not a static snapshot.';
  const introEs =
    'Datos reales traídos directo de GitHub y LinkedIn en cada request — no es una foto estática.';

  return (
    <section id="integrations" className="relative bg-canvas-base">
      {/* Dossier breadcrumb bar — mirrors the other sections' "0N /" pattern */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-text-primary">
            07 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-accent-vermilion"
            data-i18n-en="INTEGRATIONS"
            data-i18n-es="INTEGRACIONES"
          >
            {lang === 'en' ? 'INTEGRATIONS' : 'INTEGRACIONES'}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en="LIVE METRICS"
            data-i18n-es="MÉTRICAS EN VIVO"
          >
            {lang === 'en' ? 'LIVE METRICS' : 'MÉTRICAS EN VIVO'}
          </span>
        </div>
      </header>

      {/* Section headline + intro */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <div className="grid grid-cols-1 gap-xl lg:grid-cols-12 lg:items-end lg:gap-[var(--shell-gutter)]">
          <div className="lg:col-span-8">
            <h2 className="text-headline-xl text-text-primary">
              <I18nSplitWords textEn="Integrations." textEs="Integraciones." />
            </h2>
            <Reveal direction="up" delay={0.15} duration={0.6} className="mt-sm">
              <p
                className="max-w-[42rem] text-body-lead text-text-secondary"
                data-i18n-en={introEn}
                data-i18n-es={introEs}
              >
                {lang === 'en' ? introEn : introEs}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Dossier panels — GitHub stats full-width, lang ranking + contributions
          side by side, repos full-width, LinkedIn full-width */}
      <div className="px-[var(--shell-padding-x)] pb-2xl">
        <div className="grid grid-cols-1 gap-[var(--shell-gutter)] lg:grid-cols-2">
          <Reveal direction="up" delay={0} duration={0.5} className="lg:col-span-2">
            <IntegrationsSceneBlock
              index="01"
              labelEn="GITHUB · LIVE STATS"
              labelEs="GITHUB · ESTADÍSTICAS EN VIVO"
              lang={lang}
              icon={GitHubIcon}
            >
              <Suspense fallback={<ShimmerSkeleton height={140} className="w-full" />}>
                <GitHubStatStrip username={username} lang={lang} />
              </Suspense>
            </IntegrationsSceneBlock>
          </Reveal>

          <Reveal direction="up" delay={0.1} duration={0.5}>
            <IntegrationsSceneBlock
              index="02"
              labelEn="LANGUAGE RANKING · BY REPO COUNT"
              labelEs="RANKING DE LENGUAJES · POR REPOS"
              lang={lang}
              icon={GitHubIcon}
            >
              <Suspense fallback={<ShimmerSkeleton height={180} className="w-full" />}>
                <GitHubLangRanking username={username} lang={lang} />
              </Suspense>
            </IntegrationsSceneBlock>
          </Reveal>

          <Reveal direction="up" delay={0.15} duration={0.5}>
            <IntegrationsSceneBlock
              index="03"
              labelEn="CONTRIBUTION HEATMAP"
              labelEs="MAPA DE CONTRIBUCIONES"
              lang={lang}
              icon={GitHubIcon}
            >
              <Suspense fallback={<ShimmerSkeleton height={140} className="w-full" />}>
                <GitHubContributions username={username} />
              </Suspense>
            </IntegrationsSceneBlock>
          </Reveal>

          <Reveal direction="up" delay={0.2} duration={0.5} className="lg:col-span-2">
            <IntegrationsSceneBlock
              index="04"
              labelEn="TOP REPOSITORIES · BY STARS"
              labelEs="REPOSITORIOS DESTACADOS · POR STARS"
              lang={lang}
              icon={GitHubIcon}
              trailing={
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono inline-flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span data-i18n-en="ALL REPOS" data-i18n-es="TODOS">
                    {lang === 'en' ? 'ALL REPOS' : 'TODOS'}
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              }
            >
              <Suspense fallback={<ShimmerSkeleton height={400} className="w-full" />}>
                <GitHubRepos username={username} lang={lang} />
              </Suspense>
            </IntegrationsSceneBlock>
          </Reveal>

          <Reveal direction="up" delay={0.25} duration={0.5} className="lg:col-span-2">
            <IntegrationsSceneBlock
              index="05"
              labelEn="LINKEDIN"
              labelEs="LINKEDIN"
              lang={lang}
            >
              <LinkedInBadge profileUrl={config.linkedin.profileUrl} lang={lang} />
            </IntegrationsSceneBlock>
          </Reveal>
        </div>
      </div>

      <div className="divider-hairline" />
    </section>
  );
}
