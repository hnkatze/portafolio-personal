interface GitHubStatsProps {
  readonly username: string;
  readonly theme?: string;
}

export function GitHubStats({ username, theme = 'tokyonight' }: GitHubStatsProps) {
  const src = `https://github-readme-stats.vercel.app/api?username=${username}&theme=${theme}&show_icons=true&hide_border=true&bg_color=00000000`;

  return (
    <div className="w-full overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${username} GitHub stats`}
        loading="lazy"
        width={495}
        height={195}
        className="max-w-full h-auto"
      />
    </div>
  );
}
