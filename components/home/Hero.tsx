"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { easeOutExpo } from "@/lib/motion";
import { toneGradient } from "@/lib/tone-gradient";
import { useTone } from "@/components/tone/ToneProvider";
import { MagneticButton } from "@/components/fx/MagneticButton";

const SynapseCanvas = dynamic(
  () =>
    import("@/components/fx/SynapseCanvas").then((m) => ({
      default: m.SynapseCanvas,
    })),
  { ssr: false },
);

const MIN_SPLIT = 8;
const MAX_SPLIT = 92;
/**
 * How far the seam leans toward the pointer. Below 1 it trails the cursor
 * instead of pinning under it, which keeps the ring clear of the handle and
 * makes the whole range reachable without aiming at the very edge of the screen.
 */
const POINTER_RESPONSE = 0.78;
/** How much of the hero the machine half claims as you scroll away from it. */
const SCROLL_TAKEOVER = 22;

const sides = {
  human: {
    index: "01",
    label: "Human",
    words: ["Marketing", "Brand", "Consulting"],
  },
  machine: {
    index: "02",
    label: "Machine",
    words: ["Web", "Apps", "AI Workflows"],
  },
};

/** The centre column, rendered once per side so its colour flips at the seam. */
function HeroCopy({ variant }: { variant: "human" | "machine" }) {
  const machine = variant === "machine";
  const Heading = machine ? "p" : "h1";

  return (
    <div
      className={cn(
        "shell flex h-full flex-col justify-center pt-24 pb-36 max-md:justify-start max-md:pt-28 max-md:pb-44 md:pb-28",
        machine ? "text-[#f0e9df]" : "text-[#1a1310]",
      )}
      aria-hidden={machine || undefined}
    >
      <p
        className={cn(
          "font-mono text-[0.68rem] tracking-[0.2em] uppercase",
          machine ? "text-[#a2938a]" : "text-[#6b5b50]",
        )}
      >
        Est. {site.founded} — {site.contact.city}, {site.contact.country}
      </p>

      <Heading className="mt-6 font-display text-mega leading-[0.86] font-[380] tracking-[-0.035em]">
        Two brains.
        <br />
        <span
          className={cn("italic", machine ? "text-[#e9b44c]" : "text-[#c2431c]")}
        >
          One studio.
        </span>
      </Heading>

      <p
        className={cn(
          "mt-8 max-w-xl text-lead leading-[1.5]",
          machine ? "text-[#a2938a]" : "text-[#6b5b50]",
        )}
      >
        Marketing led by decades of brand leadership. Software built by product
        engineers. Same studio, same invoice, no handoff in between.
      </p>

      <div className="mt-11 flex flex-wrap items-center gap-4">
        <MagneticButton
          href="/contact"
          cursorLabel="talk"
          className={
            machine ? "!bg-[#f0e9df] !text-[#14100e]" : "!bg-[#1a1310] !text-[#f4efe6]"
          }
        >
          Start a project
        </MagneticButton>
        <Link
          href="/services"
          className={cn(
            "link-underline font-mono text-[0.72rem] tracking-[0.14em] uppercase",
            machine ? "text-[#a2938a] hover:text-[#f0e9df]" : "text-[#6b5b50] hover:text-[#1a1310]",
          )}
        >
          See the seven things we do
        </Link>
      </div>
    </div>
  );
}

/** Edge column: an index, a rotated side name and that side's capabilities. */
function SideMarks({
  variant,
  align,
}: {
  variant: "human" | "machine";
  align: "left" | "right";
}) {
  const data = sides[variant];
  const machine = variant === "machine";

  return (
    <div
      aria-hidden
      className={cn(
        // Extra bottom room keeps the capability list clear of the hero's fade.
        "pointer-events-none absolute inset-y-0 hidden w-40 flex-col justify-between pt-24 pb-40 lg:flex",
        align === "left" ? "left-6 items-start" : "right-6 items-end",
        machine ? "text-[#a2938a]" : "text-[#6b5b50]",
      )}
    >
      <div className={cn(align === "right" && "text-right")}>
        <p className="font-mono text-[0.68rem] tracking-[0.2em] uppercase">
          {data.index} / {data.label}
        </p>
        <div
          className={cn(
            "mt-3 h-px w-14",
            machine ? "bg-[#2e2622]" : "bg-[#ddd3c6]",
          )}
        />
      </div>

      <ul className={cn("space-y-1.5", align === "right" && "text-right")}>
        {data.words.map((word) => (
          <li key={word} className="font-mono text-[0.7rem] tracking-[0.08em]">
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { reduced } = useTone();
  // null until measured, so nothing about the hint depends on guessing.
  const [finePointer, setFinePointer] = useState<boolean | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [announced, setAnnounced] = useState(50);
  // The intro wipe owns the seam until it lands; nothing else may touch it.
  const settled = useRef(false);

  // Percentage of the hero occupied by the human side.
  const split = useMotionValue(reduced ? 50 : 100);
  // Loose enough that the seam drifts after the cursor rather than snapping to
  // it — the lag is what makes it feel like a curtain instead of a slider.
  const smooth = useSpring(split, { stiffness: 190, damping: 26, mass: 0.6 });

  const humanEdge = useTransform(smooth, (value) => 100 - value);
  const humanClip = useMotionTemplate`inset(0 ${humanEdge}% 0 0)`;
  const machineClip = useMotionTemplate`inset(0 0 0 ${smooth}%)`;
  const handleLeft = useMotionTemplate`${smooth}%`;

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  const clamp = (value: number) =>
    Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, value));

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const enable = () => setShowCanvas(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 1600 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(enable, 900);
    return () => clearTimeout(timer);
  }, [reduced]);

  // Wipe open on first paint so the two halves introduce themselves.
  useEffect(() => {
    if (reduced) {
      split.set(50);
      settled.current = true;
      return;
    }
    const controls = animate(split, 50, {
      duration: 1.5,
      delay: 0.35,
      ease: easeOutExpo,
      onComplete: () => {
        settled.current = true;
      },
    });
    return () => controls.stop();
  }, [reduced, split]);

  // With a mouse, the seam simply follows you around the hero. Keyboard control
  // takes precedence while the handle is focused, so arrow keys are not fighting
  // a stray cursor sitting somewhere over the page.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !finePointer || reduced || keyboard) return;

    let bounds = wrap.getBoundingClientRect();
    const measure = () => {
      bounds = wrap.getBoundingClientRect();
    };

    const onMove = (event: PointerEvent) => {
      if (!settled.current || bounds.width === 0) return;
      const pct = ((event.clientX - bounds.left) / bounds.width) * 100;
      split.set(clamp(50 + (pct - 50) * POINTER_RESPONSE));
    };

    const onLeave = () => {
      if (settled.current) split.set(50);
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
    };
  }, [finePointer, keyboard, reduced, split]);

  // Touch scroll nudges the seam on tablet+, but on phones the split stays
  // centred so copy never drifts into a low-contrast gradient band.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (finePointer !== false || narrow || reduced || !settled.current) return;
    split.set(clamp(50 - progress * SCROLL_TAKEOVER));
  });

  const nudge = (delta: number) => {
    const next = clamp(split.get() + delta);
    split.set(next);
    setAnnounced(Math.round(next));
  };

  return (
    <div
      ref={wrapRef}
      className="relative isolate min-h-[100svh] overflow-hidden select-none"
    >
      {/* Human side */}
      <motion.div
        className="tone-paper absolute inset-0 bg-[#f4efe6]"
        style={{ clipPath: humanClip }}
      >
        {/* The light half sinks into espresso at the bottom so both halves meet
            the dark section below without a hard edge. Painted before the marks
            so it never sits on top of them. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[16vh] min-h-24 md:block"
          style={{ backgroundImage: toneGradient("paper", "machine") }}
        />
        <SideMarks variant="human" align="left" />
      </motion.div>

      {/* Machine side */}
      <motion.div
        className="tone-machine absolute inset-0 bg-[#14100e]"
        style={{ clipPath: machineClip }}
      >
        {showCanvas ? <SynapseCanvas density={1} /> : null}
        <SideMarks variant="machine" align="right" />
      </motion.div>

      {/* Copy, once per side, clipped to match */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: humanClip, y: contentY, opacity: contentOpacity }}
      >
        <HeroCopy variant="human" />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: machineClip, y: contentY, opacity: contentOpacity }}
      >
        <HeroCopy variant="machine" />
      </motion.div>

      {/* The seam itself */}
      <motion.div
        className="absolute inset-y-0 z-30 w-px bg-[#c2431c]"
        style={{ left: handleLeft }}
      >
        {/* Marks the seam and gives keyboards a way to move it. Touch devices
            get neither — the split is decorative there, both halves carry the
            same copy, and a disc pinned inside the hero only collides with the
            header as the section scrolls away. */}
        {finePointer ? (
          <div
            role="slider"
            tabIndex={0}
            aria-label="Balance the human and machine halves"
            aria-valuemin={MIN_SPLIT}
            aria-valuemax={MAX_SPLIT}
            aria-valuenow={announced}
            onFocus={() => setKeyboard(true)}
            onBlur={() => setKeyboard(false)}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                nudge(-6);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                nudge(6);
              }
            }}
            className={cn(
              "absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2",
              "items-center justify-center rounded-full",
              "border border-[#c2431c] bg-[#c2431c] text-[#fbf8f3] transition-transform duration-300",
              keyboard ? "scale-110" : "hover:scale-110",
            )}
          >
            <svg viewBox="0 0 24 12" className="h-2.5 w-5" aria-hidden>
              <path
                d="M7 1 2 6l5 5M17 1l5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : null}
      </motion.div>

      {/* Footnote — describes whichever behaviour this device actually gets */}
      {finePointer === null ? null : (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 hidden justify-center md:flex">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.8 }}
            // Both halves are espresso down here, so this reads for a dark backdrop.
            className="rounded-full border border-[#c2431c]/50 bg-[#14100e]/50 px-4 py-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-[#c8b8ac] uppercase backdrop-blur-sm"
          >
            {reduced
              ? "Two halves, one studio"
              : finePointer
                ? "The seam follows your cursor"
                : "Keep scrolling to shift the seam"}
          </motion.p>
        </div>
      )}
    </div>
  );
}
