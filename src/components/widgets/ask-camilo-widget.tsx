'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/* ============================================================
   Types
   ============================================================ */
interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

/* ============================================================
   i18n helpers
   Reads lang cookie client-side — same contract as I18nProvider.
   ============================================================ */
function getLang(): 'en' | 'es' {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;)\s*lang=([^;]+)/);
  return match?.[1] === 'es' ? 'es' : 'en';
}

const welcomeMessages = {
  en: "Hey! I'm Camilo's AI assistant. Ask me about my skills, projects, experience, or availability — I answer in first person as him.",
  es: '¡Hola! Soy el asistente IA de Camilo. Preguntame sobre mis skills, proyectos, experiencia o disponibilidad — te respondo en primera persona como él.',
} as const;

const errorMessages = {
  en: 'Sorry, something went wrong. Try again or email contact@camilohenriquez.com',
  es: 'Algo salió mal. Probá de nuevo o escribime a contact@camilohenriquez.com',
} as const;

/* ============================================================
   Panel animation variants
   ============================================================ */
const panelVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.98,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

const messageVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
} as const;

/* ============================================================
   TypingIndicator
   ============================================================ */
function TypingIndicator({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex justify-start">
      <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.08] flex gap-1.5 items-center">
        {(['-0.3s', '-0.15s', '0s'] as const).map((delay, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full bg-gray-400 ${reduced ? '' : 'animate-bounce'}`}
            style={reduced ? {} : { animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MessageBubble
   ============================================================ */
function MessageBubble({
  message,
  reduced,
}: {
  message: Message;
  reduced: boolean;
}) {
  const isUser = message.role === 'user';
  const bubble = (
    <div
      className={
        isUser
          ? 'max-w-[85%] px-3.5 py-2 rounded-2xl rounded-br-md bg-blue-500/20 border border-blue-400/30 text-white text-sm leading-relaxed whitespace-pre-wrap'
          : 'max-w-[85%] px-3.5 py-2 rounded-2xl rounded-bl-md bg-white/[0.04] border border-white/[0.08] text-gray-100 text-sm leading-relaxed whitespace-pre-wrap'
      }
    >
      {message.text}
    </div>
  );

  if (reduced) {
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        {bubble}
      </div>
    );
  }

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      {bubble}
    </motion.div>
  );
}

/* ============================================================
   AskCamiloWidget
   ============================================================ */
export function AskCamiloWidget() {
  const webhook = process.env.NEXT_PUBLIC_ASK_CAMILO_WEBHOOK;

  // If no webhook configured, render nothing
  if (!webhook) return null;

  return <AskCamiloWidgetInner webhook={webhook} />;
}

function AskCamiloWidgetInner({ webhook }: { webhook: string }) {
  const reduced = useReducedMotion() ?? false;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const welcomeShown = useRef(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  /* ----------------------------------------------------------
     Auto-scroll on new messages / typing
     ---------------------------------------------------------- */
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  /* ----------------------------------------------------------
     Escape key listener
     ---------------------------------------------------------- */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  /* ----------------------------------------------------------
     Focus input when panel opens
     ---------------------------------------------------------- */
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /* ----------------------------------------------------------
     Open panel — also injects welcome message on first open
     ---------------------------------------------------------- */
  function openPanel() {
    if (!welcomeShown.current) {
      welcomeShown.current = true;
      const lang = getLang();
      setMessages([{ id: crypto.randomUUID(), role: 'bot', text: welcomeMessages[lang] }]);
    }
    setIsOpen(true);
  }

  /* ----------------------------------------------------------
     Send question
     ---------------------------------------------------------- */
  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: trimmed },
    ]);
    setInput('');
    setIsSending(true);
    setIsTyping(true);

    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as Record<string, unknown>;
      const answer =
        (typeof data.answer === 'string' ? data.answer : null) ??
        (typeof data.reply === 'string' ? data.reply : null) ??
        errorMessages[getLang()];
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'bot', text: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'bot', text: errorMessages[getLang()] },
      ]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  }

  /* ----------------------------------------------------------
     Handlers
     ---------------------------------------------------------- */
  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendQuestion(input);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isSending) void sendQuestion(input);
    }
  }

  function handleSuggestionClick(en: string, es: string) {
    const lang = getLang();
    const text = lang === 'es' ? es : en;
    void sendQuestion(text);
  }

  const suggestions = [
    { en: "What's your stack?", es: '¿Qué stack manejás?' },
    { en: 'Best project?', es: '¿Mejor proyecto?' },
    { en: 'Are you available?', es: '¿Estás disponible?' },
  ] as const;

  const showSuggestions = messages.filter((m) => m.role === 'user').length === 0;

  /* ----------------------------------------------------------
     Trigger button
     ---------------------------------------------------------- */
  const triggerButton = (
    <button
      ref={triggerRef}
      onClick={openPanel}
      className="group flex items-center gap-2 px-5 py-3 rounded-full bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 text-blue-400 font-medium shadow-lg shadow-blue-500/20 hover:bg-blue-500/30 transition-all duration-300"
      aria-label="Open chat with Camilo"
    >
      {/* Chat icon */}
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>

      <span
        className="hidden sm:inline"
        data-i18n-en="Ask Camilo"
        data-i18n-es="Preguntale a Camilo"
      >
        Ask Camilo
      </span>

      {/* Emerald ping */}
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
    </button>
  );

  /* ----------------------------------------------------------
     JSX
     ---------------------------------------------------------- */
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger — hide when panel open */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.95 }}
            animate={reduced ? {} : { opacity: 1, scale: 1 }}
            exit={reduced ? {} : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            whileHover={reduced ? {} : { scale: 1.03 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
          >
            {triggerButton}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            variants={reduced ? undefined : panelVariants}
            initial={reduced ? { opacity: 1 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'visible'}
            exit={reduced ? { opacity: 0 } : 'exit'}
            className="w-[calc(100vw-3rem)] sm:w-[380px] max-h-[min(600px,calc(100vh-3rem))] rounded-2xl bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col"
            role="dialog"
            aria-label="Chat with Camilo"
          >
            {/* ---- Header ---- */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                    C
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0a0a0f]" />
                </div>

                {/* Name + status */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    Camilo Henriquez
                  </span>
                  <span
                    className="text-[11px] text-gray-400"
                    data-i18n-en="Usually replies instantly"
                    data-i18n-es="Responde al instante"
                  >
                    Usually replies instantly
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            {/* ---- Messages ---- */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]"
              style={
                {
                  /* webkit scrollbar via globals.css */
                } as React.CSSProperties
              }
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} reduced={reduced} />
              ))}
              {isTyping && <TypingIndicator reduced={reduced} />}
            </div>

            {/* ---- Suggestions ---- */}
            {showSuggestions && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map(({ en, es }) => (
                  <button
                    key={en}
                    onClick={() => handleSuggestionClick(en, es)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:bg-white/[0.08] hover:border-blue-400/30 transition-colors"
                    data-i18n-en={en}
                    data-i18n-es={es}
                  >
                    {en}
                  </button>
                ))}
              </div>
            )}

            {/* ---- Form ---- */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 border-t border-white/[0.06] bg-white/[0.02]"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  maxLength={500}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-resize
                    e.target.style.height = 'auto';
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-400/50 transition-colors resize-none max-h-24"
                  placeholder="Ask me anything..."
                  data-placeholder-en="Ask me anything..."
                  data-placeholder-es="Preguntame lo que quieras..."
                  aria-label="Your question"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 hover:bg-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-blue-400"
                  aria-label="Send"
                >
                  {/* Paper-plane icon */}
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>

              <p
                className="text-[10px] text-gray-500 mt-2 text-center"
                data-i18n-en="AI assistant trained on Camilo's portfolio"
                data-i18n-es="Asistente IA entrenado con el portafolio de Camilo"
              >
                AI assistant trained on Camilo&apos;s portfolio
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
