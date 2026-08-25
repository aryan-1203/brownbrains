"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { inView, riseIn, staggerParent } from "@/lib/motion";
import { WordReveal } from "@/components/fx/WordReveal";

const halves = [
  {
    id: "human",
    kicker: "The human half",
    title: "Positioning, story, demand",
    body: "Someone has to decide what you stand for and why anyone should care. That work is judgement, taste and thirty years of watching what actually moves a market.",
    points: [
      "Brand strategy and messaging",
      "Campaign planning and leadership",
      "Market and customer research",
    ],
  },
  {
    id: "machine",
    kicker: "The machine half",
    title: "Systems, code, automation",
    body: "Then someone has to build it, instrument it and make it repeatable. That work is engineering, and it is done in the same room as the strategy rather than thrown over a wall.",
    points: [
      "Web and mobile product builds",
      "AI workflows and integrations",
      "Analytics and reporting pipelines",
    ],
  },
];

export function DualBrain() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 55%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="shell">
      <div className="max-w-4xl">
        <p className="mono-label">03 / Why two</p>
        <WordReveal
          text="Most studios sell you one half and outsource the other."
          className="mt-5 text-title"
          accent={["outsource"]}
        />
        <p className="lead mt-7 max-w-2xl">
          The strategy deck comes from one company, the build comes from another,
          and the gap between them is where budgets quietly disappear. We removed
          the gap with two dedicated fronts — human and machine — each backed
          by a team that owns its half.
        </p>
      </div>

      <div className="relative mt-16 grid gap-6 lg:mt-24 lg:grid-cols-2 lg:gap-20">
        {/* Connector, drawn as the section arrives */}
        <svg
          aria-hidden
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-1/2 left-1/2 hidden h-16 w-24 -translate-x-1/2 -translate-y-1/2 lg:block"
        >
          <motion.path
            d="M2 20 C 60 20, 60 4, 100 20 S 140 36, 198 20"
            fill="none"
            stroke="var(--color-ember)"
            strokeWidth="1.4"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>

        {halves.map((half, index) => (
          <motion.article
            key={half.id}
            variants={staggerParent(0.08, index * 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className={cn(
              "relative flex flex-col justify-between rounded-2xl border p-7 md:p-10",
              half.id === "machine"
                ? "tone-machine border-transparent bg-bg text-ink"
                : "border-rule bg-surface",
            )}
          >
            <div>
              <motion.p variants={riseIn} className="mono-label">
                {half.kicker}
              </motion.p>
              <motion.h3
                variants={riseIn}
                className="mt-4 text-heading leading-[1.05]"
              >
                {half.title}
              </motion.h3>
              <motion.p
                variants={riseIn}
                className="mt-5 text-[0.975rem] leading-[1.65] text-muted"
              >
                {half.body}
              </motion.p>
            </div>

            <motion.ul
              variants={riseIn}
              className="mt-8 space-y-2 border-t border-rule pt-6"
            >
              {half.points.map((point) => (
                <li
                  key={point}
                  className="flex items-baseline gap-3 font-mono text-[0.72rem] tracking-[0.04em] text-muted"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 h-1 w-1 shrink-0 rounded-full",
                      half.id === "machine" ? "bg-filament" : "bg-ember",
                    )}
                  />
                  {point}
                </li>
              ))}
            </motion.ul>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
