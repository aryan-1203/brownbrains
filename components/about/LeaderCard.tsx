"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import type { Founder } from "@/content/founders";
import { cn } from "@/lib/cn";

const wash = {
  marketing: {
    fill: "bg-saffron",
    dot: "bg-saffron",
    tag: "bg-saffron text-midnight",
    label: "Marketing",
  },
  engineering: {
    fill: "bg-cobalt",
    dot: "bg-cobalt",
    tag: "bg-cobalt text-white",
    label: "Engineering",
  },
  product: {
    fill: "bg-mint",
    dot: "bg-mint",
    tag: "bg-mint text-midnight",
    label: "Product",
  },
} as const;

/** True on touch-first devices, where hover can't resolve the portrait. */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: none)");
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return coarse;
}

/**
 * "Sunrise" portrait. As the card scrolls up, a disc of the leader's brand
 * colour rises out of the bottom edge and expands, and the portrait follows
 * one beat behind it, so a coloured ring sweeps the frame before the face
 * lands. The portrait sits under a duotone wash that resolves to full colour
 * on hover, keyboard focus, or (on touch) when the card reaches mid-screen.
 */
export function LeaderCard({
  founder,
  index,
}: {
  founder: Founder;
  index: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const centred = useInView(frameRef, { amount: 0.85 });
  const tone = wash[founder.half];

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end 0.7"],
  });

  const discClip = useTransform(
    scrollYProgress,
    [0, 0.75],
    ["circle(0% at 50% 100%)", "circle(130% at 50% 100%)"],
  );
  const imageClip = useTransform(
    scrollYProgress,
    [0.15, 1],
    ["circle(0% at 50% 100%)", "circle(130% at 50% 100%)"],
  );
  const imageScale = useTransform(scrollYProgress, [0.15, 1], [1.18, 1]);
  const tagY = useTransform(scrollYProgress, [0.55, 1], [24, 0]);
  const tagOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 1]);

  const active = coarse && centred;
  const still = reduced ?? false;

  return (
    <article
      data-active={active}
      className={cn(
        "group relative",
        index === 1 && "lg:mt-28",
        index === 2 && "lg:mt-14",
      )}
    >
      <div
        ref={frameRef}
        className="relative isolate aspect-[9/10] overflow-hidden rounded-card bg-midnight-2"
      >
        {/* The rising disc */}
        <motion.div
          aria-hidden
          className={cn("absolute inset-0", tone.fill)}
          style={still ? undefined : { clipPath: discClip }}
        />

        {/* Portrait, one beat behind the disc */}
        <motion.div
          className="absolute inset-0"
          style={still ? undefined : { clipPath: imageClip }}
        >
          <motion.div
            className="absolute inset-0"
            style={still ? undefined : { scale: imageScale }}
          >
            <Image
              src={founder.portrait}
              alt={`Illustrated portrait of ${founder.name}`}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 28rem, 92vw"
              className="object-cover object-top"
            />
          </motion.div>
          {/* Duotone wash: strip colour, then tint with the brand half. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-midnight mix-blend-saturation transition-opacity duration-500 ease-out-expo group-focus-within:opacity-0 group-hover:opacity-0 group-data-[active=true]:opacity-0"
          />
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 mix-blend-multiply transition-opacity duration-500 ease-out-expo group-focus-within:opacity-0 group-hover:opacity-0 group-data-[active=true]:opacity-0",
              tone.fill,
            )}
          />
        </motion.div>

        <motion.span
          aria-hidden
          className={cn(
            "absolute top-4 left-4 rounded-full px-3 py-1.5 text-[0.72rem] font-bold tracking-[0.12em] uppercase",
            tone.tag,
          )}
          style={still ? undefined : { y: tagY, opacity: tagOpacity }}
        >
          {tone.label}
        </motion.span>
      </div>

      <div className="mt-6">
        <p className="eyebrow">
          <span aria-hidden className={cn("h-2 w-2 rounded-full", tone.dot)} />
          {founder.discipline}
        </p>
        <h3 className="mt-3 text-heading font-extrabold">{founder.name}</h3>
        <p className="mt-1.5 text-[0.95rem] font-semibold text-sky">
          {founder.role}
        </p>
        <p className="mt-3 max-w-[34ch] text-muted">{founder.bio}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Focus areas">
          {founder.focus.map((item) => (
            <li
              key={item}
              className="rounded-full border border-rule px-3 py-1.5 text-[0.82rem] font-medium text-ink/90"
            >
              {item}
            </li>
          ))}
        </ul>

        {founder.linkedin ? (
          <a
            href={founder.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${founder.name} on LinkedIn`}
            className="mt-4 -ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 font-semibold text-ink transition-colors duration-200 hover:text-accent"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.55 4.77 5.86v5.59h-4v-4.96c0-1.18-.02-2.7-1.7-2.7-1.7 0-1.96 1.28-1.96 2.61v5.05h-4v-11Z" />
            </svg>
            <span className="link-underline">LinkedIn</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
