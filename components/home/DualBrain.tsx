"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { inView, riseIn, staggerParent } from "@/lib/motion";
import { WordReveal } from "@/components/fx/WordReveal";

const pillars = [
  {
    id: "marketing",
    kicker: "Marketing",
    title: "Positioning, story, demand",
    body: "What you stand for, who cares, and the campaigns that move a market — led by decades of brand work.",
    points: [
      "Brand strategy and messaging",
      "Campaign planning and leadership",
      "Market and customer research",
    ],
  },
  {
    id: "engineering",
    kicker: "Engineering",
    title: "Systems, code, automation",
    body: "Built, instrumented, and made repeatable — in the same room as the strategy, not thrown over a wall.",
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
      <div className="max-w-3xl">
        <p className="mono-label">03 / Why us</p>
        <WordReveal
          text="Most founders juggle agencies and freelancers."
          className="mt-5 text-title"
          accent={["juggle"]}
        />
        <p className="lead mt-6 max-w-xl">
          Strategy from one place, build from another — that gap eats budget.
          We close it: marketing and engineering on one team.
        </p>
      </div>

      <div className="relative mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-16">
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

        {pillars.map((pillar, index) => (
          <motion.article
            key={pillar.id}
            variants={staggerParent(0.08, index * 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className={cn(
              "relative flex flex-col justify-between rounded-2xl border p-7 md:p-10",
              pillar.id === "engineering"
                ? "tone-machine border-transparent bg-bg text-ink"
                : "border-rule bg-surface",
            )}
          >
            <div>
              <motion.p variants={riseIn} className="mono-label">
                {pillar.kicker}
              </motion.p>
              <motion.h3
                variants={riseIn}
                className="mt-4 text-heading leading-[1.05]"
              >
                {pillar.title}
              </motion.h3>
              <motion.p
                variants={riseIn}
                className="mt-4 text-[0.975rem] leading-[1.6] text-muted"
              >
                {pillar.body}
              </motion.p>
            </div>

            <motion.ul
              variants={riseIn}
              className="mt-8 space-y-2 border-t border-rule pt-6"
            >
              {pillar.points.map((point) => (
                <li
                  key={point}
                  className="flex items-baseline gap-3 font-mono text-[0.72rem] tracking-[0.04em] text-muted"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 h-1 w-1 shrink-0 rounded-full",
                      pillar.id === "engineering" ? "bg-filament" : "bg-ember",
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
