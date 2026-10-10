"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import type { Service, ServiceSide } from "@/content/services";
import { cn } from "@/lib/cn";

const sideLabel: Record<ServiceSide, string> = {
  human: "Marketing",
  machine: "Engineering",
  both: "Both halves",
};

const sideCard: Record<ServiceSide, string> = {
  human: "bg-saffron text-midnight",
  machine: "bg-cobalt text-white",
  both: "bg-chalk text-midnight",
};

/** The card's emblem: which half (or both) of the brain this work uses. */
function Emblem({ side }: { side: ServiceSide }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      className="h-16 w-16 shrink-0 md:h-24 md:w-24"
    >
      <path
        d="M30 4a28 28 0 0 0 0 56Z"
        fill={
          side === "machine"
            ? "rgba(255,255,255,0.22)"
            : side === "human"
              ? "#0a1733"
              : "#ffb224"
        }
      />
      <path
        d="M34 4a28 28 0 0 1 0 56Z"
        fill={
          side === "human"
            ? "rgba(10,23,51,0.18)"
            : side === "machine"
              ? "#ffffff"
              : "#2b59ff"
        }
      />
    </svg>
  );
}

function Card({
  service,
  index,
  total,
  progress,
  reduced,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Each card settles, then sinks back and shrinks as later cards land on it.
  const start = index / total;
  const scale = useTransform(
    progress,
    [start, 1],
    [1, 1 - (total - index) * 0.035],
  );
  const tilt =
    service.side === "human" ? -5 : service.side === "machine" ? 5 : 0;
  const rotate = useTransform(
    progress,
    [Math.max(0, start - 1 / total), start],
    [tilt, 0],
  );

  return (
    <li
      className="sticky mb-[14vh] last:mb-0 md:mb-[22vh]"
      style={{ top: `calc(6.5rem + ${index * 0.9}rem)` }}
    >
      <motion.article
        style={reduced ? undefined : { scale, rotate }}
        className={cn(
          "relative flex min-h-[15rem] origin-top flex-col justify-between gap-8 overflow-hidden rounded-card p-6 shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.45)] md:min-h-[19rem] md:p-10",
          sideCard[service.side],
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-[0.75rem] font-bold tracking-[0.14em] uppercase opacity-80">
            {String(index + 1).padStart(2, "0")} · {sideLabel[service.side]}
          </p>
          <Emblem side={service.side} />
        </div>
        <div>
          <h3 className="font-display text-[clamp(2rem,4.6vw,3.75rem)] font-extrabold tracking-[-0.045em]">
            {service.title}
          </h3>
          <p className="mt-3 max-w-md text-lead font-medium opacity-90">
            {service.blurb}
          </p>
        </div>
      </motion.article>
    </li>
  );
}

/**
 * Seven cards that land on each other like a deck being dealt. Marketing cards
 * swing in from the left, engineering cards from the right, shared ones straight.
 */
export function ServiceDeck({ services }: { services: Service[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.35", "end end"],
  });

  return (
    <ol ref={ref} className="relative">
      {services.map((service, index) => (
        <Card
          key={service.slug}
          service={service}
          index={index}
          total={services.length}
          progress={scrollYProgress}
          reduced={reduced}
        />
      ))}
    </ol>
  );
}
