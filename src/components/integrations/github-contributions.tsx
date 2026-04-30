import { cacheLife, cacheTag } from 'next/cache';

interface GitHubContributionsProps {
  readonly username: string;
}

/**
 * Editorial-themed contribution heatmap.
 * Uses ghchart.rshah.org with hex `0a0a0a` (near-black) so the chart
 * blends with the Swiss editorial palette instead of the retro blue.
 */
export async function GitHubContributions({ username }: GitHubContributionsProps) {
  'use cache';
  cacheLife('hours');
  cacheTag('github-contrib');

  return (
    <div className="border border-[#e4e4e7] p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://ghchart.rshah.org/0a0a0a/${username}`}
        alt={`${username} contribution graph`}
        loading="lazy"
        className="w-full h-auto"
      />
    </div>
  );
}
