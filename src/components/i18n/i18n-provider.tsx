'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Lang } from '@/lib/types';

/* ============================================================
   Context
   ============================================================ */
interface I18nContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/* ============================================================
   Cookie helpers (client-side only)
   ============================================================ */
function readLangCookie(): Lang {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;)\s*lang=([^;]+)/);
  const val = match?.[1];
  return val === 'es' ? 'es' : 'en';
}

function persistLangCookie(lang: Lang): void {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

/* ============================================================
   DOM swap helpers
   Mirrors the Astro JourneyNav.astro applyLang() logic so that
   components using data-i18n-en / data-i18n-es attributes work
   without any React re-render.
   ============================================================ */
function applyLangToDom(lang: Lang): void {
  const textAttr = lang === 'en' ? 'data-i18n-en' : 'data-i18n-es';
  document.querySelectorAll<HTMLElement>(`[${textAttr}]`).forEach((el) => {
    const value = el.getAttribute(textAttr);
    if (value !== null) el.textContent = value;
  });

  const placeholderAttr =
    lang === 'en' ? 'data-placeholder-en' : 'data-placeholder-es';
  document
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      `[${placeholderAttr}]`
    )
    .forEach((el) => {
      const value = el.getAttribute(placeholderAttr);
      if (value !== null) el.placeholder = value;
    });
}

/* ============================================================
   Provider

   Initialization strategy (cacheComponents: true compatible):
   - Layout is static; passes initialLang="en" (SSR default).
   - On mount, reads actual lang cookie from document.cookie.
   - If actual lang differs from SSR default, applies DOM swap immediately.
   - Pages that need SSR lang resolution use connection() + getLang() and
     can pass the resolved lang via a prop bridge in Phase 4+.
   ============================================================ */
interface I18nProviderProps {
  initialLang: Lang;
  children: ReactNode;
}

export function I18nProvider({ initialLang, children }: I18nProviderProps) {
  // Lazy initializer: reads cookie client-side; falls back to initialLang on server
  // (where document is unavailable). This avoids synchronous setState inside useEffect
  // (lint: no set-state-in-effect) while still syncing client state with the real cookie.
  const [lang, setLangState] = useState<Lang>(() => {
    const fromCookie = readLangCookie();
    // readLangCookie() returns 'en' on server (no document) — use initialLang in that case
    // so SSR snapshot is consistent with what the layout requested.
    return fromCookie !== 'en' ? fromCookie : initialLang;
  });

  // Apply DOM swap after mount (need DOM to be available)
  useEffect(() => {
    applyLangToDom(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    applyLangToDom(next);
    persistLangCookie(next);
    window.dispatchEvent(new CustomEvent('lang-change', { detail: next }));
  };

  return (
    <I18nContext.Provider value={{ lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

/* ============================================================
   Hook
   ============================================================ */
export function useLang(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useLang must be used inside <I18nProvider>');
  }
  return ctx;
}
