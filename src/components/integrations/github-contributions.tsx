import { cacheLife, cacheTag } from 'next/cache';

interface GitHubContributionsProps {
  readonly username: string;
}

export async function GitHubContributions({ username }: GitHubContributionsProps) {
  'use cache';
  cacheLife('hours');
  cacheTag('github-contrib');

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://ghchart.rshah.org/60a5fa/${username}`}
        alt={`${username} contribution graph`}
        loading="lazy"
        className="w-full h-auto"
      />
    </div>
  );
}
