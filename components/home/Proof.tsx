"use client";

import { motion } from "motion/react";
import { engagements, proofStats } from "@/content/site";
import { inView, riseIn, staggerParent } from "@/lib/motion";
import { Counter } from "@/components/fx/Counter";
import { WordReveal } from "@/components/fx/WordReveal";

export function Proof() {
  return (
    <div className="shell">
      <motion.dl
        className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-rule py-12 lg:grid-cols-4"
        variants={staggerParent(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {proofStats.map((stat) => (
          <motion.div key={stat.label} variants={riseIn}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-display text-[clamp(2.6rem,5.5vw,4.2rem)] leading-none tracking-[-0.03em]">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-3 block max-w-[13rem] font-mono text-[0.68rem] leading-relaxed tracking-[0.08em] text-muted uppercase">
                {stat.label}
              </span>
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <div className="mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono-label">05 / Shape of the work</p>
          <WordReveal
            text="What an engagement looks like"
            className="mt-5 max-w-xl text-title"
            accent={["engagement"]}
          />
        </div>
        <p className="max-w-xs font-mono text-[0.68rem] leading-relaxed tracking-[0.06em] text-faint uppercase">
          Illustrative of how we scope and sequence work
        </p>
      </div>

      <motion.ul
        className="mt-12 border-t border-rule"
        variants={staggerParent(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {engagements.map((item, index) => (
          <motion.li
            key={item.title}
            variants={riseIn}
            className="group border-b border-rule"
          >
            <div className="grid gap-4 py-8 md:grid-cols-[7rem_1fr_auto] md:items-start md:gap-8">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[0.7rem] text-faint tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[0.66rem] tracking-[0.12em] text-muted uppercase">
                  {item.sector}
                </span>
              </div>

              <div>
                <h3 className="text-heading leading-[1.15] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-2xl text-[0.95rem] leading-[1.65] text-muted">
                  {item.summary}
                </p>
              </div>

              <ul className="flex flex-wrap gap-2 md:justify-end">
                {item.contribution.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-rule px-3 py-1 font-mono text-[0.6rem] tracking-[0.1em] text-muted uppercase"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
