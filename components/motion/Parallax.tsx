"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useTransform } from "@/lib/use-transform";

/** Drifts its children vertically against the scroll. `speed` in px of travel. */
export function Parallax({
  children,
  speed = 80,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
