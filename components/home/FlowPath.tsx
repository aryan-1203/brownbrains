"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import type { Stage } from "@/content/process";
import { cn } from "@/lib/cn";

/** Desktop node x-positions (percent), alternating either side of centre. */
const xs = [38, 62];

function buildPath(count: number) {
  const step = 100 / count;
  let d = "M50 0";
  let prev = { x: 50, y: 0 };
  for (let i = 0; i <= count; i += 1) {
    const point =
      i === count ? { x: 50, y: 100 } : { x: xs[i % 2], y: step * (i + 0.5) };
    const bend = (point.y - prev.y) * 0.55;
    d += ` C${prev.x} ${prev.y + bend} ${point.x} ${point.y - bend} ${point.x} ${point.y}`;
    prev = point;
  }
  return d;
}

function Node({
  index,
  total,
  progress,
  reduced,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const at = (index + 0.5) / total;
  const lit = useTransform(progress, [at - 0.04, at], [0, 1]);
  const halo = useTransform(progress, [at - 0.04, at, at + 0.12], [0, 0.6, 0]);
  const haloScale = useTransform(progress, [at - 0.04, at + 0.12], [1, 2.6]);
  const fill = index % 2 === 0 ? "bg-cobalt" : "bg-saffron";

  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-1/2 left-5 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-rule bg-surface",
        index % 2 === 0 ? "md:left-[38%]" : "md:left-[62%]",
      )}
    >
      <motion.span
        style={reduced ? undefined : { scale: haloScale, opacity: halo }}
        className={cn(
          "absolute inset-0 rounded-full",
          reduced ? "opacity-0" : "",
          fill,
        )}
      />
      <motion.span
        style={reduced ? undefined : { scale: lit }}
        className={cn("h-5 w-5 rounded-full", fill)}
      />
    </span>
  );
}

/** Five stages on a path that draws itself as you scroll, lighting each node. */
export function FlowPath({ stages }: { stages: Stage[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.55"],
  });
  const d = buildPath(stages.length);

  return (
    <ol ref={ref} className="relative">
      {/* Mobile: a straight rail on the left. */}
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-5 w-0.5 -translate-x-1/2 bg-rule md:hidden"
      />
      <motion.span
        aria-hidden
        style={reduced ? undefined : { scaleY: scrollYProgress }}
        className="absolute top-0 bottom-0 left-[calc(1.25rem_-_1px)] w-0.5 origin-top bg-cobalt md:hidden"
      />

      {/* Desktop: a winding path. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        fill="none"
      >
        <path
          d={d}
          stroke="var(--rule)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d={d}
          stroke="#2b59ff"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : scrollYProgress }}
        />
      </svg>

      {stages.map((stage, index) => (
        <li
          key={stage.id}
          className="relative flex min-h-[7.5rem] items-center pl-14 md:h-44 md:pl-0"
        >
          <Node
            index={index}
            total={stages.length}
            progress={scrollYProgress}
            reduced={reduced}
          />
          <div
            className={cn(
              "md:w-[32%]",
              index % 2 === 0 ? "md:text-right" : "md:ml-[68%]",
            )}
          >
            <p className="text-sm font-bold text-muted">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-2" aria-hidden>
                /
              </span>
              {stage.duration}
            </p>
            <h3 className="mt-1 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold tracking-[-0.045em]">
              {stage.title}
            </h3>
          </div>
        </li>
      ))}
    </ol>
  );
}
