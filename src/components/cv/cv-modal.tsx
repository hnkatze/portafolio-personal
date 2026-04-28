'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Lang } from '@/lib/types';

export interface CvModalProps {
  /** Pre-rendered RSC CvTemplate passed from the page as the hidden A4 source. */
  readonly children: React.ReactNode;
  readonly initialLang?: Lang;
  /** Used in the mobile card header */
  readonly ownerName?: string;
  /** Used in the mobile card sub-header (already translated by the server) */
  readonly ownerTitle?: string;
}

export function CvModal({
  children,
  initialLang = 'en',
  ownerName,
  ownerTitle,
}: CvModalProps) {
  const dialogRef  = useRef<HTMLDialogElement>(null);
  const paperRef   = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const [isOpen,  setIsOpen]  = useState(false);
  const [cvLang,  setCvLang]  = useState<Lang>(initialLang);
  const prefersReduced = useReducedMotion();

  // ── Sync preview from hidden A4 paper ──────────────────────────────────────
  const syncPreview = useCallback(() => {
    if (paperRef.current && previewRef.current) {
      previewRef.current.innerHTML = paperRef.current.innerHTML;
    }
  }, []);

  // ── Open / close helpers ───────────────────────────────────────────────────
  const openModal = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    syncPreview();
    dialogRef.current?.showModal();
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, [syncPreview]);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    setIsOpen(false);
    document.body.style.overflow = '';
    triggerRef.current?.focus();
  }, []);

  // ── Listen for the global open-cv-modal CustomEvent ───────────────────────
  useEffect(() => {
    window.addEventListener('open-cv-modal', openModal);
    return () => window.removeEventListener('open-cv-modal', openModal);
  }, [openModal]);

  // ── Sync native dialog 'close' event (Escape key) with React state ─────────
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setIsOpen(false);
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  // ── Backdrop click closes ──────────────────────────────────────────────────
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) closeModal();
  };

  // ── Language toggle — scoped to the dialog DOM only ───────────────────────
  const updateLangInModal = useCallback(
    (lang: Lang) => {
      setCvLang(lang);

      // Swap i18n text in the hidden A4 paper
      const attr = lang === 'en' ? 'data-i18n-en' : 'data-i18n-es';
      paperRef.current?.querySelectorAll(`[${attr}]`).forEach((el) => {
        const value = (el as HTMLElement).getAttribute(attr);
        if (value !== null) el.textContent = value;
      });

      // Re-sync the preview
      syncPreview();

      // Also swap in the preview itself so it reflects immediately
      previewRef.current?.querySelectorAll(`[${attr}]`).forEach((el) => {
        const value = (el as HTMLElement).getAttribute(attr);
        if (value !== null) el.textContent = value;
      });
    },
    [syncPreview],
  );

  // ── Shared pill styles ─────────────────────────────────────────────────────
  const activePill   = 'px-3 py-1.5 text-sm font-medium rounded-md bg-white text-blue-600 shadow-sm transition-all duration-200';
  const inactivePill = 'px-3 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 transition-all duration-200';

  return (
    <>
      {/* ── Hidden A4 source (always in DOM, off-screen) ── */}
      <div
        id="cv-pdf-source"
        className="absolute -left-[9999px] top-0"
        aria-hidden="true"
        ref={paperRef}
      >
        {children}
      </div>

      {/* ── Native <dialog> ── */}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        className="m-auto bg-transparent p-0 max-w-none max-h-none backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="cv-modal-content"
              initial={prefersReduced ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
              animate={prefersReduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* ── Desktop view (md+) ── */}
              <div className="hidden md:flex flex-col items-center gap-4 max-h-[95vh]">
                {/* Controls bar */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                  {/* Language toggle pill */}
                  <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1" role="group" aria-label="CV language">
                    <button
                      onClick={() => updateLangInModal('es')}
                      className={cvLang === 'es' ? activePill : inactivePill}
                      aria-pressed={cvLang === 'es'}
                    >
                      ES
                    </button>
                    <button
                      onClick={() => updateLangInModal('en')}
                      className={cvLang === 'en' ? activePill : inactivePill}
                      aria-pressed={cvLang === 'en'}
                    >
                      EN
                    </button>
                  </div>

                  {/* Download PDF link */}
                  <a
                    href={`/cv-${cvLang}.pdf`}
                    download
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500/20 rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download PDF ({cvLang.toUpperCase()})
                  </a>

                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    aria-label="Close CV"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* A4 preview */}
                <div
                  className="overflow-auto rounded-lg shadow-2xl"
                  style={{ maxHeight: 'calc(95vh - 60px)' }}
                >
                  <div
                    id="cv-preview"
                    ref={previewRef}
                    style={{
                      width: '210mm',
                      height: '297mm',
                      padding: '10mm 12mm',
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '8.5pt',
                      lineHeight: 1.35,
                      backgroundColor: '#ffffff',
                      color: '#111827',
                      overflow: 'hidden',
                      transform: 'scale(0.85)',
                      transformOrigin: 'top center',
                    }}
                  />
                </div>
              </div>

              {/* ── Mobile view (< md) ── */}
              <div className="md:hidden flex items-center justify-center min-h-screen px-4">
                <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full text-center border border-white/10">
                  {ownerName && (
                    <h2 className="text-xl font-bold text-white mb-1">
                      {ownerName}
                    </h2>
                  )}
                  {ownerTitle && (
                    <p className="text-blue-400 text-sm font-medium mb-6">
                      {ownerTitle}
                    </p>
                  )}

                  {/* Language toggle */}
                  <div className="flex justify-center mb-6">
                    <div
                      className="flex items-center gap-1 rounded-lg bg-gray-100 p-1"
                      role="group"
                      aria-label="CV language"
                    >
                      <button
                        onClick={() => updateLangInModal('es')}
                        className={cvLang === 'es' ? activePill : inactivePill}
                        aria-pressed={cvLang === 'es'}
                      >
                        ES
                      </button>
                      <button
                        onClick={() => updateLangInModal('en')}
                        className={cvLang === 'en' ? activePill : inactivePill}
                        aria-pressed={cvLang === 'en'}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  {/* Download link */}
                  <a
                    href={`/cv-${cvLang}.pdf`}
                    download
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 text-blue-400 font-medium rounded-xl border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-200"
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
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download PDF ({cvLang.toUpperCase()})
                  </a>

                  <button
                    onClick={closeModal}
                    className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
