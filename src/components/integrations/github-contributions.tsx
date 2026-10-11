import { cacheLife, cacheTag } from 'next/cache';

interface GitHubContributionsProps {
  readonly username: string;
}

/**
 * Editorial-themed contribution heatmap.
 * Uses ghchart.rshah.org with the vermilion accent hex (no '#') for the
 * activity squares. The service always renders on a solid white canvas
 * (no transparent/dark variant available), so the wrapper is a
 * deliberate light panel — an inset "paper" surface for this one
 * external widget — rather than letting white float unstyled against
 * the dark canvas.
 */
export async function GitHubContributions({ username }: GitHubContributionsProps) {
  'use cache';
  cacheLife('hours');
  cacheTag('github-contrib');

  return (
    <div className="border border-border-hairline bg-white p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://ghchart.rshah.org/e63926/${username}`}
        alt={`${username} contribution graph`}
        loading="lazy"
        className="w-full h-auto"
      />
    </div>
  );
}
