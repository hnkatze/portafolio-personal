import { Suspense } from 'react';
import type { IntegrationConfig } from '@/lib/types';
import { Reveal } from '@/components/animations/reveal';
import { ShimmerSkeleton } from '@/components/animations/shimmer-skeleton';
import { GitHubStats } from '@/components/integrations/github-stats';
import { GitHubTopLangs } from '@/components/integrations/github-top-langs';
import { GitHubStreak } from '@/components/integrations/github-streak';
import { GitHubContributions } from '@/components/integrations/github-contributions';
import { GitHubRepos } from '@/components/integrations/github-repos';
import { LinkedInBadge } from '@/components/integrations/linkedin-badge';

interface IntegrationsSectionProps {
  readonly config: IntegrationConfig;
}

export function IntegrationsSection({ config }: IntegrationsSectionProps) {
  const { username, statsTheme } = config.github;

  return (
    <section
      id="integrations"
      className="relative min-h-screen py-24 overflow-hidden"
      aria-labelledby="integrations-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        {/* Section heading */}
        <Reveal direction="up">
          <div className="text-center mb-12">
            <h2
              id="integrations-heading"
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              data-i18n-en="GitHub Activity"
              data-i18n-es="Actividad GitHub"
            >
              GitHub Activity
            </h2>
            <p
              className="text-gray-400 max-w-xl mx-auto"
              data-i18n-en="Live stats and contributions from my GitHub profile"
              data-i18n-es="Estadísticas y contribuciones en vivo de mi perfil de GitHub"
            >
              Live stats and contributions from my GitHub profile
            </p>
          </div>
        </Reveal>

        <div className="space-y-6">
          {/* Row 1: Stats + Top Langs (2-col grid on lg) */}
          <Reveal direction="up" delay={0.1}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GitHubStats username={username} theme={statsTheme} />
              <GitHubTopLangs username={username} theme={statsTheme} />
            </div>
          </Reveal>

          {/* Row 2: Streak (full width, deterministic) */}
          <Reveal direction="up" delay={0.2}>
            <GitHubStreak username={username} theme={statsTheme} />
          </Reveal>

          {/* Row 3: Contributions graph (async, needs Suspense) */}
          <Reveal direction="up" delay={0.25}>
            <Suspense fallback={<ShimmerSkeleton height={200} rounded="xl" className="w-full" />}>
              <GitHubContributions username={username} />
            </Suspense>
          </Reveal>

          {/* Row 4: Repos grid (async, needs Suspense) */}
          <Reveal direction="up" delay={0.3}>
            <Suspense fallback={<ShimmerSkeleton height={400} rounded="xl" className="w-full" />}>
              <GitHubRepos username={username} />
            </Suspense>
          </Reveal>

          {/* Row 5: LinkedIn badge */}
          <Reveal direction="up" delay={0.35}>
            <div className="flex justify-center pt-2">
              <LinkedInBadge profileUrl={config.linkedin.profileUrl} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
