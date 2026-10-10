"use client";

import { motion, type Variants } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

/**
 * The five stage glyphs. Each is drawn around (0,0) inside a ~100-unit box and
 * animates through "hidden" → "show" variants owned by the parent, so the same
 * art can draw on mount (machine), on view (timeline) or render static.
 *
 *   Signal    scattered points
 *   Frame     a square with crop marks
 *   Prototype a rough hand-drawn sketch
 *   Ship      a solid launched shape
 *   Compound  a growth spiral
 */

const draw = (delay = 0, duration = 0.9): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration, delay, ease: easeOutExpo },
      opacity: { duration: 0.15, delay },
    },
  },
});

const pop = (delay = 0): Variants => ({
  hidden: { scale: 0, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 380, damping: 22, delay },
  },
});

const SIGNAL_POINTS: Array<[number, number, number, "s" | "c"]> = [
  [-30, -22, 4, "s"],
  [-8, -34, 3, "c"],
  [18, -26, 5, "s"],
  [34, -4, 3, "c"],
  [26, 20, 4, "c"],
  [4, 32, 3, "s"],
  [-22, 26, 5, "c"],
  [-36, 4, 3, "s"],
  [-4, -6, 6, "s"],
  [13, 6, 3, "c"],
];

function Signal() {
  return (
    <g>
      <motion.circle
        r={42}
        className="fill-none stroke-rule"
        strokeWidth={2}
        strokeDasharray="3 7"
        variants={pop(0)}
      />
      {SIGNAL_POINTS.map(([x, y, r, tone], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          className={tone === "s" ? "fill-saffron" : "fill-cobalt"}
          variants={pop(0.04 * i)}
        />
      ))}
    </g>
  );
}

function Frame() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <motion.rect
        x={-30}
        y={-30}
        width={60}
        height={60}
        rx={4}
        className="stroke-ink"
        strokeWidth={3}
        variants={draw(0, 0.8)}
      />
      {[
        "M-42 -26 V-42 H-26",
        "M26 -42 H42 V-26",
        "M42 26 V42 H26",
        "M-26 42 H-42 V26",
      ].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          className="stroke-cobalt"
          strokeWidth={4}
          variants={draw(0.25 + i * 0.06, 0.4)}
        />
      ))}
      <motion.circle r={5} className="fill-saffron" variants={pop(0.5)} />
    </g>
  );
}

function Prototype() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M-30 -28 C-14 -34 12 -23 31 -30 C35 -10 27 12 32 30 C12 25 -12 35 -31 29 C-26 10 -36 -10 -30 -28 Z"
        className="stroke-cobalt"
        strokeWidth={3}
        variants={draw(0, 1)}
      />
      <motion.path
        d="M-17 -8 C-10 -17 -3 2 5 -8 S 16 -3 19 -10"
        className="stroke-saffron"
        strokeWidth={4}
        variants={draw(0.4, 0.6)}
      />
      <motion.path
        d="M-17 10 H14 M-17 19 H4"
        className="stroke-ink"
        strokeWidth={3}
        variants={draw(0.6, 0.5)}
      />
    </g>
  );
}

function Ship() {
  return (
    <g>
      <motion.rect
        x={-32}
        y={-32}
        width={64}
        height={64}
        rx={16}
        className="fill-cobalt"
        variants={pop(0)}
      />
      <motion.path
        d="M0 16 V-14 M-12 -2 L0 -14 L12 -2"
        fill="none"
        className="stroke-saffron"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw(0.2, 0.5)}
      />
      <motion.path
        d="M-18 44 H-6 M6 44 H18"
        fill="none"
        className="stroke-rule"
        strokeWidth={3}
        strokeLinecap="round"
        variants={draw(0.35, 0.4)}
      />
    </g>
  );
}

/** Archimedean spiral, outward from the centre. */
const SPIRAL = (() => {
  const parts: string[] = [];
  const turns = 4.6 * Math.PI;
  for (let t = 0; t <= turns; t += 0.18) {
    const r = 2 + 2.9 * t;
    const x = (r * Math.cos(t)).toFixed(2);
    const y = (r * Math.sin(t)).toFixed(2);
    parts.push(`${parts.length ? "L" : "M"}${x} ${y}`);
  }
  return parts.join(" ");
})();

function Compound() {
  return (
    <g fill="none" strokeLinecap="round">
      <motion.path
        d={SPIRAL}
        className="stroke-saffron"
        strokeWidth={4}
        variants={draw(0, 1.2)}
      />
      <motion.circle
        r={5}
        className="fill-cobalt stroke-none"
        variants={pop(0)}
      />
    </g>
  );
}

const GLYPHS = [Signal, Frame, Prototype, Ship, Compound];

/** Renders glyph `index` (0–4). Must sit inside a motion parent that drives variants. */
export function StageGlyph({ index }: { index: number }) {
  const Glyph = GLYPHS[Math.max(0, Math.min(GLYPHS.length - 1, index))];
  return <Glyph />;
}
