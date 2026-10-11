'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { sendContact, type ContactState } from '@/app/actions/contact';
import { useLang } from '@/components/i18n/i18n-provider';
import { Reveal, I18nSplitWords } from '@/components/animations';
import type { Lang, PersonalInfo } from '@/lib/types';

/* ============================================================
   Contact Section — Swiss Editorial "Contacto" dossier (T-08).
   Client component (useActionState needs it for the real EmailJS
   form submission — kept intact, only reskinned).

   Reference: Stitch screen 38a217aefb7f47eb9fc842bfdc17346c
   ("Contacto — Camilo Henriquez", única versión) for the
   breadcrumb + two-column dossier (direct channels / form)
   structure, adapted to React, not copied as raw HTML. Dropped
   from the mock: a "scope" <select> field (contactSchema in
   actions/contact.ts has no such field — adding it would be
   decorative and non-functional), invented SLA/cipher claims
   ("< 24H SLA", "TLS 1.3 / DETERMINISTIC", "ZERO TELEMETRY
   SPILL" — unverifiable marketing jargon, same criterion T-04..
   T-07 used for invented metrics), and the mock's own header/
   nav/footer (already covered by layout.tsx / EditorialFooter).

   Kept from the mock: the closing Swiss-discipline colophon
   line, adapted as this section's own closing statement.
   ============================================================ */

interface ContactSectionProps {
  readonly data: PersonalInfo;
}

const INITIAL_STATE: ContactState = { status: 'idle' };

const LEAD = {
  en: "Have a project in mind? Let's build something that lasts.",
  es: '¿Tenés un proyecto en mente? Construyamos algo que perdure.',
};

const COLOPHON_EN =
  'This section is built under the discipline of the International Typographic Style (Swiss Style). Constructed with deterministic focus and zero AI clichés.';
const COLOPHON_ES =
  'Diseñado bajo la disciplina del Estilo Tipográfico Internacional (Swiss Style). Construido con enfoque determinista y cero clichés de IA.';

export function ContactSection({ data }: ContactSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const [state, formAction, isPending] = useActionState(
    sendContact,
    INITIAL_STATE,
  );
  const formRef = useRef<HTMLFormElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.status !== 'success') return;
    formRef.current?.reset();
  }, [state.status]);

  const t = translations[lang];

  const handleCvClick = () => {
    if (typeof window === 'undefined') return;
    const pdfPath =
      lang === 'es'
        ? '/cv/Camilo Henriquez — CV Desarrollador Full-Stack.pdf'
        : '/cv/Camilo Henriquez — Full-Stack Engineer CV.pdf';
    window.open(encodeURI(pdfPath), '_blank', 'noopener,noreferrer');
  };

  const handleCopyEmail = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(data.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard permission denied or unavailable — silently ignore,
      // the mailto link below still works as a fallback.
    }
  };

  const buttonLabel = isPending
    ? t.sending
    : state.status === 'success'
      ? t.sent
      : t.send;

  return (
    <section id="contact" className="relative bg-canvas-base">
      {/* Dossier breadcrumb bar — mirrors Skills/Experience/Projects/Certifications "0N /" pattern */}
      <header className="flex flex-wrap items-center justify-between gap-sm border-b border-border-hairline px-[var(--shell-padding-x)] py-xs">
        <div className="flex items-center gap-md">
          <span className="text-label-index font-semibold text-accent-vermilion">
            09 /
          </span>
          <span
            className="text-label-index uppercase tracking-widest text-text-primary"
            data-i18n-en="CONTACT"
            data-i18n-es="CONTACTO"
          >
            {lang === 'en' ? 'CONTACT' : 'CONTACTO'}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <span
            className="inline-block h-1.5 w-1.5 bg-status-success"
            aria-hidden="true"
          />
          <span
            className="text-label-index uppercase tracking-widest text-text-secondary"
            data-i18n-en="OPEN FOR FREELANCE"
            data-i18n-es="ABIERTO A FREELANCE"
          >
            {lang === 'en' ? 'OPEN FOR FREELANCE' : 'ABIERTO A FREELANCE'}
          </span>
        </div>
      </header>

      {/* Headline + lead + CV CTA */}
      <div className="px-[var(--shell-padding-x)] py-[var(--section-padding-y)]">
        <h2 className="text-headline-xl text-text-primary">
          <I18nSplitWords textEn="Contact." textEs="Contacto." />
        </h2>

        <Reveal direction="up" delay={0.15} duration={0.6} className="mt-sm">
          <p
            className="max-w-[42rem] text-body-lead text-text-secondary"
            data-i18n-en={LEAD.en}
            data-i18n-es={LEAD.es}
          >
            {lang === 'en' ? LEAD.en : LEAD.es}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.25} duration={0.6} className="mt-lg">
          <div className="flex flex-wrap items-center gap-x-lg gap-y-sm">
            <button
              type="button"
              onClick={handleCvClick}
              className="text-label-mono inline-flex items-center gap-xs border border-border-hairline px-md py-sm text-text-primary transition-colors hover:border-accent-vermilion hover:text-accent-vermilion"
            >
              <span
                data-i18n-en="DOWNLOAD CV (PDF)"
                data-i18n-es="DESCARGAR CV (PDF)"
              >
                {lang === 'en' ? 'DOWNLOAD CV (PDF)' : 'DESCARGAR CV (PDF)'}
              </span>
              <span aria-hidden="true">↓</span>
            </button>
            <span
              className="text-label-index text-text-muted"
              data-i18n-en="EN · ES VERSIONS AVAILABLE"
              data-i18n-es="VERSIONES EN · ES DISPONIBLES"
            >
              {lang === 'en'
                ? 'EN · ES VERSIONS AVAILABLE'
                : 'VERSIONES EN · ES DISPONIBLES'}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Two-column dossier: direct channels (left) + form (right) */}
      <Reveal direction="up" duration={0.5} amount={0.1}>
        <div className="border-y border-border-hairline bg-canvas-subtle">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* ---- Left: direct channels ---- */}
            <div className="flex flex-col gap-xl border-b border-border-hairline px-[var(--shell-padding-x)] py-2xl lg:col-span-5 lg:border-b-0 lg:border-r">
              {/* Primary channel — email */}
              <div className="flex flex-col gap-sm">
                <span
                  className="text-label-index uppercase tracking-widest text-text-muted"
                  data-i18n-en="PRIMARY CHANNEL // EMAIL"
                  data-i18n-es="CANAL PRINCIPAL // EMAIL"
                >
                  {lang === 'en'
                    ? 'PRIMARY CHANNEL // EMAIL'
                    : 'CANAL PRINCIPAL // EMAIL'}
                </span>
                <a
                  href={`mailto:${data.email}`}
                  className="break-all text-headline-lg text-text-primary transition-colors hover:text-accent-vermilion"
                >
                  {data.email}
                </a>
                <div className="flex flex-wrap items-center gap-sm pt-2xs">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-label-mono inline-flex items-center gap-2xs border border-border-hairline bg-canvas-base px-sm py-2xs text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                  >
                    <span
                      data-i18n-en={copied ? 'COPIED' : 'COPY EMAIL'}
                      data-i18n-es={copied ? 'COPIADO' : 'COPIAR EMAIL'}
                    >
                      {copied
                        ? lang === 'en'
                          ? 'COPIED'
                          : 'COPIADO'
                        : lang === 'en'
                          ? 'COPY EMAIL'
                          : 'COPIAR EMAIL'}
                    </span>
                  </button>
                  <a
                    href={`mailto:${data.email}`}
                    className="text-label-mono inline-flex items-center gap-2xs border border-border-hairline bg-canvas-base px-sm py-2xs text-text-secondary transition-colors hover:border-accent-vermilion hover:text-accent-vermilion"
                  >
                    <span
                      data-i18n-en="OPEN MAIL CLIENT"
                      data-i18n-es="ABRIR CLIENTE"
                    >
                      {lang === 'en' ? 'OPEN MAIL CLIENT' : 'ABRIR CLIENTE'}
                    </span>
                  </a>
                </div>
              </div>

              {/* Direct records — GitHub / LinkedIn / Location */}
              <div className="flex flex-col border-t border-border-hairline">
                <span
                  className="pt-lg text-label-index uppercase tracking-widest text-text-muted"
                  data-i18n-en="DIRECT RECORDS // REPOS & NETWORK"
                  data-i18n-es="REGISTROS DIRECTOS // REPOS Y RED"
                >
                  {lang === 'en'
                    ? 'DIRECT RECORDS // REPOS & NETWORK'
                    : 'REGISTROS DIRECTOS // REPOS Y RED'}
                </span>
                <div className="flex flex-col divide-y divide-border-hairline">
                  <ContactRow
                    lang={lang}
                    labelEn="VERSION CONTROL"
                    labelEs="CONTROL DE VERSIONES"
                    href={`https://github.com/${data.socials.github}`}
                    value={`github.com/${data.socials.github}`}
                    external
                  />
                  <ContactRow
                    lang={lang}
                    labelEn="PROFESSIONAL GRAPH"
                    labelEs="RED PROFESIONAL"
                    href={data.socials.linkedin}
                    value={cleanUrl(data.socials.linkedin)}
                    external
                  />
                  <ContactRow
                    lang={lang}
                    labelEn="LOCATION"
                    labelEs="UBICACIÓN"
                    valueEn="San Pedro Sula, Honduras / Remote"
                    valueEs="San Pedro Sula, Honduras / Remoto"
                  />
                </div>
              </div>

              {/* Availability footnote */}
              <div className="mt-auto flex items-center gap-xs border-t border-border-hairline pt-lg text-label-mono text-text-muted">
                <span
                  className="inline-block h-1.5 w-1.5 bg-accent-vermilion"
                  aria-hidden="true"
                />
                <span
                  data-i18n-en="OPEN TO REMOTE ROLES & FREELANCE ARCHITECTURE WORK"
                  data-i18n-es="ABIERTO A ROLES REMOTOS Y TRABAJO DE ARQUITECTURA FREELANCE"
                >
                  {lang === 'en'
                    ? 'OPEN TO REMOTE ROLES & FREELANCE ARCHITECTURE WORK'
                    : 'ABIERTO A ROLES REMOTOS Y TRABAJO DE ARQUITECTURA FREELANCE'}
                </span>
              </div>
            </div>

            {/* ---- Right: form ---- */}
            <div className="flex flex-col gap-lg px-[var(--shell-padding-x)] py-2xl lg:col-span-7">
              <div className="flex items-center justify-between border-b border-border-hairline pb-xs">
                <span
                  className="text-label-index uppercase tracking-widest text-text-muted"
                  data-i18n-en="DIRECT MESSAGE FORM"
                  data-i18n-es="FORMULARIO DE MENSAJE DIRECTO"
                >
                  {lang === 'en'
                    ? 'DIRECT MESSAGE FORM'
                    : 'FORMULARIO DE MENSAJE DIRECTO'}
                </span>
                <span className="text-label-mono text-accent-vermilion">
                  DIRECT_CHANNEL.V1
                </span>
              </div>

              <form
                ref={formRef}
                action={formAction}
                className="flex flex-col gap-lg"
                noValidate
              >
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
                />

                <FormField
                  lang={lang}
                  index="01"
                  id="name"
                  name="name"
                  type="text"
                  required
                  labelEn="Full name"
                  labelEs="Nombre completo"
                  placeholderEn="Your name"
                  placeholderEs="Tu nombre"
                  metaTag="STRING"
                  errors={getFieldErrors(state, 'name')}
                />
                <FormField
                  lang={lang}
                  index="02"
                  id="email"
                  name="email"
                  type="email"
                  required
                  labelEn="Email"
                  labelEs="Email"
                  placeholderEn="your@email.com"
                  placeholderEs="tu@email.com"
                  metaTag="RFC_5322"
                  errors={getFieldErrors(state, 'email')}
                />
                <FormField
                  lang={lang}
                  index="03"
                  id="title"
                  name="title"
                  type="text"
                  required
                  labelEn="Subject"
                  labelEs="Asunto"
                  placeholderEn="Project inquiry, collaboration, etc."
                  placeholderEs="Consulta de proyecto, colaboración, etc."
                  metaTag="CLASSIFICATION"
                  errors={getFieldErrors(state, 'title')}
                />
                <FormField
                  lang={lang}
                  index="04"
                  id="message"
                  name="message"
                  type="textarea"
                  required
                  labelEn="Message"
                  labelEs="Mensaje"
                  placeholderEn="Tell me about your project..."
                  placeholderEs="Contame sobre tu proyecto..."
                  metaTag="TEXT_PAYLOAD"
                  errors={getFieldErrors(state, 'message')}
                />

                {/* Submit */}
                <div className="flex flex-col gap-sm pt-xs sm:flex-row sm:items-center sm:justify-between">
                  <motion.button
                    type="submit"
                    disabled={isPending || state.status === 'success'}
                    className="text-label-mono order-2 w-full border border-text-primary bg-text-primary px-xl py-sm text-canvas-base transition-colors hover:bg-accent-vermilion hover:border-accent-vermilion disabled:cursor-not-allowed disabled:opacity-60 sm:order-1 sm:w-auto"
                    animate={
                      state.status === 'success' && !shouldReduceMotion
                        ? { scale: [1, 1.02, 1] }
                        : undefined
                    }
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={buttonLabel}
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 4 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          shouldReduceMotion ? undefined : { opacity: 0, y: -4 }
                        }
                        transition={{ duration: 0.18 }}
                        className="inline-flex items-center justify-center gap-xs"
                      >
                        {buttonLabel}
                        <span aria-hidden="true">↗</span>
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Status feedback */}
                {state.status === 'success' && (
                  <p
                    role="status"
                    className="text-label-mono text-status-success"
                    data-i18n-en="MESSAGE SENT — I'LL REPLY SHORTLY"
                    data-i18n-es="MENSAJE ENVIADO — RESPONDERÉ PRONTO"
                  >
                    {lang === 'en'
                      ? "MESSAGE SENT — I'LL REPLY SHORTLY"
                      : 'MENSAJE ENVIADO — RESPONDERÉ PRONTO'}
                  </p>
                )}
                {state.status === 'error' && (
                  <p role="alert" className="text-label-mono text-accent-vermilion">
                    {state.error}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Closing colophon — adapted from the Stitch mock's Swiss-discipline statement */}
      <Reveal direction="up" duration={0.5} amount={0.1}>
        <div className="flex flex-col gap-xs px-[var(--shell-padding-x)] py-2xl">
          <span className="text-label-index uppercase tracking-widest text-accent-vermilion">
            COLOPHON
          </span>
          <p
            className="max-w-[48rem] text-headline-md leading-snug text-text-secondary"
            data-i18n-en={COLOPHON_EN}
            data-i18n-es={COLOPHON_ES}
          >
            {lang === 'en' ? COLOPHON_EN : COLOPHON_ES}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   FormField — numbered editorial input/textarea
   ============================================================ */
interface FormFieldProps {
  readonly lang: Lang;
  readonly index: string;
  readonly id: string;
  readonly name: string;
  readonly type: 'text' | 'email' | 'textarea';
  readonly required?: boolean;
  readonly labelEn: string;
  readonly labelEs: string;
  readonly placeholderEn: string;
  readonly placeholderEs: string;
  readonly metaTag: string;
  readonly errors?: readonly string[];
}

function FormField({
  lang,
  index,
  id,
  name,
  type,
  required,
  labelEn,
  labelEs,
  placeholderEn,
  placeholderEs,
  metaTag,
  errors,
}: FormFieldProps) {
  const baseInput =
    'w-full border border-border-hairline bg-canvas-base px-md py-sm text-body-md text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none transition-colors';
  const placeholder = lang === 'en' ? placeholderEn : placeholderEs;

  return (
    <div className="flex flex-col gap-2xs">
      <div className="flex items-center justify-between gap-sm">
        <label
          htmlFor={id}
          className="text-label-mono text-text-secondary"
          data-i18n-en={`${index}. ${labelEn}`}
          data-i18n-es={`${index}. ${labelEs}`}
        >
          {`${index}. ${lang === 'en' ? labelEn : labelEs}`}
          {required && <span className="text-accent-vermilion"> *</span>}
        </label>
        <span className="text-label-index text-text-muted">{metaTag}</span>
      </div>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          className={`${baseInput} resize-none`}
          placeholder={placeholder}
          data-placeholder-en={placeholderEn}
          data-placeholder-es={placeholderEs}
          aria-describedby={
            errors && errors.length > 0 ? `${id}-error` : undefined
          }
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          className={baseInput}
          placeholder={placeholder}
          data-placeholder-en={placeholderEn}
          data-placeholder-es={placeholderEs}
          aria-describedby={
            errors && errors.length > 0 ? `${id}-error` : undefined
          }
        />
      )}
      {errors && errors.length > 0 && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-label-mono text-accent-vermilion"
        >
          {errors[0]}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   ContactRow — editorial label + link (or static value)
   ============================================================ */
interface ContactRowProps {
  readonly lang: Lang;
  readonly labelEn: string;
  readonly labelEs: string;
  readonly href?: string;
  readonly value?: string;
  readonly valueEn?: string;
  readonly valueEs?: string;
  readonly external?: boolean;
}

function ContactRow({
  lang,
  labelEn,
  labelEs,
  href,
  value,
  valueEn,
  valueEs,
  external,
}: ContactRowProps) {
  const label = (
    <span
      className="text-label-index uppercase tracking-widest text-text-muted"
      data-i18n-en={labelEn}
      data-i18n-es={labelEs}
    >
      {lang === 'en' ? labelEn : labelEs}
    </span>
  );

  if (!href) {
    return (
      <div className="flex flex-col gap-2xs py-sm">
        {label}
        <span
          className="text-headline-md text-text-primary"
          data-i18n-en={valueEn}
          data-i18n-es={valueEs}
        >
          {lang === 'en' ? valueEn : valueEs}
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center justify-between gap-md py-sm"
    >
      <span className="flex flex-col gap-2xs">
        {label}
        <span className="text-headline-md text-text-primary transition-colors group-hover:text-accent-vermilion">
          {value}
        </span>
      </span>
      {external && (
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-border-hairline text-text-primary transition-colors group-hover:border-accent-vermilion group-hover:text-accent-vermilion"
        >
          ↗
        </span>
      )}
    </a>
  );
}

/* ============================================================
   Helpers
   ============================================================ */
function getFieldErrors(
  state: ContactState,
  field: 'name' | 'title' | 'email' | 'message',
): readonly string[] | undefined {
  if (state.status !== 'error') return undefined;
  return state.fieldErrors?.[field];
}

function cleanUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

const translations = {
  en: {
    send: 'SEND MESSAGE',
    sending: 'SENDING...',
    sent: 'SENT',
  },
  es: {
    send: 'ENVIAR MENSAJE',
    sending: 'ENVIANDO...',
    sent: 'ENVIADO',
  },
} as const;
