"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { principles } from "@/content/process";

type Principle = (typeof principles)[number];

/** One rule. Sharpens as it crosses the middle of the screen, dims as it leaves. */
function FocusItem({
  principle,
  index,
}: {
  principle: Principle;
  index: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0.15, 0.4, 0.62, 0.9],
    [0.18, 1, 1, 0.3],
  );
  const x = useTransform(scrollYProgress, [0.15, 0.4], [36, 0]);
  const dot = useTransform(
    scrollYProgress,
    [0.3, 0.42, 0.6, 0.72],
    [0, 1, 1, 0],
  );

  return (
    <motion.li
      ref={ref}
      style={{ opacity, x }}
      className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-rule py-8 md:grid-cols-[4.5rem_1fr] md:py-10"
    >
      <span className="relative font-display text-2xl font-bold tabular-nums md:text-3xl">
        {String(index + 1).padStart(2, "0")}
        <motion.span
          aria-hidden
          style={{ scale: dot }}
          className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cobalt"
        />
      </span>
      <div>
        <h3 className="text-title">{principle.title}</h3>
        <p className="mt-2 text-lg font-medium text-muted">{principle.body}</p>
      </div>
    </motion.li>
  );
}

export function PrinciplesFocus() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <ol>
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-rule py-8 md:grid-cols-[4.5rem_1fr] md:py-10"
          >
            <span className="font-display text-2xl font-bold tabular-nums md:text-3xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-title">{p.title}</h3>
              <p className="mt-2 text-lg font-medium text-muted">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="overflow-x-clip">
      {principles.map((p, i) => (
        <FocusItem key={p.title} principle={p} index={i} />
      ))}
    </ol>
  );
}
