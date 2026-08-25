"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { inView, staggerParent, wordMask } from "@/lib/motion";

/** Hoisted so a re-render never swaps the component identity and remounts. */
const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
} as const;

type WordRevealProps = {
  text: string;
  as?: keyof typeof tags;
  className?: string;
  /** Seconds between each word. */
  stagger?: number;
  delay?: number;
  /** Words to paint in the accent colour, matched case-insensitively. */
  accent?: string[];
};

/**
 * Splits a string into words and slides each one up from behind a mask.
 * Rendered as one accessible string, with the visual split hidden from AT.
 */
export function WordReveal({
  text,
  as = "h2",
  className,
  stagger = 0.055,
  delay = 0,
  accent = [],
}: WordRevealProps) {
  const words = text.split(" ");
  const accentSet = new Set(accent.map((word) => word.toLowerCase()));
  const MotionTag = tags[as];

  return (
    <MotionTag
      className={cn("flex flex-wrap", className)}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      aria-label={text}
    >
      {words.map((word, index) => {
        const bare = word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
        return (
          <span
            key={`${word}-${index}`}
            aria-hidden
            className="inline-flex overflow-hidden pb-[0.12em]"
          >
            <motion.span
              variants={wordMask}
              className={cn(
                "inline-block pr-[0.25em]",
                accentSet.has(bare) && "text-ember italic",
              )}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
