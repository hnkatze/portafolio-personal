'use client';

import { useActionState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { sendContact, type ContactState } from '@/app/actions/contact';
import { useLang } from '@/components/i18n/i18n-provider';
import { MagneticButton, ParallaxLayer } from '@/components/animations';
import type { PersonalInfo } from '@/lib/types';

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

  // Reset form after success + burst animation
  useEffect(() => {
    if (state.status !== 'success') return;
    formRef.current?.reset();
    const timer = window.setTimeout(() => {
      // visually nothing to do — button copy reverts naturally once
      // the next user interaction triggers another render; but if
      // the user stays idle, keep the "Sent" state visible for 4s
      // then noop (cannot reset useActionState externally — acceptable).
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [state.status]);

  // Derived dynamic copy
  const t = translations[lang];

  const handleCvClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cv-modal'));
    }
  };

  // Submit-button label depends on lifecycle state
  const buttonLabel = isPending
    ? t.sending
    : state.status === 'success'
      ? t.sent
      : t.send;

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
    >
      <ParallaxLayer
        speed={-0.1}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            data-i18n-en="Get in Touch"
            data-i18n-es="Contacto"
          >
            Get in Touch
          </h2>
          <p
            className="text-gray-400 max-w-xl mx-auto"
            data-i18n-en="Have a project in mind? Let's work together"
            data-i18n-es="¿Tenés un proyecto en mente? Trabajemos juntos"
          >
            Have a project in mind? Let&apos;s work together
          </p>
        </div>

        {/* Form */}
        <motion.form
          ref={formRef}
          action={formAction}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="space-y-5 p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
          noValidate
        >
          {/* Honeypot — invisible to humans, tempting to bots */}
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

          {/* Submit button with success burst */}
          <motion.button
            type="submit"
            disabled={isPending || state.status === 'success'}
            className="relative w-full py-3 rounded-xl bg-blue-500/20 text-blue-400 font-medium border border-blue-400/30 hover:bg-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-300 overflow-hidden"
            whileHover={
              shouldReduceMotion || isPending
                ? undefined
                : { scale: 1.01 }
            }
            whileTap={
              shouldReduceMotion || isPending
                ? undefined
                : { scale: 0.99 }
            }
            animate={
              state.status === 'success' && !shouldReduceMotion
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(96,165,250,0)',
                      '0 0 0 12px rgba(96,165,250,0.15)',
                      '0 0 0 0 rgba(96,165,250,0)',
                    ],
                  }
                : undefined
            }
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={buttonLabel}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center justify-center gap-2"
              >
                {buttonLabel}
                {state.status === 'success' && (
                  <span aria-hidden="true">✓</span>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Generic error message */}
          {state.status === 'error' && (
            <p
              role="alert"
              className="text-sm text-red-400 text-center"
            >
              {state.error}
            </p>
          )}
        </motion.form>

        {/* Social links + CV button */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <MagneticButton asChild className="inline-block">
              <a
                href={`https://github.com/${data.socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/50 transition-all duration-300 inline-flex"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </MagneticButton>

            <MagneticButton asChild className="inline-block">
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/50 transition-all duration-300 inline-flex"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </MagneticButton>

            <MagneticButton asChild className="inline-block">
              <a
                href={`mailto:${data.email}`}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-400/50 transition-all duration-300 inline-flex"
                aria-label="Email"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </a>
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={handleCvClick}
            className="inline-block text-sm text-gray-400 hover:text-blue-400 transition-colors"
            data-i18n-en="View my CV →"
            data-i18n-es="Ver mi CV →"
          >
            View my CV →
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Form field — reusable glass-style input with focus glow + errors
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
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:border-blue-400/50 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.15)]';

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm text-gray-400 mb-1.5"
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
          rows={5}
          className={`${baseInput} resize-none`}
          placeholder={placeholderEn}
          data-placeholder-en={placeholderEn}
          data-placeholder-es={placeholderEs}
          aria-describedby={errors && errors.length > 0 ? `${id}-error` : undefined}
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
          aria-describedby={errors && errors.length > 0 ? `${id}-error` : undefined}
        />
      )}
      {errors && errors.length > 0 && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs text-red-400"
        >
          {errors[0]}
        </p>
      )}
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

const translations = {
  en: {
    send: 'Send Message',
    sending: 'Sending...',
    sent: 'Sent!',
  },
  es: {
    send: 'Enviar Mensaje',
    sending: 'Enviando...',
    sent: '¡Enviado!',
  },
} as const;
