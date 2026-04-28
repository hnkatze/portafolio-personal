import type { BilingualText, Lang } from './types';

/**
 * Select the correct string for the active language.
 * Mirrors the Astro source helper so components can port verbatim.
 */
export function t(text: BilingualText, lang: Lang): string {
  return text[lang];
}
