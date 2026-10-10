"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { easeOutExpo } from "@/lib/motion";

/*
 * One hand-drawn line illustration per service. Strokes draw on with
 * pathLength, fills pop in after. Stroke colour is `currentColor`; the
 * secondary colour comes from the `--glyph-accent` custom property so the
 * same drawing reads on saffron, cobalt or split grounds.
 */

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, ease: easeOutExpo, delay: i * 0.09 },
      opacity: { duration: 0.15, delay: i * 0.09 },
    },
  }),
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo, delay: 0.25 + i * 0.09 },
  }),
};

const ACCENT = "var(--glyph-accent)";
const fillBox = { transformBox: "fill-box", transformOrigin: "center" } as const;

function D({ d, i = 0, accent }: { d: string; i?: number; accent?: boolean }) {
  return (
    <motion.path
      d={d}
      custom={i}
      variants={draw}
      fill="none"
      stroke={accent ? ACCENT : "currentColor"}
    />
  );
}

function F({ d, i = 0, accent }: { d: string; i?: number; accent?: boolean }) {
  return (
    <motion.path
      d={d}
      custom={i}
      variants={pop}
      style={fillBox}
      stroke="none"
      fill={accent ? ACCENT : "currentColor"}
    />
  );
}

function Dot({
  cx,
  cy,
  r,
  i = 0,
  accent,
}: {
  cx: number;
  cy: number;
  r: number;
  i?: number;
  accent?: boolean;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      custom={i}
      variants={pop}
      style={fillBox}
      stroke="none"
      fill={accent ? ACCENT : "currentColor"}
    />
  );
}

/** Rounded rectangle as a path, so it can draw on like everything else. */
function rr(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}

function circlePath(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`;
}

function star(cx: number, cy: number, outer: number, inner: number, points = 5) {
  const parts: string[] = [];
  for (let k = 0; k < points * 2; k++) {
    const radius = k % 2 === 0 ? outer : inner;
    const angle = (Math.PI / points) * k - Math.PI / 2;
    const x = (cx + radius * Math.cos(angle)).toFixed(1);
    const y = (cy + radius * Math.sin(angle)).toFixed(1);
    parts.push(`${k === 0 ? "M" : "L"}${x} ${y}`);
  }
  return `${parts.join("")}Z`;
}

function ticks(cx: number, cy: number, r1: number, r2: number, count: number) {
  let d = "";
  for (let k = 0; k < count; k++) {
    const a = ((Math.PI * 2) / count) * k;
    const c = Math.cos(a);
    const s = Math.sin(a);
    d += `M${(cx + r1 * c).toFixed(1)} ${(cy + r1 * s).toFixed(1)}L${(cx + r2 * c).toFixed(1)} ${(cy + r2 * s).toFixed(1)}`;
  }
  return d;
}

const drawings: Record<string, ReactNode> = {
  marketing: (
    <>
      <F d={rr(58, 122, 22, 38, 4)} i={0} accent />
      <F d={rr(90, 98, 22, 62, 4)} i={1} accent />
      <F d={rr(122, 72, 22, 88, 4)} i={2} accent />
      <D d="M36 36V164H172" i={0} />
      <D d="M44 136C84 128 118 98 156 50" i={2} />
      <D d="M134 48L158 47L157 71" i={4} />
    </>
  ),
  consultation: (
    <>
      <F
        d="M88 98h72a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14h-6v18l-20-18h-46a14 14 0 0 1-14-14v-34a14 14 0 0 1 14-14z"
        i={0}
        accent
      />
      <D
        d="M40 34h84a14 14 0 0 1 14 14v40a14 14 0 0 1-14 14H70l-22 20v-20h-8a14 14 0 0 1-14-14V48a14 14 0 0 1 14-14z"
        i={0}
      />
      <D d="M50 60h62" i={2} />
      <D d="M50 78h40" i={3} />
      <Dot cx={112} cy={129} r={5} i={2} />
      <Dot cx={130} cy={129} r={5} i={3} />
      <Dot cx={148} cy={129} r={5} i={4} />
    </>
  ),
  "brand-building": (
    <>
      <Dot cx={100} cy={100} r={44} i={0} accent />
      <D d={circlePath(100, 100, 66)} i={0} />
      <D d={ticks(100, 100, 74, 86, 24)} i={1} />
      <D d={star(100, 100, 30, 13)} i={3} />
    </>
  ),
  "web-development": (
    <>
      <F d={rr(30, 44, 140, 28, 12)} i={0} accent />
      <D d={rr(30, 44, 140, 116, 12)} i={0} />
      <Dot cx={48} cy={58} r={5} i={1} />
      <Dot cx={64} cy={58} r={5} i={2} />
      <Dot cx={80} cy={58} r={5} i={3} />
      <D d="M78 96L58 116L78 136" i={2} />
      <D d="M122 96L142 116L122 136" i={3} />
      <D d="M110 90L90 142" i={4} />
    </>
  ),
  "ai-workflows": (
    <>
      <D d="M48 52L100 104L152 52M100 104L48 156M100 104L152 156M48 52V156" i={0} />
      <Dot cx={48} cy={52} r={11} i={1} />
      <Dot cx={152} cy={52} r={11} i={2} />
      <Dot cx={48} cy={156} r={11} i={3} />
      <Dot cx={152} cy={156} r={11} i={4} />
      <Dot cx={100} cy={104} r={20} i={0} accent />
      <F
        d="M168 14l5 13 13 5-13 5-5 13-5-13-13-5 13-5z"
        i={5}
        accent
      />
    </>
  ),
  "app-development": (
    <>
      <D d={rr(60, 22, 80, 156, 16)} i={0} />
      <D d="M90 36H110" i={1} />
      <F d={rr(72, 52, 56, 34, 6)} i={0} accent />
      <D d={rr(72, 96, 56, 22, 5)} i={2} />
      <D d={rr(72, 128, 56, 22, 5)} i={3} />
      <Dot cx={100} cy={164} r={5} i={4} />
    </>
  ),
  "product-building": (
    <>
      <F d={rr(34, 122, 40, 44, 6)} i={0} accent />
      <D d={rr(80, 96, 40, 70, 6)} i={1} />
      <D d={rr(126, 66, 40, 100, 6)} i={2} />
      <D d="M38 98C62 62 98 40 146 30" i={3} />
      <D d="M126 22L148 29L140 50" i={4} />
    </>
  ),
};

/**
 * Plays its draw-on animation whenever `play` flips true (or on mount when it
 * starts true). Purely decorative: the service title carries the meaning.
 */
export function ServiceGlyph({
  slug,
  play = true,
  className,
}: {
  slug: string;
  play?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      aria-hidden
      focusable="false"
      viewBox="0 0 200 200"
      className={className}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduced ? false : "hidden"}
      animate={play || reduced ? "show" : "hidden"}
    >
      {drawings[slug] ?? null}
    </motion.svg>
  );
}
