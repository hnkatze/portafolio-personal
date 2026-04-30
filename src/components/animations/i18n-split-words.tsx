'use client';

import { useLang } from '@/components/i18n/i18n-provider';
import { SplitWords } from './split-words';

export interface I18nSplitWordsProps {
  readonly textEn: string;
  readonly textEs: string;
  readonly delay?: number;
  readonly stagger?: number;
  readonly className?: string;
  readonly amount?: number;
  readonly once?: boolean;
}

export function I18nSplitWords({
  textEn,
  textEs,
  ...rest
}: I18nSplitWordsProps) {
  const { lang } = useLang();
  const text = lang === 'en' ? textEn : textEs;
  return <SplitWords key={lang} text={text} {...rest} />;
}
