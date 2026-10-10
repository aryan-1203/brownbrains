"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * "404" where the zero is our mark, except the two halves keep missing each
 * other: they slide in, overshoot past one another on different heights, and
 * drift back to try again.
 */
export function MissedHalves() {
  const reduced = useReducedMotion();

  const loop = {
    duration: 3.2,
    repeat: Infinity,
    repeatDelay: 0.6,
    ease: [0.65, 0, 0.35, 1] as const,
    times: [0, 0.35, 0.5, 0.62, 1],
  };

  return (
    <svg
      aria-hidden
      viewBox="0 0 420 180"
      className="h-auto w-full max-w-[34rem] overflow-visible"
    >
      <text
        x="0"
        y="150"
        className="fill-chalk font-display"
        style={{ fontSize: 176, fontWeight: 800, letterSpacing: "-0.05em" }}
      >
        4
      </text>
      <text
        x="312"
        y="150"
        className="fill-chalk font-display"
        style={{ fontSize: 176, fontWeight: 800, letterSpacing: "-0.05em" }}
      >
        4
      </text>

      {/* Saffron half: sits high, slides right, overshoots, drifts back. */}
      <motion.path
        d="M206 30a58 58 0 0 0 0 116Z"
        fill="#ffb224"
        initial={false}
        animate={
          reduced
            ? { x: -10, y: -14 }
            : {
                x: [-22, 6, 14, 6, -22],
                y: [-14, -14, -18, -14, -14],
                rotate: [0, 0, -8, 0, 0],
              }
        }
        transition={reduced ? { duration: 0 } : loop}
        style={{ transformOrigin: "206px 88px" }}
      />
      {/* Cobalt half: sits low, mirrors the saffron move. */}
      <motion.path
        d="M214 30a58 58 0 0 1 0 116Z"
        fill="#2b59ff"
        initial={false}
        animate={
          reduced
            ? { x: 10, y: 14 }
            : {
                x: [22, -6, -14, -6, 22],
                y: [14, 14, 18, 14, 14],
                rotate: [0, 0, 8, 0, 0],
              }
        }
        transition={reduced ? { duration: 0 } : loop}
        style={{ transformOrigin: "214px 88px" }}
      />
    </svg>
  );
}
