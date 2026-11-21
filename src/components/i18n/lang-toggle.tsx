'use client';

import Link from 'next/link';
import { persistLangCookie, useLang } from './i18n-provider';
import type { Lang } from '@/lib/types';

/**
 * Editorial bilingual toggle. Mono uppercase, hairline underline on active.
 * Renders as a single `EN · ES` pair so it reads as typography, not as a switch.
 *
 * Each language is a real link to its crawlable document — `/` for English,
 * `/es` for Spanish. There is no in-place text swap: the document language is
 * decided on the server, so switching languages is navigation. The choice is
 * persisted in the `lang` cookie so a later visit to `/` opens in it.
 */
export function LangToggle({ className }: { readonly className?: string }) {
  const { lang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center gap-2 ${className ?? ''}`}
    >
      <LangLink current={lang} value="en">
        EN
      </LangLink>
      <span aria-hidden="true" className="text-label-mono text-text-muted">
        ·
      </span>
      <LangLink current={lang} value="es">
        ES
      </LangLink>
    </div>
  );
}

const LANG_HREF: Record<Lang, string> = { en: '/', es: '/es' };

interface LangLinkProps {
  readonly current: Lang;
  readonly value: Lang;
  readonly children: string;
}

function LangLink({ current, value, children }: LangLinkProps) {
  const isActive = current === value;
  return (
    <Link
      href={LANG_HREF[value]}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => persistLangCookie(value)}
      className={`text-label-mono pb-0.5 transition-colors ${
        isActive
          ? 'text-text-primary border-b border-text-primary'
          : 'text-text-muted border-b border-transparent hover:text-text-primary'
      }`}
    >
      {children}
    </Link>
  );
}
