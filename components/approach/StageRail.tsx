"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { stages } from "@/content/process";
import { inView, riseIn, staggerParent } from "@/lib/motion";

/** The five stages as a vertical rail that fills in as you read down it. */
export function StageRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 65%"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.4,
  });

  return (
    <div ref={ref} className="relative mt-16 pl-8 md:pl-0">
      {/* Rail */}
      <div
        aria-hidden
        className="absolute top-2 bottom-2 left-0 w-px bg-rule md:left-[8.5rem]"
      >
        <motion.div
          style={{ scaleY: fill }}
          className="h-full w-px origin-top bg-ember"
        />
      </div>

      <motion.ol
        variants={staggerParent(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="space-y-16 md:space-y-24"
      >
        {stages.map((stage, index) => (
          <motion.li
            key={stage.id}
            variants={riseIn}
            className="relative grid gap-6 md:grid-cols-[8.5rem_1fr] md:gap-14"
          >
            <div className="md:pr-14 md:text-right">
              <p className="font-mono text-[0.68rem] tracking-[0.14em] text-faint uppercase tabular-nums">
                {String(index + 1).padStart(2, "0")} / {stage.duration}
              </p>
            </div>

            {/* Node sitting on the rail */}
            <span
              aria-hidden
              className="absolute top-1.5 -left-8 h-2.5 w-2.5 rounded-full border border-ember bg-bg md:left-[calc(8.5rem-0.3125rem)]"
            />

            <div>
              <h3 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] leading-none">
                {stage.title}
              </h3>
              <p className="mt-5 max-w-2xl text-[1.02rem] leading-[1.7] text-muted">
                {stage.description}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {stage.outputs.map((output) => (
                  <li
                    key={output}
                    className="rounded-full border border-rule px-3 py-1 font-mono text-[0.62rem] tracking-[0.1em] text-muted uppercase"
                  >
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
