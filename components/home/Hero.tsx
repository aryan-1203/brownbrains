"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { Button } from "@/components/ui/Button";
import { createField } from "./hero/field";

/**
 * Chapter 1. A field of points tells the company story in one scroll: two
 * halves (marketing, engineering) fold into one rotating globe, then the globe
 * bursts past the camera as the next chapter opens. The canvas engine lives
 * in ./hero/field.ts.
 *
 * From 50% of the pinned scroll a circular window opens through the stage.
 * The next section (Problem) is pulled up underneath the hero and rises into
 * that window, its heading settling in place as the pin releases: no empty
 * screen between chapters.
 */

const chapters = ["Two halves", "One brain"];

function introDelayMs() {
  if (document.documentElement.dataset.intro === "seen") return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--intro");
  const seconds = parseFloat(raw) || 0;
  // Measured from navigation start, so slow hydration doesn't stack delays.
  return Math.max(0, seconds * 1000 + 150 - performance.now());
}

function Field({
  progress,
  still,
}: {
  progress: MotionValue<number>;
  still: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancelled = false;
    let engine: ReturnType<typeof createField> | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let visible = document.visibilityState === "visible";
    let onScreen = true;

    const sync = () => {
      if (!engine) return;
      if (visible && onScreen) engine.play();
      else engine.pause();
    };
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };

    // Deferred a frame so the canvas has its laid-out size.
    const boot = requestAnimationFrame(() => {
      if (cancelled) return;
      engine = createField({
        canvas,
        getProgress: () => progress.get(),
        introDelay: still ? 0 : introDelayMs(),
        still,
      });
      let frame = 0;
      ro = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => engine?.resize());
      });
      ro.observe(canvas);
      io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      io.observe(canvas);
      document.addEventListener("visibilitychange", onVisibility);
      sync();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(boot);
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      engine?.destroy();
    };
  }, [progress, still]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

const delay = (d: string) => ({ "--d": d }) as CSSProperties;

function HeroCopy({ style }: { style?: MotionStyle }) {
  return (
    <motion.div
      style={style}
      className="shell relative z-10 grid gap-6 pb-[calc(var(--toolbar,0px)+max(2.5rem,env(safe-area-inset-bottom)))] md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12 md:pb-[calc(var(--toolbar,0px)+3.5rem)]"
    >
      <div>
        <p className="eyebrow css-rise mb-4 text-sky" style={delay("0s")}>
          <span aria-hidden className="h-2 w-2 rounded-full bg-saffron" />
          Marketing
          <span aria-hidden>+</span>
          Engineering
        </p>
        <h1 className="font-display text-[clamp(2.6rem,6.4vw,6rem)] font-extrabold tracking-[-0.045em] text-chalk">
          <span className="css-rise inline-block" style={delay("0.08s")}>
            Marketing and engineering.
          </span>{" "}
          <span className="css-rise inline-block text-saffron" style={delay("0.18s")}>
            One team.
          </span>
        </h1>
      </div>
      <div className="css-rise flex flex-col gap-5 md:items-start md:pb-2" style={delay("0.28s")}>
        <p className="lead max-w-sm text-[#c4cde3]">
          Brand, campaigns, websites, apps and AI. Planned and built by the same
          people.
        </p>
        <Button href="/contact">Start a project</Button>
      </div>
    </motion.div>
  );
}

function ChapterRail({ progress }: { progress: MotionValue<number> }) {
  const one = useTransform(progress, [0, 0.22, 0.28], [1, 1, 0.35]);
  const two = useTransform(progress, [0.22, 0.28], [0.35, 1]);
  const fill = useTransform(progress, [0, 0.36], [0, 1]);
  const railOut = useTransform(progress, [0.48, 0.56], [1, 0]);
  const values = [one, two];

  return (
    <motion.div
      aria-hidden
      style={{ opacity: railOut }}
      className="pointer-events-none absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 items-stretch gap-4 lg:flex"
    >
      <div className="relative w-[2px] overflow-hidden rounded bg-white/12">
        <motion.div
          style={{ scaleY: fill }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-saffron to-cobalt"
        />
      </div>
      <ol className="flex flex-col justify-between gap-8 py-1">
        {chapters.map((label, index) => (
          <motion.li
            key={label}
            style={{ opacity: values[index] }}
            className="text-[0.78rem] font-bold tracking-[0.14em] text-chalk uppercase"
          >
            <span className="mr-2 text-saffron tabular-nums">0{index + 1}</span>
            {label}
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const copyOpacity = useTransform(p, [0, 0.14], [1, 0]);
  const copyY = useTransform(p, [0, 0.18], [0, -70]);
  const copyEvents = useTransform(p, (v) => (v > 0.1 ? "none" : "auto"));
  const sphereCaption = useTransform(p, [0.2, 0.26, 0.44, 0.5], [0, 1, 1, 0]);
  // A widening window through the hero onto the section already waiting
  // beneath it, so the next content is there the moment the circle opens.
  const hole = useTransform(p, [0.5, 0.94], [0, 150]);
  const stageEvents = useTransform(p, (v) => (v > 0.52 ? "none" : "auto"));

  if (reduced) {
    return (
      <section
        ref={ref}
        aria-label="Introduction"
        className="theme-midnight relative flex min-h-svh flex-col justify-end overflow-hidden pt-36"
      >
        <div aria-hidden className="hero-glow absolute inset-0" />
        <Field progress={p} still />
        <HeroCopy />
      </section>
    );
  }

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative z-20 h-[180vh] md:h-[230vh]"
    >
      {/* The stage is the *large* viewport tall: when a phone's toolbar slides
          away the screen grows, and a shorter stage would expose the section
          waiting underneath. --toolbar keeps copy clear of the toolbar zone. */}
      <motion.div
        style={{ "--hole": hole, pointerEvents: stageEvents } as unknown as MotionStyle}
        className="hero-hole theme-midnight sticky top-0 flex h-lvh flex-col justify-end overflow-hidden [--toolbar:calc(100lvh-100svh)]"
      >
        <div aria-hidden className="hero-glow absolute inset-0" />
        <Field progress={p} still={false} />
        <ChapterRail progress={p} />

        <motion.p
          aria-hidden
          style={{ opacity: sphereCaption }}
          className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--toolbar)+14svh)] px-6 text-center font-display text-heading font-bold text-chalk"
        >
          Strategy and code. <span className="text-saffron">One brain.</span>
        </motion.p>

        <HeroCopy style={{ opacity: copyOpacity, y: copyY, pointerEvents: copyEvents }} />
      </motion.div>
    </section>
  );
}
