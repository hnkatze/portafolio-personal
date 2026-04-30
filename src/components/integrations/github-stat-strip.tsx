import { cacheLife, cacheTag } from 'next/cache';
import type { Lang } from '@/lib/types';
import { CountUp } from '@/components/animations';

/* ============================================================
   GitHubStatStrip — server-fetched editorial metrics row.
   Replaces the 3 dark-themed SVG embeds (stats, top-langs, streak)
   with 4 typography-first metrics in the same style as the hero stats.
   ============================================================ */

interface GitHubStatStripProps {
  readonly username: string;
  readonly lang?: Lang;
}

interface RawUser {
  public_repos: number;
  followers: number;
  following: number;
}

interface RawRepo {
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

interface ComputedStats {
  totalRepos: number;
  totalStars: number;
  followers: number;
  primaryLang: string;
}

const FALLBACK: ComputedStats = {
  totalRepos: 0,
  totalStars: 0,
  followers: 0,
  primaryLang: '—',
};

async function fetchStats(username: string): Promise<ComputedStats> {
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
        { headers },
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) return FALLBACK;

    const user = (await userRes.json()) as RawUser;
    const repos = (await reposRes.json()) as RawRepo[];

    const ownRepos = repos.filter((r) => !r.fork);
    const totalStars = ownRepos.reduce(
      (sum, r) => sum + (r.stargazers_count ?? 0),
      0,
    );

    const langCounts = new Map<string, number>();
    for (const repo of ownRepos) {
      if (!repo.language) continue;
      langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
    }
    const primaryLang =
      [...langCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return {
      totalRepos: user.public_repos,
      totalStars,
      followers: user.followers,
      primaryLang,
    };
  } catch {
    return FALLBACK;
  }
}

export async function GitHubStatStrip({ username, lang = 'en' }: GitHubStatStripProps) {
  'use cache';
  cacheLife('hours');
  cacheTag('github-stat-strip');

  const stats = await fetchStats(username);

  const labels = {
    repos: { en: 'PUBLIC REPOS', es: 'REPOS PÚBLICOS' },
    stars: { en: 'TOTAL STARS', es: 'TOTAL STARS' },
    lang: { en: 'PRIMARY LANGUAGE', es: 'LENGUAJE PRINCIPAL' },
    followers: { en: 'FOLLOWERS', es: 'SEGUIDORES' },
  } as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-b border-[#e4e4e7] py-10">
      <Metric
        value={<CountUp to={stats.totalRepos} duration={1.4} />}
        labelEn={labels.repos.en}
        labelEs={labels.repos.es}
      />
      <Metric
        value={<CountUp to={stats.totalStars} duration={1.6} />}
        labelEn={labels.stars.en}
        labelEs={labels.stars.es}
      />
      <Metric
        value={<span>{stats.primaryLang}</span>}
        labelEn={labels.lang.en}
        labelEs={labels.lang.es}
      />
      <Metric
        value={<CountUp to={stats.followers} duration={1.2} />}
        labelEn={labels.followers.en}
        labelEs={labels.followers.es}
      />
    </div>
  );
}

interface MetricProps {
  readonly value: React.ReactNode;
  readonly labelEn: string;
  readonly labelEs: string;
}

function Metric({ value, labelEn, labelEs }: MetricProps) {
  return (
    <div>
      <p
        className="font-extrabold text-[#0a0a0a] leading-none"
        style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
      >
        {value}
      </p>
      <p
        className="label-mono-muted mt-3"
        data-i18n-en={labelEn}
        data-i18n-es={labelEs}
      >
        {labelEn}
      </p>
    </div>
  );
}
