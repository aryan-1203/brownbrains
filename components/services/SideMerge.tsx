"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { services, type ServiceSide } from "@/content/services";
import { cn } from "@/lib/cn";

/*
 * "Pick one side or both": marketing and engineering cards on the outside,
 * and as the band scrolls through, a saffron line and a cobalt line grow in
 * and meet at the midnight "both" card, which settles into place.
 * Horizontal on desktop, stacked with vertical connectors on phones.
 */

const titlesFor = (side: ServiceSide) =>
  services.filter((service) => service.side === side).map((s) => s.title);

function Connector({
  progress,
  colour,
  towards,
}: {
  progress: MotionValue<number>;
  colour: string;
  /** Which way the line grows: from the outer card in to the centre. */
  towards: "in-from-start" | "in-from-end";
}) {
  const reduced = useReducedMotion();
  const fromStart = towards === "in-from-start";

  return (
    <div aria-hidden className="flex items-center justify-center lg:flex-1">
      {/* Phones: vertical. */}
      <motion.span
        className={cn(
          "block h-12 w-[3px] rounded-full lg:hidden",
          colour,
          fromStart ? "origin-top" : "origin-bottom",
        )}
        style={reduced ? undefined : { scaleY: progress }}
      />
      {/* Desktop: horizontal. */}
      <motion.span
        className={cn(
          "hidden h-[3px] w-full min-w-8 rounded-full lg:block",
          colour,
          fromStart ? "origin-left" : "origin-right",
        )}
        style={reduced ? undefined : { scaleX: progress }}
      />
    </div>
  );
}

function SideCard({
  title,
  line,
  side,
}: {
  title: string;
  line: string;
  side: "human" | "machine";
}) {
  return (
    <div className="relative overflow-hidden rounded-card border border-rule bg-surface p-6 lg:w-[30%] lg:shrink-0 md:p-7">
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-1.5",
          side === "human" ? "bg-saffron" : "bg-cobalt",
        )}
      />
      <h3 className="text-heading">{title}</h3>
      <p className="mt-2 text-muted">{line}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {titlesFor(side).map((item) => (
          <li
            key={item}
            className="rounded-full bg-bg px-3 py-1.5 text-sm font-semibold"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SideMerge() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });
  const line = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const settle = useTransform(scrollYProgress, [0.45, 0.95], [0.9, 1]);
  const glow = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="relative mt-14 flex flex-col lg:mt-20 lg:flex-row lg:items-center"
    >
      <SideCard
        side="human"
        title="Marketing"
        line="Get found, get chosen."
      />
      <Connector progress={line} colour="bg-saffron" towards="in-from-start" />

      <motion.div
        className="relative lg:w-[34%] lg:shrink-0"
        style={reduced ? undefined : { scale: settle }}
      >
        {/* Split ring that brightens as the two lines arrive. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-1.5 rounded-[calc(var(--radius-card)+0.375rem)] bg-[linear-gradient(90deg,var(--color-saffron),var(--color-cobalt))]"
          style={reduced ? undefined : { opacity: glow }}
        />
        <div className="relative rounded-card bg-midnight p-7 text-chalk md:p-8">
        <p className="eyebrow !text-sky">
          <span aria-hidden className="flex">
            <span className="h-2.5 w-2.5 rounded-full bg-saffron" />
            <span className="-ml-1 h-2.5 w-2.5 rounded-full bg-cobalt" />
          </span>
          Both
        </p>
        <h3 className="mt-3 text-heading">One plan. No gap.</h3>
        <p className="mt-2 text-[#c7d0e6]">
          Strategy and build in the same room, so nothing is lost in a handoff.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {titlesFor("both").map((item) => (
            <li
              key={item}
              className="rounded-full bg-midnight-3 px-3 py-1.5 text-sm font-semibold"
            >
              {item}
            </li>
          ))}
        </ul>
        </div>
      </motion.div>

      <Connector progress={line} colour="bg-cobalt" towards="in-from-end" />
      <SideCard
        side="machine"
        title="Engineering"
        line="Build what people use."
      />
    </div>
  );
}
