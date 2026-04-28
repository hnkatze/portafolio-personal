'use client';

import { useActionState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { sendContact, type ContactState } from '@/app/actions/contact';
import { useLang } from '@/components/i18n/i18n-provider';
import { Reveal } from '@/components/animations';
import type { PersonalInfo } from '@/lib/types';

/* ============================================================
   Contact Section — Swiss editorial-minimal (section 08)
   White surface, hairline header band, massive headline,
   border-bottom-only inputs, near-black solid CTA.
   No gradients, no glow, no glassmorphism.
   ============================================================ */

interface ContactSectionProps {
  readonly data: PersonalInfo;
}

const INITIAL_STATE: ContactState = { status: 'idle' };

export function ContactSection({ data }: ContactSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const [state, formAction, isPending] = useActionState(
    sendContact,
    INITIAL_STATE,
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  // Reset form on success
  useEffect(() => {
    if (state.status !== 'success') return;
    formRef.current?.reset();
  }, [state.status]);

  const t = translations[lang];

  const handleCvClick = () => {
    if (typeof window === 'undefined') return;
    const pdfUrl =
      lang === 'es'
        ? '/cv/Camilo Henriquez — CV Desarrollador Full-Stack.pdf'
        : '/cv/Camilo Henriquez — Full-Stack Engineer CV.pdf';
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const buttonLabel = isPending
    ? t.sending
    : state.status === 'success'
      ? t.sent
      : t.send;

  return (
    <section
      id="contact"
      className="relative bg-white"
      style={{
        paddingTop: 0,
        paddingBottom: 'var(--section-padding-y)',
      }}
    >
      {/* Section number + label row */}
      <div
        className="grid grid-cols-3 items-center border-t border-b border-[#e4e4e7] py-3"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <span className="label-mono">08</span>
        <span
          className="label-mono-muted text-center"
          data-i18n-en="CONTACT"
          data-i18n-es="CONTACTO"
        >
          {lang === 'en' ? 'CONTACT' : 'CONTACTO'}
        </span>
        <span
          className="label-mono-muted text-right"
          data-i18n-en="LET'S BUILD"
          data-i18n-es="CONSTRUYAMOS"
        >
          {lang === 'en' ? "LET'S BUILD" : 'CONSTRUYAMOS'}
        </span>
      </div>

      {/* Massive headline + subheading */}
      <div
        className="mt-16"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        <Reveal direction="up" duration={0.7}>
          <h2
            className="sticky top-[6.5rem] z-10 font-extrabold text-[#0a0a0a] leading-[0.95] tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            data-i18n-en="Contact."
            data-i18n-es="Contacto."
          >
            {lang === 'en' ? 'Contact.' : 'Contacto.'}
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.15} duration={0.6}>
          <p
            className="mt-6 text-lg text-[#1a1a1a] max-w-2xl"
            data-i18n-en="Have a project in mind? Let's build something that lasts."
            data-i18n-es="¿Tenés un proyecto en mente? Construyamos algo que perdure."
          >
            {lang === 'en'
              ? "Have a project in mind? Let's build something that lasts."
              : '¿Tenés un proyecto en mente? Construyamos algo que perdure.'}
          </p>
        </Reveal>
      </div>

      {/* Two-column layout: form (left) + contact info (right) */}
      <div
        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
        style={{
          paddingLeft: 'var(--shell-padding-x)',
          paddingRight: 'var(--shell-padding-x)',
        }}
      >
        {/* ---- Left: Form ---- */}
        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-8"
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
            id="name"
            name="name"
            type="text"
            required
            labelEn="Name"
            labelEs="Nombre"
            placeholderEn="Your name"
            placeholderEs="Tu nombre"
            errors={getFieldErrors(state, 'name')}
          />
          <FormField
            id="email"
            name="email"
            type="email"
            required
            labelEn="Email"
            labelEs="Email"
            placeholderEn="your@email.com"
            placeholderEs="tu@email.com"
            errors={getFieldErrors(state, 'email')}
          />
          <FormField
            id="title"
            name="title"
            type="text"
            required
            labelEn="Subject"
            labelEs="Asunto"
            placeholderEn="Project inquiry, collaboration, etc."
            placeholderEs="Consulta de proyecto, colaboración, etc."
            errors={getFieldErrors(state, 'title')}
          />
          <FormField
            id="message"
            name="message"
            type="textarea"
            required
            labelEn="Message"
            labelEs="Mensaje"
            placeholderEn="Tell me about your project..."
            placeholderEs="Contame sobre tu proyecto..."
            errors={getFieldErrors(state, 'message')}
          />

          {/* Submit button */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={isPending || state.status === 'success'}
              className="w-full sm:w-auto bg-[#0a0a0a] text-white px-8 py-4 hover:bg-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors label-mono"
              style={{ color: '#ffffff' }}
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
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center justify-center gap-2"
                >
                  {buttonLabel}
                  <span aria-hidden="true">↗</span>
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Status feedback */}
            {state.status === 'success' && (
              <p
                role="status"
                className="mt-4 label-mono text-[#15803d]"
                data-i18n-en="MESSAGE SENT — I'LL REPLY SHORTLY"
                data-i18n-es="MENSAJE ENVIADO — RESPONDERÉ PRONTO"
              >
                {lang === 'en'
                  ? "MESSAGE SENT — I'LL REPLY SHORTLY"
                  : 'MENSAJE ENVIADO — RESPONDERÉ PRONTO'}
              </p>
            )}
            {state.status === 'error' && (
              <p
                role="alert"
                className="mt-4 label-mono text-[#dc2626]"
              >
                {state.error}
              </p>
            )}
          </div>

          {/* CV download row */}
          <div className="divider-hairline pt-6 mt-2">
            <button
              type="button"
              onClick={handleCvClick}
              className="label-mono inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
              data-i18n-en="DOWNLOAD CV ↗"
              data-i18n-es="DESCARGAR CV ↗"
            >
              {lang === 'en' ? 'DOWNLOAD CV ↗' : 'DESCARGAR CV ↗'}
            </button>
          </div>
        </form>

        {/* ---- Right: Contact info ---- */}
        <div className="flex flex-col">
          <ContactRow
            labelEn="EMAIL"
            labelEs="EMAIL"
            href={`mailto:${data.email}`}
            value={data.email}
            isFirst
          />
          <ContactRow
            labelEn="GITHUB"
            labelEs="GITHUB"
            href={`https://github.com/${data.socials.github}`}
            value={`github.com/${data.socials.github}`}
            external
          />
          <ContactRow
            labelEn="LINKEDIN"
            labelEs="LINKEDIN"
            href={data.socials.linkedin}
            value={cleanUrl(data.socials.linkedin)}
            external
          />
          <ContactRowStatic
            labelEn="BASED IN"
            labelEs="UBICACIÓN"
            valueEn="San Pedro Sula, Honduras / Remote"
            valueEs="San Pedro Sula, Honduras / Remoto"
          />
        </div>
      </div>

      {/* Bottom hairline divider */}
      <div
        className="divider-hairline mt-24"
        style={{
          marginLeft: 'var(--shell-padding-x)',
          marginRight: 'var(--shell-padding-x)',
        }}
      />
    </section>
  );
}

/* ============================================================
   FormField — editorial border-bottom-only input
   ============================================================ */
interface FormFieldProps {
  readonly id: string;
  readonly name: string;
  readonly type: 'text' | 'email' | 'textarea';
  readonly required?: boolean;
  readonly labelEn: string;
  readonly labelEs: string;
  readonly placeholderEn: string;
  readonly placeholderEs: string;
  readonly errors?: readonly string[];
}

function FormField({
  id,
  name,
  type,
  required,
  labelEn,
  labelEs,
  placeholderEn,
  placeholderEs,
  errors,
}: FormFieldProps) {
  const baseInput =
    'w-full border-b border-[#e4e4e7] bg-transparent py-3 text-base text-[#1a1a1a] placeholder:text-[#a1a1aa] focus:border-[#0a0a0a] focus:outline-none transition-colors';

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="label-mono"
        data-i18n-en={labelEn}
        data-i18n-es={labelEs}
      >
        {labelEn}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          className={`${baseInput} resize-none`}
          placeholder={placeholderEn}
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
          placeholder={placeholderEn}
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
          className="label-mono text-[#dc2626]"
        >
          {errors[0]}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   ContactRow — editorial label + link
   ============================================================ */
interface ContactRowProps {
  readonly labelEn: string;
  readonly labelEs: string;
  readonly href: string;
  readonly value: string;
  readonly external?: boolean;
  readonly isFirst?: boolean;
}

function ContactRow({
  labelEn,
  labelEs,
  href,
  value,
  external,
  isFirst,
}: ContactRowProps) {
  return (
    <div
      className={isFirst ? 'pb-6' : 'divider-hairline pt-6 pb-6'}
    >
      <span
        className="label-mono-muted block mb-2"
        data-i18n-en={labelEn}
        data-i18n-es={labelEs}
      >
        {labelEn}
      </span>
      <a
        href={href}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        className="text-lg text-[#1a1a1a] hover:opacity-70 transition-opacity inline-flex items-center gap-2"
      >
        <span>{value}</span>
        {external && <span aria-hidden="true">↗</span>}
      </a>
    </div>
  );
}

interface ContactRowStaticProps {
  readonly labelEn: string;
  readonly labelEs: string;
  readonly valueEn: string;
  readonly valueEs: string;
}

function ContactRowStatic({
  labelEn,
  labelEs,
  valueEn,
  valueEs,
}: ContactRowStaticProps) {
  return (
    <div className="divider-hairline pt-6 pb-6">
      <span
        className="label-mono-muted block mb-2"
        data-i18n-en={labelEn}
        data-i18n-es={labelEs}
      >
        {labelEn}
      </span>
      <p
        className="text-lg text-[#1a1a1a]"
        data-i18n-en={valueEn}
        data-i18n-es={valueEs}
      >
        {valueEn}
      </p>
    </div>
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
