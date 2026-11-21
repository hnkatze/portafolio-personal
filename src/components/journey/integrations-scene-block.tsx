import type { ReactNode } from 'react';
import type { Lang } from '@/lib/types';
import type { IconComponent } from '@/components/icons/tech-icons';

/* ================================================================
   IntegrationsSceneBlock — Server Component
   Dossier panel for one live-data integration (GitHub stats, lang
   ranking, contributions, repos, LinkedIn). Static hairline-bordered
   card, consistent with the Skills quadrants / Certifications
   sectors — no pinned-scroll scrollytelling (that cinematic
   mechanism was dropped here, same decision as T-03/T-06/T-06b).
   ================================================================ */

interface IntegrationsSceneBlockProps {
  readonly index: string;
  readonly labelEn: string;
  readonly labelEs: string;
  readonly lang: Lang;
  readonly children: ReactNode;
  readonly icon?: IconComponent;
  /** Extra content at the right end of the header row — e.g. the
   *  "ALL REPOS ↗" link on the repos panel. */
  readonly trailing?: ReactNode;
}

export function IntegrationsSceneBlock({
  index,
  labelEn,
  labelEs,
  lang,
  children,
  icon: Icon,
  trailing,
}: IntegrationsSceneBlockProps) {
  return (
    <article className="border border-border-hairline bg-canvas-base p-lg lg:p-xl">
      <div className="mb-lg flex items-center justify-between gap-sm border-b border-border-hairline pb-md">
        <div className="flex items-center gap-sm">
          <span className="text-label-index text-text-muted">{index}</span>
          {Icon ? <Icon className="h-4 w-4 shrink-0 text-text-secondary" /> : null}
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en={labelEn}
            data-i18n-es={labelEs}
          >
            {lang === 'en' ? labelEn : labelEs}
          </span>
        </div>
        {trailing}
      </div>
      {children}
    </article>
  );
}
