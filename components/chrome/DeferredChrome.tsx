"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SmoothScroll } from "./SmoothScroll";

const GrainOverlay = dynamic(
  () => import("./GrainOverlay").then((m) => ({ default: m.GrainOverlay })),
  { ssr: false },
);

/**
 * Smooth scroll mounts immediately so scroll-linked Motion animations stay
 * in sync from first paint. Grain is non-critical and waits for idle.
 */
export function DeferredChrome() {
  const [grain, setGrain] = useState(false);

  useEffect(() => {
    const enable = () => setGrain(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(enable, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SmoothScroll />
      {grain ? <GrainOverlay /> : null}
    </>
  );
}
