"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { contactMailtoHref, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";

/**
 * Chapter 7. Two giant halves slide in from the edges and meet behind the
 * headline, echoing the hero, as the band scrolls into place.
 */
export function ClosingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 0.6"],
  });
  const leftX = useTransform(scrollYProgress, [0, 1], ["-60%", "0%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);

  return (
    <section
      ref={ref}
      id="start"
      className="theme-saffron relative overflow-hidden section-pad"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[min(120vw,52rem)] w-[min(120vw,52rem)] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          style={reduced ? undefined : { x: leftX }}
          className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-saffron-deep/45"
        />
        <motion.div
          style={reduced ? undefined : { x: rightX }}
          className="absolute inset-y-0 right-0 w-1/2 rounded-r-full bg-[#ffc659]"
        />
      </div>

      <div className="shell relative text-center">
        <p className="eyebrow justify-center">
          <span aria-hidden className="flex">
            <span className="h-2.5 w-1.5 rounded-l-full bg-midnight" />
            <span className="h-2.5 w-1.5 rounded-r-full bg-cobalt" />
          </span>
          Your move
        </p>
        <SplitReveal
          text="Bring us the whole problem."
          className="mx-auto mt-6 max-w-4xl font-display text-display font-black tracking-[-0.05em]"
        />
        <p className="lead mx-auto mt-6 max-w-md text-ink">
          Marketing and engineering in one conversation.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" className="min-h-14 px-8 text-lg">
            Start a project
          </Button>
          <a
            href={contactMailtoHref("New project")}
            className="link-underline inline-flex min-h-11 items-center font-semibold"
          >
            {site.contact.emails[0]}
          </a>
        </div>
      </div>
    </section>
  );
}
