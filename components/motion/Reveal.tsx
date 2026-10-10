"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { easeOutExpo, inView } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled on entry, in px. */
  y?: number;
  x?: number;
  as?: "div" | "li" | "section" | "p" | "span";
  /** First-screen content: animate with CSS on load instead of waiting for
   *  hydration and a scroll trigger. */
  immediate?: boolean;
};

/** Fades and rises its children into place the first time they enter view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  x = 0,
  as = "div",
  immediate = false,
}: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (immediate) {
    const Plain = as;
    return (
      <Plain
        className={cn("css-rise", className)}
        style={{ "--d": `${Math.min(delay, 0.2)}s`, "--rise": `${y}px` } as CSSProperties}
      >
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={inView}
      transition={{ duration: 0.6, delay: Math.min(delay, 0.2), ease: easeOutExpo }}
    >
      {children}
    </Tag>
  );
}
