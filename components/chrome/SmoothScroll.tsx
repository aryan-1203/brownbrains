"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { cancelFrame, frame } from "motion";
import { useReducedMotion } from "motion/react";
import { setLenis } from "@/lib/lenis-store";

/**
 * Inertial scrolling. Driven by Motion's frame loop so useScroll / whileInView
 * stay in lockstep — a separate rAF often desyncs under production load.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });

    setLenis(lenis);

    const update = ({ timestamp }: { timestamp: number }) => {
      lenis.raf(timestamp);
    };
    frame.update(update, true);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -96 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelFrame(update);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
