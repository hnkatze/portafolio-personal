import type { Lang, PersonalInfo } from '@/lib/types';
import { Reveal } from '@/components/animations';

/* ============================================================
   Editorial Footer — Swiss editorial-minimal closer.
   Black surface (#0a0a0a) for dramatic remate after 8 white sections.
   Massive name typography, mono metadata, hairline dividers in white/10.
   Server component.
   ============================================================ */

interface EditorialFooterProps {
  readonly data: PersonalInfo;
  readonly lang: Lang;
}

export function EditorialFooter({ data, lang }: EditorialFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative bg-[#0a0a0a] text-white"
      aria-labelledby="footer-heading"
    >
      {/* Top metadata band */}
      <div
        className="grid grid-cols-3 items-center border-t border-b border-white/10 py-3"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <span className="label-mono text-white">09</span>
        <span
          className="label-mono-muted text-white/60 text-center"
          data-i18n-en="COLOPHON"
          data-i18n-es="COLOFÓN"
        >
          {lang === 'en' ? 'COLOPHON' : 'COLOFÓN'}
        </span>
        <span
          className="label-mono-muted text-white/60 text-right"
          data-i18n-en="END OF FILE"
          data-i18n-es="FIN DEL ARCHIVO"
        >
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
        className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-16 border-b border-white/10"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <div>
          <span
            className="label-mono-muted text-white/50 block mb-3"
            data-i18n-en="BASED IN"
            data-i18n-es="UBICACIÓN"
          >
            {lang === 'en' ? 'BASED IN' : 'UBICACIÓN'}
          </span>
          <p
            className="text-base text-white/90"
            data-i18n-en="San Pedro Sula, Honduras"
            data-i18n-es="San Pedro Sula, Honduras"
          >
            San Pedro Sula, Honduras
          </p>
          <p
            className="text-base text-white/60 mt-1"
            data-i18n-en="Working remote · Worldwide"
            data-i18n-es="Trabajo remoto · A nivel mundial"
          >
            {lang === 'en'
              ? 'Working remote · Worldwide'
              : 'Trabajo remoto · A nivel mundial'}
          </p>
        </div>

        <div>
          <span
            className="label-mono-muted text-white/50 block mb-3"
            data-i18n-en="DIRECT"
            data-i18n-es="DIRECTO"
          >
            {lang === 'en' ? 'DIRECT' : 'DIRECTO'}
          </span>
          <a
            href={`mailto:${data.email}`}
            className="text-base text-white/90 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            {data.email} <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div>
          <span
            className="label-mono-muted text-white/50 block mb-3"
            data-i18n-en="ELSEWHERE"
            data-i18n-es="EN OTROS LADOS"
          >
            {lang === 'en' ? 'ELSEWHERE' : 'EN OTROS LADOS'}
          </span>
          <ul className="flex flex-col gap-2 list-none p-0 m-0">
            <li>
              <a
                href={`https://github.com/${data.socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-white/90 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-white/90 hover:text-white transition-colors inline-flex items-center gap-2"
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
            className="block h-2 w-2 rounded-full bg-[#22c55e] animate-pulse"
          />
          <span
            className="label-mono-muted text-white/60"
            data-i18n-en="AVAILABLE FOR WORK"
            data-i18n-es="DISPONIBLE PARA PROYECTOS"
          >
            {lang === 'en'
              ? 'AVAILABLE FOR WORK'
              : 'DISPONIBLE PARA PROYECTOS'}
          </span>
        </div>

        <span className="label-mono-muted text-white/40">
          © {year} CAMILO HENRIQUEZ — EST. 2020
        </span>

        <span
          className="label-mono-muted text-white/40"
          data-i18n-en="BUILT WITH NEXT.JS 16 · MOTION"
          data-i18n-es="HECHO CON NEXT.JS 16 · MOTION"
        >
          {lang === 'en'
            ? 'BUILT WITH NEXT.JS 16 · MOTION'
            : 'HECHO CON NEXT.JS 16 · MOTION'}
        </span>
      </div>
    </footer>
  );
}
