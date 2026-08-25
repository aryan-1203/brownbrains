"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useTone } from "@/components/tone/ToneProvider";
import { setLenis } from "@/lib/lenis-store";

/** Inertial scrolling, switched off entirely for reduced-motion visitors. */
export function SmoothScroll() {
  const { reduced } = useTone();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      // Native scrolling on touch feels better than emulated inertia.
      smoothWheel: true,
      syncTouch: false,
    });

    setLenis(lenis);

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Let in-page anchors keep working while Lenis owns the scroll position.
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
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
