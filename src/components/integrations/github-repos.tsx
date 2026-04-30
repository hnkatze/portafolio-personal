import { cacheLife, cacheTag } from 'next/cache';
import type { Lang } from '@/lib/types';

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
};

async function fetchRepos(username: string): Promise<Repo[]> {
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`,
    { headers },
  );
  if (!res.ok) return [];
  const all = (await res.json()) as Repo[];
  // Top 6 by stars, excluding forks
  return all
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);
}

function timeAgo(iso: string, lang: Lang): string {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (d < 1) return lang === 'en' ? 'TODAY' : 'HOY';
  if (d < 30) return `${d}D ${lang === 'en' ? 'AGO' : 'ATRÁS'}`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m}MO ${lang === 'en' ? 'AGO' : 'ATRÁS'}`;
  const y = Math.floor(d / 365);
  return `${y}Y ${lang === 'en' ? 'AGO' : 'ATRÁS'}`;
}

interface GitHubReposProps {
  readonly username: string;
  readonly lang?: Lang;
}

/**
 * Editorial repo list — numbered, hairline-divided rows.
 * Top 6 by stars, excluding forks. Server component with hourly cache.
 */
export async function GitHubRepos({ username, lang = 'en' }: GitHubReposProps) {
  'use cache';
  cacheLife('hours');
  cacheTag('github-repos');

  const repos = await fetchRepos(username);

  if (repos.length === 0) {
    return (
      <div className="py-6">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="label-mono inline-flex items-center gap-2 text-[#0a0a0a] hover:opacity-70 transition-opacity"
        >
          {lang === 'en' ? 'VIEW ON GITHUB' : 'VER EN GITHUB'}{' '}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    );
  }

  return (
    <ol className="list-none p-0 m-0 divide-y divide-[#e4e4e7] border-t border-b border-[#e4e4e7]">
      {repos.map((repo, index) => {
        const num = String(index + 1).padStart(2, '0');
        const updated = timeAgo(repo.updated_at, lang);

        return (
          <li key={repo.id}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[2.5rem_1fr_auto] gap-4 items-baseline py-5 hover:bg-[#fafafa] transition-colors px-2 -mx-2"
            >
              <span className="label-mono-muted">{num}</span>

              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-[#0a0a0a] group-hover:underline truncate inline-flex items-center gap-2">
                  {repo.name}
                  <span
                    aria-hidden="true"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                  >
                    ↗
                  </span>
                </h3>
                {repo.description && (
                  <p className="mt-1 text-sm text-[#52525b] leading-relaxed line-clamp-2 max-w-2xl">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-x-6 gap-y-1 flex-wrap justify-end label-mono-muted whitespace-nowrap">
                {repo.language && <span>{repo.language.toUpperCase()}</span>}
                <span aria-label={`${repo.stargazers_count} stars`}>
                  ★ {repo.stargazers_count}
                </span>
                <span className="hidden sm:inline">{updated}</span>
              </div>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
