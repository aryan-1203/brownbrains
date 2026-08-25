"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { cn } from "@/lib/cn";
import { useTone } from "@/components/tone/ToneProvider";

/** Keeps a value inside [min, max) so the duplicated track loops seamlessly. */
function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

type MarqueeProps = {
  items: readonly string[];
  /** Percent of the track travelled per second at rest. */
  speed?: number;
  direction?: 1 | -1;
  className?: string;
};

/**
 * Ticker whose speed and direction are pushed around by scroll velocity —
 * scroll down and it accelerates, scroll up and it reverses.
 */
export function Marquee({
  items,
  speed = 2.4,
  direction = 1,
  className,
}: MarqueeProps) {
  const baseX = useMotionValue(0);
  const heading = useRef<number>(direction);
  const hostRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const { reduced } = useTone();

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 48,
    stiffness: 380,
  });
  const velocityFactor = useTransform(smoothVelocity, [-2200, 2200], [-4, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduced || !visibleRef.current) return;
    let moveBy = heading.current * -speed * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) heading.current = -direction;
    else if (factor > 0) heading.current = direction;
    moveBy += moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  const track = [...items, ...items];

  return (
    <div
      ref={hostRef}
      className={cn("relative flex overflow-hidden select-none", className)}
      aria-hidden
    >
      <motion.div style={{ x }} className="flex shrink-0 flex-nowrap">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10"
          >
            <span className="font-display text-[clamp(1.6rem,4vw,3.1rem)] leading-none tracking-[-0.02em] whitespace-nowrap">
              {item}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
