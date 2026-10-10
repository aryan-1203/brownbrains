"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { services, type ServiceSide } from "@/content/services";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";

/*
 * Hero graphic: two overlapping fields. Marketing on the saffron circle,
 * engineering on the cobalt one, and the services that need both sit in the
 * midnight lens where they meet. Every chip is a jump link to its row below.
 *
 * Geometry (viewBox 600 x 340): circles at x 220 and 380, r 170. They cross
 * at (300, 20) and (300, 320), so the lens spans x 210 to 390.
 */

const zones: {
  side: ServiceSide;
  label: string;
  /** Column position as % of the box, matched to the circle geometry. */
  left: string;
  width: string;
  chip: string;
}[] = [
  {
    side: "human",
    label: "Marketing",
    left: "8%",
    width: "27%",
    chip: "bg-midnight/8 text-midnight hover:bg-midnight hover:text-saffron",
  },
  {
    side: "both",
    label: "Both",
    left: "35%",
    width: "30%",
    chip: "bg-white/12 text-white hover:bg-saffron hover:text-midnight",
  },
  {
    side: "machine",
    label: "Engineering",
    left: "65%",
    width: "27%",
    chip: "bg-midnight/20 text-white hover:bg-white hover:text-cobalt-deep",
  },
];

const enter = (delay: number, from: Record<string, number>): Variants => ({
  hidden: { opacity: 0, ...from },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: easeOutExpo, delay },
  },
});

const chipIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo, delay: 0.75 + i * 0.07 },
  }),
};

const fillBox = { transformBox: "fill-box", transformOrigin: "center" } as const;

export function ServicesSpectrum({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={cn("relative w-full", className)}
      initial={reduced ? false : "hidden"}
      animate="show"
    >
      <div className="relative aspect-[600/340] w-full">
        <svg
          aria-hidden
          focusable="false"
          viewBox="0 0 600 340"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <motion.circle
            cx={220}
            cy={170}
            r={170}
            className="fill-saffron"
            variants={enter(0.1, { x: -70 })}
          />
          <motion.circle
            cx={380}
            cy={170}
            r={170}
            className="fill-cobalt"
            variants={enter(0.2, { x: 70 })}
          />
          <motion.path
            d="M300 20A170 170 0 0 1 300 320A170 170 0 0 1 300 20Z"
            className="fill-midnight"
            style={fillBox}
            variants={enter(0.55, { scale: 0.5 })}
          />
          {/* Fine orbit that ties both halves together. */}
          <motion.ellipse
            cx={300}
            cy={170}
            rx={292}
            ry={60}
            fill="none"
            className="stroke-midnight/25"
            strokeWidth={1.5}
            strokeDasharray="4 7"
            variants={enter(0.9, { scale: 0.85 })}
            style={fillBox}
          />
        </svg>

        {zones.map((zone) => (
          <div
            key={zone.side}
            className="absolute inset-y-0 flex flex-col items-center justify-center gap-1.5 px-1 md:gap-2"
            style={{ left: zone.left, width: zone.width }}
          >
            <motion.p
              variants={enter(0.6, { y: 10 })}
              className={cn(
                "text-center font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase sm:text-xs",
                zone.side === "human" ? "text-midnight" : "text-white",
              )}
            >
              {zone.label}
            </motion.p>

            {/* Chips need room; under sm the list below the graphic takes over. */}
            <ul className="hidden flex-col items-center gap-1.5 sm:flex">
              {services
                .filter((service) => service.side === zone.side)
                .map((service) => (
                  <motion.li key={service.slug} variants={chipIn} custom={services.indexOf(service)}>
                    <Link
                      href={`#${service.slug}`}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-3.5 text-center font-display text-[0.82rem] leading-tight font-semibold tracking-[-0.01em] transition-colors duration-200 md:text-sm",
                        zone.chip,
                      )}
                    >
                      {service.title}
                    </Link>
                  </motion.li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Small screens: the same jump links, grouped, under the graphic. */}
      <ul className="mt-6 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:hidden">
        {services.map((service, i) => (
          <motion.li key={service.slug} variants={chipIn} custom={i}>
            <Link
              href={`#${service.slug}`}
              className="flex min-h-12 items-center gap-3 rounded-2xl border border-rule bg-surface px-4 font-display text-[0.95rem] font-semibold"
            >
              <span
                aria-hidden
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  service.side === "human" && "bg-saffron",
                  service.side === "machine" && "bg-cobalt",
                  service.side === "both" &&
                    "bg-[linear-gradient(90deg,var(--color-saffron)_50%,var(--color-cobalt)_50%)]",
                )}
              />
              {service.title}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
