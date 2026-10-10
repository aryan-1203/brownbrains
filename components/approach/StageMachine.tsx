"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { stages } from "@/content/process";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { StageGlyph } from "./glyphs";

/* --------------------------------------------------------------------------
   Geometry: five stations climbing left to right, joined by S-curves.
   -------------------------------------------------------------------------- */

const VIEW_W = 640;
const VIEW_H = 520;
const STATIONS: Array<[number, number]> = [
  [86, 420],
  [222, 232],
  [356, 370],
  [478, 190],
  [566, 86],
];
const SEGMENTS = STATIONS.slice(0, -1).map(([x1, y1], i) => {
  const [x2, y2] = STATIONS[i + 1];
  const dx = (x2 - x1) * 0.55;
  return `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
});

/** Share of each stage's scroll window the orb rests at its station. */
const DWELL = 0.55;
const COUNT = stages.length;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Travel progress (0–1) along segment `k`, given pos in [0, COUNT]. */
const travel = (pos: number, k: number) =>
  clamp01((pos - k - DWELL) / (1 - DWELL));
const stageAt = (pos: number) =>
  Math.min(COUNT - 1, Math.max(0, Math.floor(pos)));

/* --------------------------------------------------------------------------
   Desktop: pinned machine
   -------------------------------------------------------------------------- */

function TrackSegment({
  d,
  pos,
  k,
}: {
  d: string;
  pos: MotionValue<number>;
  k: number;
}) {
  const pathLength = useTransform(pos, (v) => travel(v, k));
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="url(#bb-track)"
      strokeWidth={5}
      strokeLinecap="round"
      style={{ pathLength }}
    />
  );
}

function Station({ pos, k }: { pos: MotionValue<number>; k: number }) {
  const [x, y] = STATIONS[k];
  const lit = useTransform(pos, [k - 0.05, k], [0, 1]);
  const labelOpacity = useTransform(lit, [0, 1], [0.4, 1]);
  const below = y < VIEW_H / 2;
  const stage = stages[k];
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={9}
        className="fill-surface stroke-rule"
        strokeWidth={2}
      />
      <motion.circle
        cx={x}
        cy={y}
        r={9}
        className="fill-cobalt"
        style={{ opacity: lit }}
      />
      <motion.text
        x={x}
        y={below ? y + 84 : y - 72}
        textAnchor="middle"
        className="fill-ink font-display text-[15px] font-bold tracking-[-0.01em]"
        style={{ opacity: labelOpacity }}
      >
        {String(k + 1).padStart(2, "0")} {stage.title}
      </motion.text>
    </g>
  );
}

function ProgressBar({
  pos,
  k,
  active,
}: {
  pos: MotionValue<number>;
  k: number;
  active: boolean;
}) {
  const scaleX = useTransform(pos, (v) =>
    v >= k + 1 ? 1 : v < k ? 0 : clamp01((v - k) / DWELL),
  );
  return (
    <li className="flex-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-rule">
        <motion.div
          style={{ scaleX }}
          className="h-full origin-left rounded-full bg-cobalt"
        />
      </div>
      <p
        className={cn(
          "mt-2.5 text-[0.78rem] font-semibold transition-colors duration-300",
          active ? "text-ink" : "text-muted",
        )}
      >
        {stages[k].title}
      </p>
    </li>
  );
}

function PinnedMachine() {
  const wrap = useRef<HTMLDivElement>(null);
  const segRefs = useRef<Array<SVGPathElement | null>>([]);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const pos = useTransform(scrollYProgress, (v) => v * COUNT);
  useMotionValueEvent(pos, "change", (v) => {
    const next = stageAt(v);
    setActive((prev) => (prev === next ? prev : next));
  });

  const pointAt = (v: number) => {
    const i = stageAt(v);
    const t = i >= COUNT - 1 ? 0 : travel(v, i);
    if (t === 0) return STATIONS[i];
    if (t === 1) return STATIONS[i + 1];
    const el = segRefs.current[i];
    if (!el) return STATIONS[i];
    const p = el.getPointAtLength(t * el.getTotalLength());
    return [p.x, p.y] as [number, number];
  };
  const orbX = useTransform(pos, (v) => pointAt(v)[0]);
  const orbY = useTransform(pos, (v) => pointAt(v)[1]);
  // The glyph shrinks to a travelling dot between stations, then blooms again.
  const orbScale = useTransform(pos, (v) => {
    const i = stageAt(v);
    const t = i >= COUNT - 1 ? 0 : travel(v, i);
    return 1 - 0.62 * Math.sin(Math.PI * t);
  });

  const stage = stages[active];

  return (
    <div ref={wrap} className="relative h-[480vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          aria-hidden
          className="shell grid w-full grid-cols-[1.12fr_0.88fr] items-center gap-12 pt-16 xl:gap-20"
        >
          {/* The machine */}
          <div className="dot-grid relative rounded-card border border-rule bg-surface/70 p-6">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="mx-auto block h-auto max-h-[68vh] w-full"
            >
              <defs>
                <linearGradient
                  id="bb-track"
                  x1="0"
                  x2={VIEW_W}
                  y1="0"
                  y2="0"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#ffb224" />
                  <stop offset="1" stopColor="#2b59ff" />
                </linearGradient>
              </defs>

              {SEGMENTS.map((d, k) => (
                <path
                  key={`base-${k}`}
                  ref={(el) => {
                    segRefs.current[k] = el;
                  }}
                  d={d}
                  fill="none"
                  className="stroke-rule"
                  strokeWidth={3}
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                />
              ))}
              {SEGMENTS.map((d, k) => (
                <TrackSegment key={`live-${k}`} d={d} pos={pos} k={k} />
              ))}
              {STATIONS.map((_, k) => (
                <Station key={k} pos={pos} k={k} />
              ))}

              {/* The orb: one object that changes form at every station. */}
              <motion.g style={{ x: orbX, y: orbY }}>
                <motion.g style={{ scale: orbScale }}>
                  <circle
                    r={56}
                    className="fill-surface stroke-rule"
                    strokeWidth={2}
                  />
                  <AnimatePresence initial={false}>
                    <motion.g
                      key={active}
                      initial="hidden"
                      animate="show"
                      exit={{
                        opacity: 0,
                        scale: 0.4,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <StageGlyph index={active} />
                    </motion.g>
                  </AnimatePresence>
                </motion.g>
              </motion.g>
            </svg>
          </div>

          {/* The readout */}
          <div>
            <p className="flex items-baseline gap-2 font-display font-bold tracking-[-0.04em]">
              <span className="relative inline-block overflow-hidden text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-cobalt">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={active}
                    className="inline-block"
                    initial={{ y: "100%" }}
                    animate={{
                      y: "0%",
                      transition: { duration: 0.6, ease: easeOutExpo },
                    }}
                    exit={{ y: "-100%", transition: { duration: 0.25 } }}
                  >
                    {String(active + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-2xl text-muted">
                / {String(COUNT).padStart(2, "0")}
              </span>
            </p>

            <div className="mt-6 min-h-[17rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: easeOutExpo },
                  }}
                  exit={{ opacity: 0, y: -14, transition: { duration: 0.18 } }}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.9]">
                      {stage.title}
                    </h3>
                    <span className="rounded-full bg-saffron px-3.5 py-1.5 text-sm font-bold text-midnight">
                      {stage.duration}
                    </span>
                  </div>
                  <p className="lead mt-5 max-w-md">{stage.description}</p>
                  <ul className="mt-7 space-y-3">
                    {stage.outputs.map((output, i) => (
                      <motion.li
                        key={output}
                        className="flex items-center gap-3 font-semibold"
                        initial={{ opacity: 0, x: -14 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: 0.12 + i * 0.07,
                            duration: 0.5,
                            ease: easeOutExpo,
                          },
                        }}
                      >
                        <Check />
                        {output}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <ol className="mt-10 flex gap-2.5">
              {stages.map((s, k) => (
                <ProgressBar key={s.id} pos={pos} k={k} active={k === active} />
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* The animated readout is decorative; assistive tech gets the plain list. */}
      <ol className="sr-only">
        {stages.map((s, i) => (
          <li key={s.id}>
            <h3>
              Stage {i + 1} of {COUNT}: {s.title}, {s.duration}
            </h3>
            <p>{s.description}</p>
            <ul>
              {s.outputs.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
      <circle cx="12" cy="12" r="12" className="fill-cobalt" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Mobile / reduced motion: vertical timeline with a drawing line
   -------------------------------------------------------------------------- */

function Timeline({
  reduced,
  className,
}: {
  reduced: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="relative mx-auto max-w-3xl">
        <div
          aria-hidden
          className="absolute top-4 bottom-4 left-[27px] w-0.5 overflow-hidden rounded-full bg-rule"
        >
          <motion.div
            style={reduced ? undefined : { scaleY: scrollYProgress }}
            className="h-full w-full origin-top bg-gradient-to-b from-saffron to-cobalt"
          />
        </div>

        <ol className="space-y-14">
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className="relative grid grid-cols-[56px_1fr] gap-5"
            >
              <motion.svg
                aria-hidden
                viewBox="-60 -60 120 120"
                className="relative h-14 w-14"
                {...(reduced
                  ? { initial: false, animate: "show" }
                  : {
                      initial: "hidden",
                      whileInView: "show",
                      viewport: { once: true, amount: 0.8 },
                    })}
              >
                <circle
                  r={56}
                  className="fill-surface stroke-rule"
                  strokeWidth={3}
                />
                <g transform="scale(0.82)">
                  <StageGlyph index={i} />
                </g>
              </motion.svg>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 24 }}
                {...(reduced
                  ? { animate: { opacity: 1, y: 0 } }
                  : { whileInView: { opacity: 1, y: 0 } })}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: easeOutExpo }}
              >
                <p className="eyebrow">
                  {String(i + 1).padStart(2, "0")} / {stage.duration}
                </p>
                <h3 className="mt-2 text-title">{stage.title}</h3>
                <p className="mt-3 text-muted">{stage.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stage.outputs.map((output) => (
                    <li
                      key={output}
                      className="rounded-full border border-rule bg-surface px-3 py-1.5 text-sm font-semibold"
                    >
                      {output}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * The five stages. Desktop gets the pinned machine: an orb rides a drawn
 * track, changing form at every station while the readout swaps. Below lg, or
 * with reduced motion, it is a plain timeline with no scroll pinning.
 */
export function StageMachine() {
  const reduced = useReducedMotion() ?? false;

  if (reduced) return <Timeline reduced className="shell mt-14" />;

  return (
    <>
      <div className="hidden lg:block">
        <PinnedMachine />
      </div>
      <Timeline reduced={false} className="shell mt-14 lg:hidden" />
    </>
  );
}
