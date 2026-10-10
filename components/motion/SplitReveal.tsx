"use client";

import { motion, useReducedMotion } from "motion/react";
import { inView, staggerParent, wordMask } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  className?: string;
  /** Words (exact match, punctuation included) painted in the accent colour. */
  accent?: string[];
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  /** Animate on mount rather than on scroll into view (use for heroes). */
  immediate?: boolean;
};

/** Headline whose words slide up out of a mask, one after another. */
export function SplitReveal({
  text,
  className,
  accent = [],
  as = "h2",
  delay = 0,
  immediate = false,
}: Props) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag
      className={className}
      aria-label={text}
      variants={staggerParent(0.06, delay)}
      initial={reduced ? false : "hidden"}
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: inView })}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            variants={wordMask}
            className={cn(
              "inline-block",
              accent.includes(word) && "text-accent",
            )}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
