interface GitHubTopLangsProps {
  readonly username: string;
  readonly theme?: string;
}

export function GitHubTopLangs({ username, theme = 'tokyonight' }: GitHubTopLangsProps) {
  const src = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&theme=${theme}&hide_border=true&layout=compact&bg_color=00000000`;

  return (
    <div className="w-full overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${username} top programming languages`}
        loading="lazy"
        width={495}
        height={165}
        className="max-w-full h-auto"
      />
    </div>
  );
}
