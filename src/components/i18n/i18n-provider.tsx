'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Lang } from '@/lib/types';

/* ============================================================
   Context

   The context carries the document language. There is no setter:
   switching languages is navigation to the other crawlable
   document (`/` or `/es`), so the language is never swapped in
   the DOM. See LangToggle.
   ============================================================ */
interface I18nContextValue {
  lang: Lang;
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

/** Persists the visitor's language preference for later visits to `/`. */
export function persistLangCookie(lang: Lang): void {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

/* ============================================================
   Provider

   Initialization strategy (cacheComponents-friendly):
   - Layout is static and passes initialLang="en". SSR and client's
     first render share the same state — no hydration mismatch.
   - On mount (post-hydration), useEffect reads the actual cookie.
     If it differs from initialLang, it updates state + <html lang>.
     `/` is a document whose language is decided by that cookie, so
     this is what makes a returning Spanish visitor get Spanish.

   `syncFromCookie` (default true) keeps that behavior for the
   cookie-driven route. A route group that owns its own document
   language (`/es`) passes false: the route language wins, and instead
   of reading the cookie the provider persists `initialLang` so a later
   visit to `/` opens in the same language. Reading the cookie there
   would flip `/es` back to English after hydration, contradicting the
   Spanish document and its toggle.
   ============================================================ */
interface I18nProviderProps {
  initialLang: Lang;
  syncFromCookie?: boolean;
  children: ReactNode;
}

export function I18nProvider({
  initialLang,
  syncFromCookie = true,
  children,
}: I18nProviderProps) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  // The mount sync below must run exactly once. The ref guard keeps it
  // from re-running when its own cookie write or a prop change would
  // otherwise re-arm it.
  const didMountSync = useRef(false);

  useEffect(() => {
    if (didMountSync.current) return;
    didMountSync.current = true;

    if (!syncFromCookie) {
      // Route language wins: persist it, never read it.
      persistLangCookie(initialLang);
      return;
    }

    const fromCookie = readLangCookie();
    if (fromCookie === initialLang) return;
    setLangState(fromCookie);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = fromCookie;
    }
  }, [syncFromCookie, initialLang]);

  return (
    <I18nContext.Provider value={{ lang }}>{children}</I18nContext.Provider>
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
