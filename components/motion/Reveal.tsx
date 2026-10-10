"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { easeOutExpo, inView } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled on entry, in px. */
  y?: number;
  x?: number;
  as?: "div" | "li" | "section" | "p" | "span";
};

/** Fades and rises its children into place the first time they enter view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  x = 0,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={inView}
      transition={{ duration: 0.85, delay, ease: easeOutExpo }}
    >
      {children}
    </Tag>
  );
}
