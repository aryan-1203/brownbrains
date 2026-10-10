"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";

/** A rising saffron trend line that draws itself as the proof band scrolls by. */
export function ProofLine() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.35"],
  });
  const length = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dot = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 opacity-90 md:h-56"
    >
      <svg
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        className="h-full w-full"
        fill="none"
      >
        <motion.path
          d="M0 92 C40 90 60 80 90 82 S140 60 170 66 S220 40 250 46 S310 18 340 22 S385 6 400 4"
          stroke="#ffb224"
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reduced ? 1 : length }}
        />
        <motion.circle
          cx="398"
          cy="5"
          r="5"
          fill="#ffb224"
          style={{ opacity: reduced ? 1 : dot }}
        />
      </svg>
    </div>
  );
}
