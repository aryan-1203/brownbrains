"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useTone } from "@/components/tone/ToneProvider";

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({
  value,
  suffix = "",
  duration = 1500,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-15% 0px" });
  const { reduced } = useTone();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible || reduced) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, duration, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {reduced ? value : display}
      {suffix}
    </span>
  );
}
