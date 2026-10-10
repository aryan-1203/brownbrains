"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";

/** Archimedean spiral, outward from the centre, in a 400 box. */
const SPIRAL = (() => {
  const parts: string[] = [];
  const turns = 5.4 * Math.PI;
  for (let t = 0; t <= turns; t += 0.12) {
    const r = 4 + 10.6 * t;
    parts.push(
      `${parts.length ? "L" : "M"}${(200 + r * Math.cos(t)).toFixed(1)} ${(200 + r * Math.sin(t)).toFixed(1)}`,
    );
  }
  return parts.join(" ");
})();

/** The compounding spiral from the machine, drawn out by scroll as a closing flourish. */
export function ClosingSpiral() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 45%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.05, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-60, 0]);

  return (
    <div ref={ref}>
      <motion.svg
        aria-hidden
        viewBox="0 0 400 400"
        className="h-auto w-full"
        style={reduced ? undefined : { rotate }}
      >
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
          strokeDasharray="3 9"
        />
        <motion.path
          d={SPIRAL}
          fill="none"
          stroke="#ffb224"
          strokeWidth="9"
          strokeLinecap="round"
          style={reduced ? undefined : { pathLength }}
        />
        <circle cx="200" cy="200" r="12" fill="#0a1733" />
      </motion.svg>
    </div>
  );
}
