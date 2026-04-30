import { cacheLife, cacheTag } from 'next/cache';
import type { Lang } from '@/lib/types';

/* ============================================================
   GitHubLangRanking — editorial language breakdown.
   Counts repos by language (excluding forks), shows top 5 with
   proportional hairline bar + percentage. Pure typography.
   ============================================================ */

interface RawRepo {
  language: string | null;
  fork: boolean;
}

interface LangRow {
  name: string;
  count: number;
  percent: number;
}

async function fetchLangs(username: string): Promise<LangRow[]> {
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      { headers },
    );
    if (!res.ok) return [];

    const repos = (await res.json()) as RawRepo[];
    const ownRepos = repos.filter((r) => !r.fork && r.language);

    const counts = new Map<string, number>();
    for (const repo of ownRepos) {
      const lang = repo.language!;
      counts.set(lang, (counts.get(lang) ?? 0) + 1);
    }

    const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
    if (total === 0) return [];

    return [...counts.entries()]
      .map(([name, count]) => ({
        name,
        count,
        percent: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

interface GitHubLangRankingProps {
  readonly username: string;
  readonly lang?: Lang;
  readonly limit?: number;
}

export async function GitHubLangRanking({
  username,
  lang = 'en',
  limit = 5,
}: GitHubLangRankingProps) {
  'use cache';
  cacheLife('hours');
  cacheTag('github-lang-ranking');

  const all = await fetchLangs(username);
  if (all.length === 0) return null;

  const top = all.slice(0, limit);
  const restCount = all.slice(limit).reduce((sum, r) => sum + r.count, 0);
  const restPercent = all.slice(limit).reduce((sum, r) => sum + r.percent, 0);

  const rows: LangRow[] =
    restCount > 0
      ? [
          ...top,
          {
            name: lang === 'en' ? 'OTHER' : 'OTROS',
            count: restCount,
            percent: restPercent,
          },
        ]
      : top;

  // Max percent for relative bar widths (so the top lang fills the row).
  const max = rows[0]?.percent ?? 100;

  return (
    <ol className="list-none p-0 m-0 space-y-3">
      {rows.map((row, index) => {
        const num = String(index + 1).padStart(2, '0');
        const widthPct = (row.percent / max) * 100;
        return (
          <li
            key={row.name}
            className="grid grid-cols-[2.5rem_minmax(8rem,12rem)_1fr_4rem] items-center gap-4"
          >
            <span className="label-mono-muted">{num}</span>
            <span className="label-mono text-[#0a0a0a] truncate">
              {row.name.toUpperCase()}
            </span>
            <span
              aria-hidden="true"
              className="block h-px bg-[#e4e4e7] relative overflow-hidden"
            >
              <span
                className="absolute inset-y-0 left-0 block bg-[#0a0a0a]"
                style={{ width: `${widthPct}%`, height: '2px', top: '-0.5px' }}
              />
            </span>
            <span className="label-mono text-right text-[#0a0a0a]">
              {row.percent.toFixed(1)}%
            </span>
          </li>
        );
      })}
    </ol>
  );
}
