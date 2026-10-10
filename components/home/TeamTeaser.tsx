"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Person = { name: string; portrait: string };

const ring = ["ring-saffron", "ring-cobalt", "ring-chalk"];

function Portrait({
  person,
  index,
  progress,
  reduced,
}: {
  person: Person;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Start stacked on the middle portrait, fan out into an overlapping row.
  const offset = index - 1;
  const x = useTransform(progress, [0, 1], [offset * -64, 0]);
  const rotate = useTransform(progress, [0, 1], [offset * 14, offset * -4]);

  return (
    <motion.li
      style={reduced ? undefined : { x, rotate }}
      className={cn(
        "relative -ml-6 h-24 w-24 overflow-hidden rounded-full ring-4 first:ml-0 md:-ml-8 md:h-36 md:w-36",
        ring[index % ring.length],
      )}
    >
      <Image
        src={person.portrait}
        alt={person.name}
        fill
        sizes="(min-width: 768px) 144px, 96px"
        className="object-cover"
      />
    </motion.li>
  );
}

/** Chapter 6. The people, one click away. */
export function TeamTeaser({ people }: { people: Person[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "center 0.55"],
  });

  return (
    <div
      ref={ref}
      className="shell flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between"
    >
      <ul className="flex shrink-0 items-center pl-2" aria-label="Leadership">
        {people.map((person, index) => (
          <Portrait
            key={person.name}
            person={person}
            index={index}
            progress={scrollYProgress}
            reduced={reduced}
          />
        ))}
      </ul>
      <div className="max-w-xl">
        <h2 className="font-display text-title font-extrabold">
          Meet the people who <span className="text-accent">do the work.</span>
        </h2>
        <p className="lead mt-4">
          No account managers in between. You talk to the makers.
        </p>
        <Button href="/about" className="mt-8">
          About the team
        </Button>
      </div>
    </div>
  );
}
