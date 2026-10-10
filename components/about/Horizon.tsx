"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/cn";

/** A saffron-to-cobalt horizon line that draws itself as it scrolls through. */
export function Horizon({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  return (
    <div ref={ref} aria-hidden className={cn("h-3", className)}>
      <svg
        viewBox="0 0 1000 12"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="about-horizon" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffb224" />
            <stop offset="0.5" stopColor="#ffb224" />
            <stop offset="0.5" stopColor="#2b59ff" />
            <stop offset="1" stopColor="#2b59ff" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 6 H1000"
          stroke="url(#about-horizon)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          vectorEffect="non-scaling-stroke"
          style={reduced ? undefined : { pathLength: scrollYProgress }}
        />
      </svg>
    </div>
  );
}
