"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { cn } from "@/lib/cn";

/**
 * Two oversized rows of disciplines sliding in opposite directions with the
 * scroll. Purely visual: the same list is exposed once to assistive tech.
 */
export function RoleRows({ roles }: { roles: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-28%", "0%"]);

  const half = Math.ceil(roles.length / 2);
  const rows = [
    { items: [...roles.slice(0, half), ...roles.slice(0, half)], x: forward, solid: true },
    { items: [...roles.slice(half), ...roles.slice(half)], x: backward, solid: false },
  ];

  return (
    <div ref={ref} className="overflow-hidden py-2">
      <ul className="sr-only">
        {roles.map((role) => (
          <li key={role}>{role}</li>
        ))}
      </ul>
      <div aria-hidden className="space-y-3 md:space-y-5">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="flex w-max items-center gap-5 md:gap-8"
            style={reduced ? undefined : { x: row.x }}
          >
            {row.items.map((role, index) => (
              <span key={`${role}-${index}`} className="flex items-center gap-5 md:gap-8">
                <span
                  className={cn(
                    "font-display text-display leading-none font-black tracking-[-0.045em] whitespace-nowrap",
                    row.solid
                      ? "text-ink"
                      : "text-transparent [-webkit-text-stroke:2px_var(--color-midnight)]",
                  )}
                >
                  {role}
                </span>
                <span
                  className={cn(
                    "h-[0.45em] w-[0.45em] shrink-0 rounded-full text-display",
                    (index + rowIndex) % 2 === 0 ? "bg-cobalt" : "bg-midnight",
                  )}
                />
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
