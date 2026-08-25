"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  type ServiceFilter,
  serviceFilters,
  services,
} from "@/content/services";
import { cn } from "@/lib/cn";
import { easeOutExpo, inView, riseIn, staggerParent } from "@/lib/motion";
import { WordReveal } from "@/components/fx/WordReveal";

export function CapabilityMatrix() {
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const [open, setOpen] = useState<string | null>(services[0].slug);

  const visible = services.filter((service) =>
    filter === "all" ? true : service.side === filter || service.side === "both",
  );

  return (
    <div className="shell">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono-label">02 / Capabilities</p>
          <WordReveal
            text="Seven things, one team"
            className="mt-5 max-w-2xl text-title"
            accent={["team"]}
          />
        </div>

        <div
          role="group"
          aria-label="Filter capabilities"
          className="flex shrink-0 gap-2"
        >
          {serviceFilters.map((option) => {
            const active = filter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={active}
                className={cn(
                  "relative rounded-full px-4 py-2 font-mono text-[0.68rem] tracking-[0.12em] uppercase transition-colors duration-300",
                  active ? "text-bg" : "text-muted hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : (
                  <span className="absolute inset-0 rounded-full border border-rule" />
                )}
                <span className="relative z-10">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul
        className="mt-14 border-t border-rule"
        variants={staggerParent(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((service, index) => {
            const expanded = open === service.slug;
            return (
              <motion.li
                key={service.slug}
                layout
                variants={riseIn}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.5, ease: easeOutExpo }}
                className="group relative overflow-hidden border-b border-rule"
                onMouseEnter={() => setOpen(service.slug)}
                onFocus={() => setOpen(service.slug)}
              >
                {/* Ember bleed that fills the row from the left on hover */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 -z-10 w-full origin-left bg-surface transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                    expanded ? "scale-x-100" : "scale-x-0",
                  )}
                />

                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : service.slug)}
                  className="flex w-full items-baseline gap-5 px-1 py-6 text-left md:gap-8 md:px-4"
                >
                  <span className="w-8 shrink-0 font-mono text-[0.7rem] text-faint tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1">
                    <span className="block font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none tracking-[-0.025em]">
                      {service.title}
                    </span>
                    <span
                      className={cn(
                        "mt-2 block max-w-xl text-sm text-muted transition-opacity duration-500 md:hidden",
                      )}
                    >
                      {service.blurb}
                    </span>
                  </span>

                  <span className="hidden max-w-[19rem] flex-1 text-sm text-muted md:block">
                    {service.blurb}
                  </span>

                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase transition-colors duration-500",
                      service.side === "human" && "border-rule text-muted",
                      service.side === "machine" && "border-rule text-muted",
                      service.side === "both" && "border-signal/60 text-signal-soft",
                    )}
                  >
                    {service.side === "both" ? "Both" : service.side}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: easeOutExpo }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 px-1 pb-8 md:grid-cols-[1.4fr_1fr] md:px-4 md:pl-[4.25rem]">
                        <div>
                          <p className="max-w-2xl text-[0.975rem] leading-[1.6] text-muted">
                            {service.detail}
                          </p>
                          <Link
                            href={`/services#${service.slug}`}
                            className="mt-5 inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-ember uppercase"
                            data-cursor-label="open"
                          >
                            <span className="link-underline">Read more</span>
                            <span aria-hidden>&rarr;</span>
                          </Link>
                        </div>

                        <div className="rounded-lg border border-rule bg-bg/40 p-5">
                          <p className="mono-label">Outcome</p>
                          <p className="mt-2 font-display text-lg leading-snug">
                            {service.outcome}
                          </p>
                          <ul className="mt-4 space-y-1.5 border-t border-rule pt-4">
                            {service.deliverables.slice(0, 3).map((item) => (
                              <li
                                key={item}
                                className="flex gap-2 font-mono text-[0.68rem] text-muted"
                              >
                                <span aria-hidden className="text-filament">
                                  +
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <p className="mt-8 font-mono text-[0.68rem] tracking-[0.12em] text-faint uppercase">
        {visible.length} of {services.length} shown
      </p>
    </div>
  );
}
