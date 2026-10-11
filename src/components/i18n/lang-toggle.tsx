'use client';

import { useLang } from './i18n-provider';
import type { Lang } from '@/lib/types';

/**
 * Editorial bilingual toggle. Mono uppercase, hairline underline on active.
 * Renders as a single `EN · ES` pair so it reads as typography, not as a switch.
 */
export function LangToggle({ className }: { readonly className?: string }) {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center gap-2 ${className ?? ''}`}
    >
      <LangButton current={lang} value="en" onSelect={setLang}>
        EN
      </LangButton>
      <span aria-hidden="true" className="text-label-mono text-text-muted">
        ·
      </span>
      <LangButton current={lang} value="es" onSelect={setLang}>
        ES
      </LangButton>
    </div>
  );
}

interface LangButtonProps {
  readonly current: Lang;
  readonly value: Lang;
  readonly onSelect: (next: Lang) => void;
  readonly children: string;
}

function LangButton({ current, value, onSelect, children }: LangButtonProps) {
  const isActive = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={isActive}
      className={`text-label-mono pb-0.5 transition-colors ${
        isActive
          ? 'text-text-primary border-b border-text-primary'
          : 'text-text-muted border-b border-transparent hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}
