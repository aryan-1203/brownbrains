"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin saffron bar across the top that fills as the page is read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-saffron"
    />
  );
}
