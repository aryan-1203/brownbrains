"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SmoothScroll = dynamic(
  () => import("./SmoothScroll").then((m) => ({ default: m.SmoothScroll })),
  { ssr: false },
);
const GrainOverlay = dynamic(
  () => import("./GrainOverlay").then((m) => ({ default: m.GrainOverlay })),
  { ssr: false },
);
const CursorRing = dynamic(
  () => import("./CursorRing").then((m) => ({ default: m.CursorRing })),
  { ssr: false },
);

/** Non-critical chrome deferred until the browser is idle so first paint stays light. */
export function DeferredChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enable = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(enable, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <>
      <SmoothScroll />
      <GrainOverlay />
      <CursorRing />
    </>
  );
}
