"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";

const R = 150;
const C = 200;

/** Left / right half-disc paths around the centre. */
const leftHalf = `M${C},${C - R} A${R},${R} 0 0 0 ${C},${C + R} Z`;
const rightHalf = `M${C},${C - R} A${R},${R} 0 0 1 ${C},${C + R} Z`;

/** Concentric left-facing arcs: marketing as broadcast. */
const arcs = [40, 75, 110].map(
  (r) => `M${C},${C - r} A${r},${r} 0 0 0 ${C},${C + r}`,
);

/** A small circuit of nodes inside the engineering half. */
const nodes: [number, number][] = [
  [238, 120],
  [292, 156],
  [256, 206],
  [318, 236],
  [250, 286],
];
const circuit = `M${nodes.map(([x, y]) => `${x},${y}`).join(" L")}`;

/**
 * Two half-discs (saffron marketing, cobalt engineering) that close into one
 * circle on load and drift apart again as the hero scrolls away.
 * `mode="close-on-scroll"` instead starts apart and closes as it scrolls in.
 */
export function HalvesMark({
  className,
  mode = "hero",
}: {
  className?: string;
  mode?: "hero" | "close-on-scroll";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const hero = mode === "hero";

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: hero ? ["start start", "end start"] : ["start end", "center 0.6"],
  });

  // Hero: 0 → together, 1 → apart. Closing: 0 → apart, 1 → together.
  const spread = useTransform(scrollYProgress, [0, 1], hero ? [0, 1] : [1, 0]);
  const leftX = useTransform(spread, [0, 1], [0, -46]);
  const rightX = useTransform(spread, [0, 1], [0, 46]);
  const leftRotate = useTransform(spread, [0, 1], [0, -14]);
  const rightRotate = useTransform(spread, [0, 1], [0, 14]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, hero ? 90 : -60]);
  const seamOpacity = useTransform(spread, [0, 0.4], [1, 0]);

  const still = reduced ?? false;
  const enter = hero && !still;

  return (
    <div ref={ref} aria-hidden className={cn("relative", className)}>
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
        {/* Orbit ring */}
        <motion.g
          style={still ? undefined : { rotate: ringRotate, originX: "50%", originY: "50%" }}
        >
          <circle
            cx={C}
            cy={C}
            r={186}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="1.5"
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
          <circle cx={C} cy={C - 186} r="7" className="fill-saffron" />
          <circle cx={C} cy={C + 186} r="7" className="fill-cobalt" />
        </motion.g>

        {/* Marketing half */}
        <motion.g
          style={
            still
              ? undefined
              : { x: leftX, rotate: leftRotate, originX: "100%", originY: "50%" }
          }
        >
          <motion.g
            initial={enter ? { x: -70, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: easeOutExpo }}
          >
            <path d={leftHalf} className="fill-saffron" />
            {arcs.map((d, index) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="#0a1733"
                strokeOpacity="0.55"
                strokeWidth="5"
                strokeLinecap="round"
                initial={enter ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.7 + index * 0.12,
                  ease: easeOutExpo,
                }}
              />
            ))}
            <circle cx={C - 14} cy={C} r="9" fill="#0a1733" />
          </motion.g>
        </motion.g>

        {/* Engineering half */}
        <motion.g
          style={
            still
              ? undefined
              : { x: rightX, rotate: rightRotate, originX: "0%", originY: "50%" }
          }
        >
          <motion.g
            initial={enter ? { x: 70, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: easeOutExpo }}
          >
            <path d={rightHalf} className="fill-cobalt" />
            <motion.path
              d={circuit}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.85"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={enter ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.75, ease: easeOutExpo }}
            />
            {nodes.map(([x, y], index) => (
              <motion.circle
                key={`${x}-${y}`}
                cx={x}
                cy={y}
                r="8"
                fill="#0a1733"
                stroke="#ffffff"
                strokeWidth="3"
                initial={enter ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.9 + index * 0.1,
                  ease: easeOutExpo,
                }}
              />
            ))}
            <circle cx={C + 14} cy={C} r="9" fill="#ffffff" />
          </motion.g>
        </motion.g>

        {/* The seam: where the halves meet */}
        <motion.line
          x1={C}
          y1={C - R - 14}
          x2={C}
          y2={C + R + 14}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={still ? undefined : { opacity: seamOpacity }}
        />
      </svg>
    </div>
  );
}
