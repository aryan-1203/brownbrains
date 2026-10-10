"use client";

import { useRef, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionStyle,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Chapter 1. "Two halves, one brain."
 *
 * A saffron half (marketing) and a cobalt half (engineering) start far apart.
 * Scrolling pulls them together until they lock into one circle, then a chalk
 * flood opens from the seam and becomes the ground of the next chapter.
 *
 * Geometry lives in CSS variables so mobile and desktop share one motion
 * timeline: --d (diameter), --off (starting distance), --cy (vertical centre).
 * Motion only writes the unitless --split (1 apart, 0 locked) and --flood.
 */

const marketing = ["Brand", "Campaigns", "Positioning"];
const engineering = ["Web", "Apps", "AI"];

/** Labels that circle a half. The ring spins; each chip counter-spins upright. */
function Orbit({
  items,
  side,
  style,
}: {
  items: string[];
  side: "left" | "right";
  style?: MotionStyle;
}) {
  return (
    <motion.div
      aria-hidden
      style={style}
      className={cn(
        "pointer-events-none absolute top-1/2 h-[calc(var(--d)*1.55)] w-[calc(var(--d)*1.55)] -translate-y-1/2",
        // Centred on the circle's true centre: the flat edge of each half.
        side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
      )}
    >
      <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-white/15">
        {items.map((item, index) => {
          const angle =
            (index / items.length) * Math.PI * 2 +
            (side === "left" ? 2.4 : -0.7);
          return (
            <span
              key={item}
              className="absolute"
              style={{
                left: `${50 + Math.cos(angle) * 50}%`,
                top: `${50 + Math.sin(angle) * 50}%`,
              }}
            >
              <span
                className={cn(
                  "animate-spin-slow block -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-[0.08em] whitespace-nowrap uppercase shadow-lg md:px-4 md:py-1.5 md:text-[0.8rem]",
                  side === "left"
                    ? "bg-midnight-2 text-saffron ring-1 ring-saffron/40"
                    : "bg-midnight-2 text-sky ring-1 ring-cobalt/60",
                )}
                style={{ animationDirection: "reverse" }}
              >
                {item}
              </span>
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

function HeroCopy({ style }: { style?: MotionStyle }) {
  return (
    <motion.div
      style={style}
      className="shell relative z-10 grid gap-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12 md:pb-14"
    >
      <div>
        <p className="eyebrow mb-4 text-sky">
          <span aria-hidden className="h-2 w-2 rounded-full bg-saffron" />
          Marketing
          <span aria-hidden>+</span>
          Engineering
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6.4vw,6rem)] font-extrabold tracking-[-0.045em] text-chalk">
          Marketing and engineering.{" "}
          <span className="text-saffron">One team.</span>
        </h1>
      </div>
      <div className="flex flex-col gap-5 md:items-start md:pb-2">
        <p className="lead max-w-sm text-[#c4cde3]">
          Brand, campaigns, websites, apps and AI. Planned and built by the same
          people.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact">Start a project</Button>
          <Button
            href="#problem"
            variant="ghost"
            arrow={false}
            className="text-chalk"
          >
            <span className="flex items-center gap-2">
              Scroll
              <span
                aria-hidden
                className="relative block h-5 w-3 rounded-full border-2 border-current"
              >
                <span className="animate-pulse-dot absolute top-1 left-1/2 block h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-saffron" />
              </span>
            </span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/** The two halves, laid out around a shared centre. The outer layer carries the
 *  CSS-variable travel, the inner motion layer the rotation, so neither
 *  transform overwrites the other. */
function Halves({
  leftStyle,
  rightStyle,
  orbitStyle,
}: {
  leftStyle?: MotionStyle;
  rightStyle?: MotionStyle;
  orbitStyle?: MotionStyle;
}) {
  return (
    <>
      <div className="absolute top-0 right-1/2 h-full w-1/2 [transform:translateX(calc(var(--split)*var(--off)*-1))]">
        <Orbit items={marketing} side="left" style={orbitStyle} />
        <motion.div
          style={leftStyle}
          className="absolute inset-0 origin-right rounded-l-full bg-saffron shadow-[0_0_80px_-10px_rgba(255,178,36,0.55)]"
        />
      </div>
      <div className="absolute top-0 left-1/2 h-full w-1/2 [transform:translateX(calc(var(--split)*var(--off)))]">
        <Orbit items={engineering} side="right" style={orbitStyle} />
        <motion.div
          style={rightStyle}
          className="absolute inset-0 origin-left rounded-r-full bg-cobalt shadow-[0_0_80px_-10px_rgba(43,89,255,0.7)]"
        />
      </div>
    </>
  );
}

const geometry =
  "[--d:38vw] [--off:24vw] [--cy:30%] md:[--d:min(32vh,26vw)] md:[--off:min(30vw,26rem)] md:[--cy:36%]";

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_35%,black,transparent_70%)]" />
      <svg
        className="absolute top-[var(--cy)] left-1/2 h-[calc(var(--d)*4)] w-[calc(var(--d)*4)] -translate-x-1/2 -translate-y-1/2 text-white/[0.07]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="49"
          stroke="currentColor"
          strokeWidth="0.2"
        />
        <circle
          cx="50"
          cy="50"
          r="36"
          stroke="currentColor"
          strokeWidth="0.2"
        />
        <circle
          cx="50"
          cy="50"
          r="23"
          stroke="currentColor"
          strokeWidth="0.2"
          strokeDasharray="1 1.5"
        />
      </svg>
    </div>
  );
}

function StaticHero({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className={cn(
        "theme-midnight relative flex min-h-svh flex-col justify-end overflow-hidden pt-36",
        geometry,
      )}
      style={{ "--split": 0 } as CSSProperties}
    >
      <Backdrop />
      <div className="absolute top-[var(--cy)] left-1/2 h-[var(--d)] w-[var(--d)] -translate-x-1/2 -translate-y-1/2">
        <Halves />
      </div>
      <HeroCopy />
    </section>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const split = useTransform(p, [0.04, 0.42], [1, 0]);
  const leftRotate = useTransform(p, [0, 0.42], [-24, 0]);
  const rightRotate = useTransform(p, [0, 0.42], [24, 0]);
  const orbitOpacity = useTransform(p, [0.04, 0.3], [1, 0]);
  const copyOpacity = useTransform(p, [0, 0.2], [1, 0]);
  const copyY = useTransform(p, [0, 0.25], [0, -90]);
  const copyEvents = useTransform(p, (v) => (v > 0.16 ? "none" : "auto"));
  const lockScale = useTransform(p, [0.4, 0.56], [1, 1.9]);
  const lockOpacity = useTransform(p, [0.38, 0.43, 0.56], [0, 1, 0]);
  const captionOpacity = useTransform(
    p,
    [0.42, 0.48, 0.58, 0.64],
    [0, 1, 1, 0],
  );
  const circleScale = useTransform(p, [0.5, 0.82], [1, 2.4]);
  const circleRotate = useTransform(p, [0.5, 0.9], [0, 90]);
  const flood = useTransform(p, [0.6, 0.94], [0, 150]);
  const outroOpacity = useTransform(p, [0.86, 0.94], [0, 1]);
  const outroY = useTransform(p, [0.86, 0.96], [30, 0]);

  if (reduced) return <StaticHero sectionRef={ref} />;

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className={cn("relative h-[200vh] bg-midnight md:h-[280vh]", geometry)}
    >
      <motion.div
        className="theme-midnight sticky top-0 flex h-svh flex-col justify-end overflow-hidden pt-28"
        style={{ "--split": split, "--flood": flood } as unknown as MotionStyle}
      >
        <Backdrop />

        {/* The joined circle. Rotates a quarter turn as it grows. */}
        <motion.div
          style={{ scale: circleScale, rotate: circleRotate }}
          className="absolute top-[var(--cy)] left-1/2 -mt-[calc(var(--d)/2)] -ml-[calc(var(--d)/2)] h-[var(--d)] w-[var(--d)]"
        >
          <Halves
            leftStyle={{ rotate: leftRotate }}
            rightStyle={{ rotate: rightRotate }}
            orbitStyle={{ opacity: orbitOpacity }}
          />
          <motion.div
            aria-hidden
            style={{ scale: lockScale, opacity: lockOpacity }}
            className="absolute inset-0 rounded-full border-2 border-chalk"
          />
        </motion.div>

        <motion.p
          aria-hidden
          style={{ opacity: captionOpacity }}
          className="pointer-events-none absolute top-[calc(var(--cy)_+_var(--d)*0.5_+_2.5rem)] left-1/2 -translate-x-1/2 font-display text-heading font-bold whitespace-nowrap text-chalk"
        >
          Locked in. <span className="text-saffron">One brain.</span>
        </motion.p>

        <HeroCopy
          style={{ opacity: copyOpacity, y: copyY, pointerEvents: copyEvents }}
        />

        {/* Chalk flood that opens from the seam and hands off to chapter 2. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid place-items-center bg-chalk [clip-path:circle(calc(var(--flood,0)*1%)_at_50%_var(--cy))]"
        >
          <motion.p
            style={{ opacity: outroOpacity, y: outroY }}
            className="px-5 text-center font-display text-title font-extrabold text-midnight"
          >
            Two halves.
            <br />
            <span className="text-cobalt">One brain.</span>
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
