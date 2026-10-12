import type { Lang } from '@/lib/types';
import { LinkedInIcon } from '@/components/icons/tech-icons';

interface LinkedInBadgeProps {
  readonly profileUrl: string;
  readonly lang?: Lang;
}

/**
 * Swiss-editorial LinkedIn link. Pure typography, hairline underline.
 * Replaces the previous blue brand-color badge to align with the
 * editorial palette of the rest of the page.
 */
export function LinkedInBadge({ profileUrl, lang = 'en' }: LinkedInBadgeProps) {
  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="label-mono inline-flex items-center gap-2 text-text-primary hover:opacity-70 transition-opacity border-b border-text-primary pb-1 self-start"
      aria-label={
        lang === 'en' ? 'View LinkedIn Profile' : 'Ver perfil de LinkedIn'
      }
    >
      <LinkedInIcon className="h-4 w-4 shrink-0" />
      <span data-i18n-en="VIEW LINKEDIN PROFILE" data-i18n-es="VER PERFIL DE LINKEDIN">
        {lang === 'en' ? 'VIEW LINKEDIN PROFILE' : 'VER PERFIL DE LINKEDIN'}
      </span>{' '}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
