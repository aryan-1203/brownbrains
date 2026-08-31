"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { stages } from "@/content/process";
import { useTone } from "@/components/tone/ToneProvider";
import { WordReveal } from "@/components/fx/WordReveal";
import { inView, riseIn, staggerParent } from "@/lib/motion";

function StageCard({ stage, index }: { stage: (typeof stages)[number]; index: number }) {
  return (
    <article className="relative flex h-full w-[78vw] shrink-0 flex-col justify-between rounded-2xl border border-rule bg-surface/60 p-7 backdrop-blur-sm sm:w-[58vw] lg:w-[27rem] lg:p-9">
      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.7rem] tracking-[0.16em] text-filament tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-[0.66rem] tracking-[0.12em] text-faint uppercase">
            {stage.duration}
          </span>
        </div>
        <h3 className="mt-6 font-display text-[clamp(1.9rem,3.6vw,2.7rem)] leading-none">
          {stage.title}
        </h3>
        <p className="mt-5 text-[0.95rem] leading-[1.65] text-muted">
          {stage.description}
        </p>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2 border-t border-rule pt-6">
        {stage.outputs.map((output) => (
          <li
            key={output}
            className="rounded-full border border-rule px-3 py-1 font-mono text-[0.62rem] tracking-[0.1em] text-muted uppercase"
          >
            {output}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Vertical fallback for reduced-motion visitors. */
function StackedStages() {
  return (
    <motion.div
      className="shell mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      variants={staggerParent(0.06)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
    >
      {stages.map((stage, index) => (
        <motion.div key={stage.id} variants={riseIn} className="flex">
          <div className="w-full [&>article]:w-full">
            <StageCard stage={stage} index={index} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AssemblyHeading() {
  return (
    <div className="shell">
      <p className="mono-label">04 / How it runs</p>
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <WordReveal
          text="Five stages, one continuous line"
          className="max-w-2xl text-title"
          accent={["line"]}
        />
        <p className="max-w-sm text-sm leading-[1.65] text-muted">
          Strategy informs the build; the build corrects the strategy — through launch.
        </p>
      </div>
    </div>
  );
}

/**
 * Pinned horizontal track. Mounted only when the outer scroll shell exists, so
 * useScroll never receives a target ref that hasn't been attached.
 */
function ScrollTrack({ heading }: { heading: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const node = track.current;
    if (!node) return;

    const measure = () => {
      const overflow = node.scrollWidth - window.innerWidth;
      setDistance(Math.max(0, overflow + 48));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 40,
    mass: 0.4,
  });

  return (
    <div
      ref={outer}
      className="relative"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden bg-bg py-20">
        {heading}

        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute top-1/2 right-0 left-0 -z-10 h-px bg-rule"
          />

          <motion.div
            ref={track}
            style={{ x }}
            className="flex items-stretch gap-5 pr-12 pl-[1.375rem] md:gap-7 md:pl-10 xl:pl-14"
          >
            {stages.map((stage, index) => (
              <StageCard key={stage.id} stage={stage} index={index} />
            ))}

            <div className="flex w-[60vw] shrink-0 items-center lg:w-[24rem]">
              <p className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-tight text-muted">
                Then it starts again, with better information.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="shell mt-12">
          <div className="h-px w-full origin-left bg-rule">
            <motion.div
              style={{ scaleX: progress }}
              className="h-px w-full origin-left bg-ember"
            />
          </div>
          <div className="mt-3 flex justify-between">
            {stages.map((stage) => (
              <span
                key={stage.id}
                className="font-mono text-[0.6rem] tracking-[0.1em] text-faint uppercase"
              >
                {stage.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The process, pinned and dragged sideways by vertical scroll. The wrapper is
 * as tall as the horizontal distance, so the mapping stays 1:1 with the wheel.
 */
export function AssemblyLine() {
  const [wide, setWide] = useState(false);
  const { reduced } = useTone();

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const heading = <AssemblyHeading />;

  if (reduced || !wide) {
    return (
      <div className="py-4">
        {heading}
        <StackedStages />
      </div>
    );
  }

  return <ScrollTrack heading={heading} />;
}
