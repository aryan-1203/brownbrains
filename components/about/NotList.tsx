"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";

export type NotItem = { not: string; instead: string };

function Row({ item }: { item: NotItem }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.5"],
  });
  const strike = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0.75]);
  const insteadOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);
  const insteadX = useTransform(scrollYProgress, [0.45, 1], [-24, 0]);

  return (
    <li
      ref={ref}
      className="grid items-baseline gap-x-10 gap-y-2 border-t border-rule py-6 md:grid-cols-[1fr_1.1fr] md:py-8"
    >
      <motion.p
        className="relative w-fit font-display text-heading font-bold text-muted"
        style={reduced ? { opacity: 0.75 } : { opacity: fade }}
      >
        <span className="sr-only">Not: </span>
        {item.not}
        <motion.span
          aria-hidden
          className="absolute top-1/2 -right-1 -left-1 h-[3px] origin-left rounded-full bg-accent"
          style={{ scaleX: reduced ? 1 : strike }}
        />
      </motion.p>
      <motion.p
        className="flex items-baseline gap-3 text-lead font-semibold text-ink"
        style={reduced ? undefined : { opacity: insteadOpacity, x: insteadX }}
      >
        <span aria-hidden className="text-accent">
          →
        </span>
        <span>
          <span className="sr-only">Instead: </span>
          {item.instead}
        </span>
      </motion.p>
    </li>
  );
}

/** "What we are not" rows: each cliché is struck through as it scrolls up. */
export function NotList({ items }: { items: NotItem[] }) {
  return (
    <ul className="border-b border-rule">
      {items.map((item) => (
        <Row key={item.not} item={item} />
      ))}
    </ul>
  );
}
