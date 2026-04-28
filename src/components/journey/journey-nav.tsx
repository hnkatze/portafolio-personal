'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LangToggle } from '@/components/i18n/lang-toggle';
import { MagneticButton } from '@/components/animations/magnetic-button';

/* ============================================================
   Islands — the 7 scroll-spy targets in page order.
   Labels bilingual via data-i18n-en/es attrs (swapped by I18nProvider).
   ============================================================ */
interface Island {
  readonly id: string;
  readonly label: string;
  readonly labelEs: string;
}

const ISLANDS: readonly Island[] = [
  { id: 'hero', label: 'Home', labelEs: 'Inicio' },
  { id: 'skills', label: 'Skills', labelEs: 'Habilidades' },
  { id: 'experience', label: 'Experience', labelEs: 'Experiencia' },
  { id: 'projects', label: 'Projects', labelEs: 'Proyectos' },
  { id: 'testimonials', label: 'Testimonials', labelEs: 'Testimonios' },
  { id: 'integrations', label: 'GitHub', labelEs: 'GitHub' },
  { id: 'contact', label: 'Contact', labelEs: 'Contacto' },
] as const;

/**
 * JourneyNav — fixed top header + side-dot scroll-spy navigation.
 *
 * Top header (all viewports):
 *   - Logo (CH.) → smooth-scrolls to #hero
 *   - Language toggle (client)
 *   - View CV button → dispatches 'open-cv-modal' CustomEvent
 *     (wrapped in MagneticButton for the over-the-top touch)
 *
 * Side dots (md+ only):
 *   - 7 dots, one per section
 *   - IntersectionObserver with rootMargin -50% 0px -50% 0px → a section is
 *     "active" when its center crosses the viewport center
 *   - Active: blue-400 fill, scale-125, blue glow
 *   - Inactive: hollow border, grows on hover
 *   - Label appears on hover (x-slide + fade)
 *
 * Respects prefers-reduced-motion — entrance skipped, label fade is
 * implemented via CSS group-hover (no motion-dependent fallback needed).
 */
export function JourneyNav() {
  const shouldReduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');

  /* ── Scroll state: backdrop-blur after 50px ──────────────────────── */
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── IntersectionObserver scroll-spy ─────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const elements = ISLANDS
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // rootMargin -50% top/bottom → intersection is true only when the
    // section's center is at viewport center.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleCvClick() {
    window.dispatchEvent(new CustomEvent('open-cv-modal'));
  }

  /* ── Top header ──────────────────────────────────────────────────── */
  const headerClasses = [
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    scrolled
      ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5'
      : 'bg-transparent',
  ].join(' ');

  const headerContent = (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          type="button"
          aria-label="Go to top"
          onClick={() => scrollTo('hero')}
          className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
          data-cursor-grow
        >
          CH<span className="text-blue-400">.</span>
        </button>

        <div className="flex items-center gap-3">
          <LangToggle />

          <MagneticButton
            strength={0.2}
            onClick={handleCvClick}
            className="px-4 py-2 text-sm font-medium text-gray-300 rounded-lg border border-white/10 hover:border-blue-400/50 hover:text-blue-400 transition-all duration-300"
          >
            <span data-i18n-en="View CV" data-i18n-es="Ver CV" aria-label="View CV">
              View CV
            </span>
          </MagneticButton>
        </div>
      </div>
    </header>
  );

  /* ── Side dots (md+) ─────────────────────────────────────────────── */
  const sideDots = (
    <nav
      aria-label="Section navigation"
      className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4"
    >
      {ISLANDS.map(({ id, label, labelEs }) => {
        const isActive = activeId === id;
        const dotClasses = [
          'rounded-full border-2 transition-all duration-300',
          isActive
            ? 'w-3 h-3 bg-blue-400 border-blue-400 scale-125 shadow-[0_0_12px_rgba(96,165,250,0.5)]'
            : 'w-3 h-3 border-white/30 hover:border-blue-400/80 hover:scale-110',
        ].join(' ');

        return (
          <div key={id} className="group relative flex items-center">
            {/* Label (appears on hover OR when active) */}
            <AnimatePresence>
              <motion.span
                key={`${id}-label`}
                className="pointer-events-none absolute right-8 text-xs text-blue-400 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                data-i18n-en={label}
                data-i18n-es={labelEs}
                initial={shouldReduceMotion ? false : { opacity: 0, x: 10 }}
                animate={shouldReduceMotion ? undefined : undefined}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            </AnimatePresence>

            <button
              type="button"
              aria-label={`Navigate to ${label}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => scrollTo(id)}
              className={dotClasses}
              data-cursor-grow
            />
          </div>
        );
      })}
    </nav>
  );

  /* ── Entrance motion (reduced-motion aware) ──────────────────────── */
  if (shouldReduceMotion) {
    return (
      <>
        {headerContent}
        {sideDots}
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      >
        {headerContent}
      </motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
      >
        {sideDots}
      </motion.div>
    </>
  );
}
