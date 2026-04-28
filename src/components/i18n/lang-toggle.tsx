'use client';

import { useLang } from './i18n-provider';

/**
 * Bilingual toggle button.
 *
 * Matches Astro source JourneyNav.astro lines 20-25 visual style:
 * flex items, gap-1, px-3 py-2, text-sm font-medium, rounded-lg,
 * border border-white/10, hover:border-blue-400/50.
 *
 * Accessible: explicit aria-label announces current language and action.
 */
export function LangToggle() {
  const { lang, setLang } = useLang();
  const next = lang === 'en' ? 'es' : 'en';

  return (
    <button
      type="button"
      aria-label={`Switch language to ${next.toUpperCase()}`}
      onClick={() => setLang(next)}
      className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-white/10 hover:border-blue-400/50 transition-all duration-300"
    >
      <span className="text-blue-400">{lang.toUpperCase()}</span>
      {/* Up/down chevron — decorative, hidden from a11y tree */}
      <svg
        className="w-3 h-3 text-gray-500"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 9l4-4 4 4m0 6l-4 4-4-4"
        />
      </svg>
    </button>
  );
}
