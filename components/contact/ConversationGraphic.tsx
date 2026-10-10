"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { easeOutExpo, springSnappy } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * A short, looping chat: you write in (saffron), we reply (cobalt), and the two
 * halves of the mark close into one. Purely illustrative, hidden from AT.
 */
const script = [
  { from: "you", text: "We need a new site and a launch plan." },
  { from: "us", text: "Both, one team. Free tomorrow at 11?" },
  { from: "you", text: "Perfect. See you then." },
] as const;

// Frame 0: empty. 1: first bubble. 2: typing. 3: reply. 4: last bubble + halves meet.
const FRAMES = 5;
const FRAME_MS = 1700;

function Halves({ met }: { met: boolean }) {
  return (
    <svg viewBox="0 0 64 48" className="h-10 w-auto overflow-visible">
      <motion.path
        d="M30 4a20 20 0 0 0 0 40Z"
        fill="#ffb224"
        initial={false}
        animate={{ x: met ? 1 : -7 }}
        transition={springSnappy}
      />
      <motion.path
        d="M34 4a20 20 0 0 1 0 40Z"
        fill="#2b59ff"
        initial={false}
        animate={{ x: met ? -1 : 7 }}
        transition={springSnappy}
      />
    </svg>
  );
}

function Bubble({ from, text }: { from: "you" | "us"; text: string }) {
  const mine = from === "you";
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className={cn(
        "max-w-[82%] rounded-[1.4rem] px-4 py-3 text-[0.95rem] leading-snug font-medium",
        mine
          ? "origin-bottom-right self-end rounded-br-md bg-saffron text-midnight"
          : "origin-bottom-left self-start rounded-bl-md bg-cobalt text-white",
      )}
    >
      {text}
    </motion.div>
  );
}

function Typing() {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      className="flex origin-left gap-1.5 self-start rounded-full bg-midnight-3 px-4 py-3.5"
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="animate-pulse-dot h-2 w-2 rounded-full bg-sky"
          style={{ animationDelay: `${dot * 0.18}s` }}
        />
      ))}
    </motion.div>
  );
}

export function ConversationGraphic({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setFrame((current) => (current + 1) % (FRAMES + 1)),
      FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  // Reduced motion shows the finished conversation, nothing moves.
  const shown = reduced ? FRAMES - 1 : frame;

  return (
    <div
      aria-hidden
      className={cn(
        "relative rounded-card border border-rule bg-surface/70 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm md:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-rule pb-4">
        <div className="flex items-center gap-3">
          <Halves met={shown >= 4} />
          <div>
            <p className="font-display text-[1rem] leading-none font-bold">
              Brown Brains
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
              <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-mint" />
              Usually replies within a day
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-[15.5rem] flex-col justify-end gap-3 pt-5">
        <AnimatePresence mode="popLayout">
          {shown >= 1 ? <Bubble key="b1" {...script[0]} /> : null}
          {shown === 2 ? <Typing key="typing" /> : null}
          {shown >= 3 ? <Bubble key="b2" {...script[1]} /> : null}
          {shown >= 4 ? <Bubble key="b3" {...script[2]} /> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
