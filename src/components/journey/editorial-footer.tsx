import { Suspense } from 'react';
import type { Lang, PersonalInfo } from '@/lib/types';
import { Reveal } from '@/components/animations';
import { CurrentYear } from '@/components/layout/current-year';

/* ============================================================
   Editorial Footer — Swiss editorial-minimal closer.
   Uses the same dark canvas tokens as the rest of the site (no more
   standalone near-black contrast surface — that only made sense back
   when the other sections were still light).
   Massive name typography, mono metadata, hairline dividers.
   Server component.
   ============================================================ */

interface EditorialFooterProps {
  readonly data: PersonalInfo;
  readonly lang: Lang;
}

export function EditorialFooter({ data, lang }: EditorialFooterProps) {

  return (
    <footer
      className="relative bg-canvas-base text-text-primary"
      aria-labelledby="footer-heading"
    >
      {/* Top metadata band */}
      <div
        className="grid grid-cols-3 items-center border-t border-b border-border-hairline py-3"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <span className="text-label-mono text-text-primary">09</span>
        <span className="text-label-mono text-text-secondary text-center" >
          {lang === 'en' ? 'COLOPHON' : 'COLOFÓN'}
        </span>
        <span className="text-label-mono text-text-secondary text-right" >
          {lang === 'en' ? 'END OF FILE' : 'FIN DEL ARCHIVO'}
        </span>
      </div>

      {/* Massive name — full bleed */}
      <div
        className="pt-24 pb-12"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <Reveal direction="up" amount={0.2}>
          <h2
            id="footer-heading"
            className="font-extrabold leading-[0.85] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 14vw, 12rem)' }}
          >
            {data.name}.
          </h2>
        </Reveal>
      </div>

      {/* Three-column metadata grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-16 border-b border-border-hairline"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <div>
          <span className="text-label-mono text-text-muted block mb-3" >
            {lang === 'en' ? 'BASED IN' : 'UBICACIÓN'}
          </span>
          <p className="text-base text-text-primary" >
            San Pedro Sula, Honduras
          </p>
          <p className="text-base text-text-secondary mt-1" >
            {lang === 'en'
              ? 'Working remote · Worldwide'
              : 'Trabajo remoto · A nivel mundial'}
          </p>
        </div>

        <div>
          <span className="text-label-mono text-text-muted block mb-3" >
            {lang === 'en' ? 'DIRECT' : 'DIRECTO'}
          </span>
          <a
            href={`mailto:${data.email}`}
            className="text-base text-text-primary hover:text-accent-vermilion transition-colors inline-flex items-center gap-2"
          >
            {data.email} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div>
          <span className="text-label-mono text-text-muted block mb-3" >
            {lang === 'en' ? 'ELSEWHERE' : 'EN OTROS LADOS'}
          </span>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            <li>
              <a
                href={`https://github.com/${data.socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-text-primary hover:text-accent-vermilion transition-colors inline-flex items-center gap-2"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-text-primary hover:text-accent-vermilion transition-colors inline-flex items-center gap-2"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom row — copyright + status */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-2 w-2 rounded-full bg-status-success animate-pulse"
          />
          <span className="text-label-mono text-text-secondary" >
            {lang === 'en'
              ? 'AVAILABLE FOR WORK'
              : 'DISPONIBLE PARA PROYECTOS'}
          </span>
        </div>

        <span className="text-label-mono text-text-muted">
          ©{' '}
          {/* The year reads the clock, which cacheComponents forbids while
              prerendering a page shell — it streams in instead, exactly like
              the cookie-dependent body on `/`. */}
          <Suspense fallback={null}>
            <CurrentYear />
          </Suspense>{' '}
          CAMILO HENRIQUEZ — EST. 2020
        </span>

        <span className="text-label-mono text-text-muted" >
          {lang === 'en'
            ? 'BUILT WITH NEXT.JS 16 · MOTION'
            : 'HECHO CON NEXT.JS 16 · MOTION'}
        </span>
      </div>
    </footer>
  );
}
