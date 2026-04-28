import { cacheLife, cacheTag } from 'next/cache';

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
};

async function fetchRepos(username: string): Promise<Repo[]> {
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=6&sort=updated`,
    { headers }
  );
  if (!res.ok) return [];
  return (await res.json()) as Repo[];
}

interface GitHubReposProps {
  readonly username: string;
}

export async function GitHubRepos({ username }: GitHubReposProps) {
  'use cache';
  cacheLife('hours');
  cacheTag('github-repos');

  const repos = await fetchRepos(username);

  if (repos.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-gray-400">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          View repositories on GitHub →
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-blue-400/30 hover:bg-white/[0.05] transition-all duration-300"
        >
          <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {repo.name}
          </h3>
          {repo.description && (
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{repo.description}</p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            {repo.language && <span>{repo.language}</span>}
            <span>★ {repo.stargazers_count}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
