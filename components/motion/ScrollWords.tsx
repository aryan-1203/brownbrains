"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { cn } from "@/lib/cn";

function Word({
  word,
  index,
  total,
  progress,
  highlight,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  highlight: boolean;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={cn("inline", highlight && "text-accent")}
    >
      {word}{" "}
    </motion.span>
  );
}

/**
 * A paragraph that "lights up" word by word as the reader scrolls through it,
 * so a statement is read at the pace it is scrolled.
 */
export function ScrollWords({
  text,
  className,
  accent = [],
}: {
  text: string;
  className?: string;
  accent?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden>
        {words.map((word, index) => (
          <Word
            key={`${word}-${index}`}
            word={word}
            index={index}
            total={words.length}
            progress={scrollYProgress}
            highlight={accent.includes(word)}
          />
        ))}
      </span>
    </p>
  );
}
