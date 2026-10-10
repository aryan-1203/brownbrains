"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { easeOutExpo, springSnappy } from "@/lib/motion";

/**
 * Floating WhatsApp concierge, bottom right of every page.
 *
 * Closed: a green launcher inside a slowly turning ring of text, with a ripple,
 * an occasional nudge and an unread badge until the visitor first opens it.
 * Teaser: once per session, a chat bubble "types" a short hello.
 * Open: a mini chat. One tap on a topic, or a typed message, opens WhatsApp
 * with that message already written, so the hardest part (the first line) is
 * done for them.
 */

const WA_GREEN = "#25D366";

const topics = [
  { label: "Get a quote for my project", text: "I'd like a quote for a project." },
  { label: "I need a website or app", text: "I need a website or an app built." },
  { label: "Help with marketing & brand", text: "I need help with marketing and brand building." },
  { label: "AI & automation", text: "I'd like to explore AI workflows and automation." },
  { label: "Just want to talk", text: "I'd like to have a quick chat." },
];

const SEEN_KEY = "bb-wa-seen";
const TEASED_KEY = "bb-wa-teased";

function waHref(message: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
    `Hi ${site.name}! ${message}`,
  )}`;
}

/** Office hours in IST, read on the visitor's device. */
function officeStatus() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
  );
  const online = hour >= 9 && hour < 21;
  return {
    online,
    line: online ? "Online · replies in minutes" : "Away · replies by 10am IST",
  };
}

function storage(key: string, write?: boolean) {
  try {
    if (write) sessionStorage.setItem(key, "1");
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="currentColor">
      <path d="M16.04 3C8.9 3 3.1 8.78 3.1 15.9c0 2.28.6 4.5 1.74 6.46L3 29l6.83-1.79a12.93 12.93 0 0 0 6.2 1.58h.01c7.13 0 12.94-5.79 12.94-12.9C28.98 8.78 23.17 3 16.04 3Zm0 23.6h-.01a10.7 10.7 0 0 1-5.46-1.5l-.39-.23-4.05 1.06 1.08-3.95-.26-.4a10.67 10.67 0 0 1-1.64-5.68c0-5.9 4.82-10.71 10.74-10.71 5.92 0 10.73 4.8 10.73 10.71 0 5.9-4.82 10.7-10.74 10.7Zm5.89-8.02c-.32-.16-1.91-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.26-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.11 1.32 3.33.16.21 2.28 3.47 5.52 4.87.77.33 1.37.53 1.84.68.77.24 1.48.21 2.03.13.62-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

/** Circular text that turns around the launcher. */
function Ring() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className="animate-spin-slow pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <path id={id} d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
      </defs>
      {/* textLength pins the phrase to the circle's circumference (2π·40)
          so it closes exactly on itself at any font rendering. */}
      <text className="fill-chalk text-[7.4px] font-bold uppercase">
        <textPath href={`#${id}`} textLength="249" lengthAdjust="spacing">
          Chat on WhatsApp · Reply in minutes ·
        </textPath>
      </text>
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot h-1.5 w-1.5 rounded-full bg-slate"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function Avatar() {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-midnight-2">
      <svg viewBox="0 0 28 24" aria-hidden className="h-5 w-auto">
        <path d="M12 2a10 10 0 0 0 0 20Z" fill="#ffb224" />
        <path d="M16 2a10 10 0 0 1 0 20Z" fill="#2b59ff" />
      </svg>
    </span>
  );
}

export function WhatsAppBot() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [typing, setTyping] = useState(true);
  const [seen, setSeen] = useState(true);
  const [status, setStatus] = useState({ online: true, line: "" });
  const [draft, setDraft] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();

  // Appear once the intro curtain has cleared, then tease once per session:
  // after a few seconds, or as soon as the visitor has scrolled a little.
  useEffect(() => {
    if (!site.contact.whatsapp) return;
    const introDone = document.documentElement.dataset.intro === "seen";
    const showAt = setTimeout(
      () => {
        setSeen(storage(SEEN_KEY));
        setStatus(officeStatus());
        setReady(true);
      },
      introDone ? 400 : 2300,
    );

    if (storage(TEASED_KEY) || storage(SEEN_KEY)) return () => clearTimeout(showAt);

    let fired = false;
    const tease = () => {
      if (fired) return;
      fired = true;
      storage(TEASED_KEY, true);
      setTyping(true);
      setTeaser(true);
      window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) tease();
    };
    const timer = setTimeout(tease, introDone ? 6000 : 8000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(showAt);
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // A beat of "typing" every time a bubble appears (typing is switched on by
  // whatever opened the bubble; this only ends it).
  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), reduced ? 0 : 1100);
    return () => clearTimeout(t);
  }, [typing, reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!site.contact.whatsapp) return null;

  const openChat = () => {
    setTyping(true);
    setOpen(true);
    setTeaser(false);
    setStatus(officeStatus());
    if (!seen) {
      setSeen(true);
      storage(SEEN_KEY, true);
    }
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    const message = draft.trim() || "I'd like to talk about a project.";
    window.open(waHref(message), "_blank", "noopener,noreferrer");
    setDraft("");
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            id={panelId}
            role="dialog"
            aria-label={`Chat with ${site.name} on WhatsApp`}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.18 } }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            onAnimationComplete={() => inputRef.current?.focus({ preventScroll: true })}
            style={{ transformOrigin: "100% 100%" }}
            className="pointer-events-auto w-[min(22.5rem,calc(100vw-2rem))] overflow-hidden rounded-[1.6rem] bg-chalk text-midnight shadow-[0_30px_80px_-24px_rgba(10,23,51,0.55)] ring-1 ring-midnight/10"
          >
            <div className="flex items-center gap-3 bg-midnight px-4 py-3.5 text-chalk">
              <Avatar />
              <div className="min-w-0 flex-1">
                <p className="font-display text-[1.02rem] leading-tight font-bold">{site.name}</p>
                <p className="flex items-center gap-1.5 text-[0.78rem] text-[#c4cde3]">
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-2 rounded-full",
                      status.online ? "animate-pulse-dot bg-mint" : "bg-saffron",
                    )}
                  />
                  {status.line}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                aria-label="Close chat"
                className="flex h-11 w-11 items-center justify-center rounded-full text-chalk/80 transition-colors hover:bg-white/10 hover:text-chalk"
              >
                <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="dot-grid space-y-3 px-4 pt-4 pb-3" data-lenis-prevent>
              <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-paper px-3.5 py-2.5 text-[0.95rem] leading-snug shadow-sm">
                {typing ? (
                  <TypingDots />
                ) : (
                  <motion.p initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
                    Hi there. What are you working on? Pick a topic and we&apos;ll
                    pick it up on WhatsApp.
                  </motion.p>
                )}
              </div>

              {!typing ? (
                <motion.ul
                  className="flex flex-wrap justify-end gap-2"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                >
                  {topics.map((topic) => (
                    <motion.li
                      key={topic.label}
                      variants={{
                        hidden: reduced ? {} : { opacity: 0, y: 10, scale: 0.9 },
                        show: { opacity: 1, y: 0, scale: 1, transition: springSnappy },
                      }}
                    >
                      <a
                        href={waHref(topic.text)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center rounded-full border-[1.5px] border-[#1fa855] bg-paper px-3.5 py-2 text-[0.88rem] font-semibold text-[#0d6b34] transition-[background-color,color,transform] duration-200 hover:bg-[#1fa855] hover:text-white active:scale-95"
                      >
                        {topic.label}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : null}
            </div>

            <form onSubmit={send} className="flex items-center gap-2 border-t border-midnight/10 bg-paper p-2.5">
              <label htmlFor={`${panelId}-msg`} className="sr-only">
                Your message
              </label>
              <input
                ref={inputRef}
                id={`${panelId}-msg`}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Or type your message…"
                autoComplete="off"
                className="min-h-11 min-w-0 flex-1 rounded-full bg-chalk px-4 text-[0.95rem] text-midnight placeholder:text-slate/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1fa855]"
              />
              <button
                type="submit"
                aria-label="Send on WhatsApp"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 active:scale-90"
                style={{ backgroundColor: WA_GREEN }}
              >
                <svg viewBox="0 0 20 20" aria-hidden className="h-[1.1rem] w-[1.1rem] translate-x-px">
                  <path d="M3 10l14-7-5 15-2.5-6.5L3 10Z" fill="currentColor" />
                </svg>
              </button>
            </form>
            <p className="bg-paper px-4 pb-3 text-center text-[0.72rem] text-slate">
              Opens WhatsApp · {site.contact.phones[0]}
            </p>
          </motion.div>
        ) : null}

        {teaser && !open ? (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, x: 24, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            style={{ transformOrigin: "100% 100%" }}
            className="pointer-events-auto relative mr-2 max-w-[17rem]"
          >
            <button
              type="button"
              onClick={openChat}
              className="flex w-full items-start gap-3 rounded-[1.25rem] rounded-br-md bg-paper p-3 pr-10 text-left text-midnight shadow-[0_20px_50px_-20px_rgba(10,23,51,0.5)] ring-1 ring-midnight/10"
            >
              <Avatar />
              <span className="min-w-0">
                <span className="block text-[0.8rem] font-bold">{site.name}</span>
                {typing ? (
                  <TypingDots />
                ) : (
                  <span className="block text-[0.92rem] leading-snug">
                    Got a project in mind? Tell us in one line.
                  </span>
                )}
              </span>
            </button>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setTeaser(false)}
              className="absolute top-1 right-1 flex h-9 w-9 items-center justify-center rounded-full text-slate hover:bg-chalk"
            >
              <svg viewBox="0 0 20 20" aria-hidden className="h-3 w-3">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {ready ? (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="pointer-events-auto relative h-[5.5rem] w-[5.5rem]"
          >
            <span aria-hidden className="absolute inset-0 rounded-full bg-midnight/92 shadow-[0_16px_40px_-14px_rgba(10,23,51,0.6)]" />
            <Ring />
            <button
              ref={launcherRef}
              type="button"
              onClick={() => (open ? setOpen(false) : openChat())}
              aria-expanded={open}
              aria-controls={open ? panelId : undefined}
              aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
              className={cn(
                "absolute inset-[1.15rem] flex items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110 active:scale-95",
                !seen && !open && "animate-nudge",
              )}
              style={{ backgroundColor: WA_GREEN }}
            >
              {!seen && !open ? (
                <span aria-hidden className="animate-ripple absolute inset-0 rounded-full" style={{ backgroundColor: WA_GREEN }} />
              ) : null}
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.svg
                    key="x"
                    viewBox="0 0 20 20"
                    aria-hidden
                    className="relative h-5 w-5"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </motion.svg>
                ) : (
                  <motion.span
                    key="wa"
                    className="relative"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WhatsAppGlyph className="h-7 w-7" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {!seen && !open ? (
              <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, ...springSnappy }}
                className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron px-1 text-[0.7rem] font-bold text-midnight ring-2 ring-midnight"
              >
                1
              </motion.span>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
