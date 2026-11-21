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
    // Skip elements with child elements — React owns their structure and
    // setting textContent here would destroy spans/icons rendered as children,
    // causing hydration mismatches when child sections hydrate later (e.g.,
    // under Suspense). Only swap on leaf text-only elements.
    if (el.children.length > 0) return;
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

   Initialization strategy (cacheComponents-friendly):
   - Layout is static and passes initialLang="en". SSR and client's
     first render share the same state — no hydration mismatch.
   - On mount (post-hydration), useEffect reads the actual cookie.
     If it differs from initialLang, it updates state + applies the
     DOM swap for [data-i18n-en|es] leaves + updates <html lang>.
   - This causes a brief headline flash for cookie='es' users on
     first paint (server pre-rendered "Experience." via the client
     component using provider lang='en'; effect then swaps to
     "Experiencia."), but it is hydration-safe.

   `syncFromCookie` (default true) keeps that legacy behavior for the
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
    // Initial sync: ONLY update React state + <html lang>. Do NOT call
    // applyLangToDom here — mutating the DOM before all client components
    // finish hydrating causes mismatches (their VDOM still has the
    // server-rendered text but the DOM has already been swapped).
    // Components that depend on lang should use useLang() so they re-render
    // reactively. applyLangToDom only runs on user-triggered setLang.
    setLangState(fromCookie);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = fromCookie;
    }
  }, [syncFromCookie, initialLang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    applyLangToDom(next);
    persistLangCookie(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
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
