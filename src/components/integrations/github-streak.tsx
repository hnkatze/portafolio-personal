interface GitHubStreakProps {
  readonly username: string;
  readonly theme?: string;
}

export function GitHubStreak({ username, theme = 'tokyonight' }: GitHubStreakProps) {
  const src = `https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=${theme}&hide_border=true&background=00000000`;

  return (
    <div className="w-full overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${username} GitHub streak stats`}
        loading="lazy"
        width={495}
        height={195}
        className="max-w-full h-auto"
      />
    </div>
  );
}
