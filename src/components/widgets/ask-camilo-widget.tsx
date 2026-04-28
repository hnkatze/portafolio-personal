'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/* ============================================================
   AskCamiloWidget — Swiss editorial-minimal floating chat
   Sharp corners, white surface, near-black accents,
   monospace labels. No glow, no gradients, no glassmorphism.
   ============================================================ */

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

/* ============================================================
   i18n helpers — reads lang cookie client-side
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
   Panel animation variants — simple slide-up
   ============================================================ */
const panelVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

/* ============================================================
   TypingIndicator — three small dots
   ============================================================ */
function TypingIndicator({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex justify-start">
      <div className="border-l-2 border-[#0a0a0a] pl-3 py-1 flex gap-1.5 items-center">
        {(['-0.3s', '-0.15s', '0s'] as const).map((delay, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full bg-[#1a1a1a] ${reduced ? '' : 'animate-bounce'}`}
            style={reduced ? {} : { animationDelay: delay }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MessageBubble — user (right, gray) vs bot (left, hairline rule)
   ============================================================ */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-[#f4f4f5] p-3 text-sm leading-relaxed text-[#1a1a1a] whitespace-pre-wrap">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] border-l-2 border-[#0a0a0a] pl-3 text-sm leading-relaxed text-[#1a1a1a] whitespace-pre-wrap">
        {message.text}
      </div>
    </div>
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
  const abortRef = useRef<AbortController | null>(null);

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
     Abort any in-flight request on unmount
     ---------------------------------------------------------- */
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  /* ----------------------------------------------------------
     Open panel — also injects welcome message on first open
     ---------------------------------------------------------- */
  function openPanel() {
    if (!welcomeShown.current) {
      welcomeShown.current = true;
      const lang = getLang();
      setMessages([
        { id: crypto.randomUUID(), role: 'bot', text: welcomeMessages[lang] },
      ]);
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

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as Record<string, unknown>;
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
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: errorMessages[getLang()],
        },
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

  const showSuggestions =
    messages.filter((m) => m.role === 'user').length === 0;

  /* ----------------------------------------------------------
     Trigger button — black square with mono label
     ---------------------------------------------------------- */
  const triggerButton = (
    <button
      ref={triggerRef}
      onClick={openPanel}
      className="bg-[#0a0a0a] text-white px-4 py-3 label-mono inline-flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors"
      style={{ color: '#ffffff' }}
      aria-label="Open chat with Camilo"
    >
      <span data-i18n-en="ASK CAMILO" data-i18n-es="PREGUNTÁ A CAMILO">
        ASK CAMILO
      </span>
      <span aria-hidden="true">↗</span>
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
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
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
            className="w-[calc(100vw-3rem)] sm:w-[380px] max-h-[min(600px,calc(100vh-3rem))] bg-white border border-[#1a1a1a] flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat with Camilo"
          >
            {/* ---- Header ---- */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-[#e4e4e7] bg-white">
              <span
                className="label-mono"
                data-i18n-en="ASK CAMILO — AI ASSISTANT"
                data-i18n-es="PREGUNTÁ A CAMILO — ASISTENTE IA"
              >
                ASK CAMILO — AI ASSISTANT
              </span>

              <button
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="label-mono text-[#1a1a1a] hover:opacity-70 transition-opacity px-1"
                aria-label="Close chat"
              >
                ×
              </button>
            </header>

            {/* ---- Messages ---- */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth bg-white"
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator reduced={reduced} />}
            </div>

            {/* ---- Suggestions ---- */}
            {showSuggestions && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 border-t border-[#e4e4e7] pt-3">
                {suggestions.map(({ en, es }) => (
                  <button
                    key={en}
                    onClick={() => handleSuggestionClick(en, es)}
                    className="label-mono border border-[#e4e4e7] px-3 py-1.5 text-[#1a1a1a] hover:border-[#0a0a0a] hover:bg-[#f4f4f5] transition-colors"
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
              className="border-t border-[#e4e4e7] bg-white flex items-stretch"
            >
              <textarea
                ref={inputRef}
                rows={1}
                maxLength={500}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 96) + 'px';
                }}
                onKeyDown={handleInputKeyDown}
                className="flex-1 border-0 outline-none px-3 py-3 text-sm text-[#1a1a1a] placeholder:text-[#a1a1aa] bg-white resize-none max-h-24"
                placeholder="Ask me anything..."
                data-placeholder-en="Ask me anything..."
                data-placeholder-es="Preguntame lo que quieras..."
                aria-label="Your question"
              />
              <button
                type="submit"
                disabled={!input.trim() || isSending}
                className="bg-[#0a0a0a] text-white px-4 label-mono hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ color: '#ffffff' }}
                aria-label="Send"
              >
                <span aria-hidden="true">↗</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
