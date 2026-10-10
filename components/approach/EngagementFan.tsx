"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { engagementModels, stages } from "@/content/process";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useMedia } from "./useMedia";

type Model = (typeof engagementModels)[number];

/** Start pose of each card in the stacked deck, before it fans out. */
const DECK = [
  { x: "104%", y: 50, rotate: -7 },
  { x: "0%", y: 90, rotate: 0 },
  { x: "-104%", y: 50, rotate: 7 },
];

function Coverage({ covers }: { covers: Model["covers"] }) {
  const set = new Set<string>(covers);
  const first = stages.find((s) => set.has(s.id));
  const last = [...stages].reverse().find((s) => set.has(s.id));
  return (
    <div className="mt-6">
      <div aria-hidden className="flex gap-1.5">
        {stages.map((s) => (
          <span
            key={s.id}
            className={cn(
              "h-2 flex-1 rounded-full",
              set.has(s.id) ? "bg-accent" : "bg-rule",
            )}
          />
        ))}
      </div>
      <p className="mt-2.5 text-sm font-semibold text-muted">
        <span className="sr-only">Covers stages </span>
        {first?.title} to {last?.title}
      </p>
    </div>
  );
}

function CardBody({ model }: { model: Model }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-title">{model.name}</h3>
        <span className="mt-1 shrink-0 rounded-full border border-rule px-3 py-1 text-sm font-bold">
          {model.duration}
        </span>
      </div>
      <p className="mt-4 text-lg leading-snug">{model.bestFor}</p>
      <Coverage covers={model.covers} />
      <ul className="mt-7 space-y-2.5 border-t border-rule pt-6">
        {model.includes.map((item) => (
          <li key={item} className="flex items-center gap-3 font-semibold">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rotate-45 bg-accent"
            />
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

function cardClass(model: Model) {
  return cn(
    "relative flex h-full flex-col rounded-card border p-7 md:p-8",
    model.note
      ? "theme-saffron border-transparent shadow-[0_30px_80px_-30px_rgba(255,178,36,0.55)]"
      : "border-rule bg-surface",
  );
}

function Note({ model }: { model: Model }) {
  if (!model.note) return null;
  return (
    <p className="absolute -top-3.5 left-7 rounded-full bg-midnight px-3.5 py-1 text-xs font-bold tracking-[0.12em] text-saffron uppercase">
      {model.note}
    </p>
  );
}

function FanCard({
  model,
  i,
  progress,
}: {
  model: Model;
  i: number;
  progress: MotionValue<number>;
}) {
  const pose = DECK[i];
  const x = useTransform(progress, [0, 1], [pose.x, "0%"]);
  const y = useTransform(progress, [0, 1], [pose.y, 0]);
  const rotate = useTransform(progress, [0, 1], [pose.rotate, 0]);
  return (
    <motion.li
      style={{ x, y, rotate, zIndex: i === 1 ? 2 : 1 }}
      className="relative"
    >
      <article className={cardClass(model)}>
        <Note model={model} />
        <CardBody model={model} />
      </article>
    </motion.li>
  );
}

/** Three engagement shapes. On desktop they start as a stacked deck and fan out with scroll. */
export function EngagementFan() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const wide = useMedia("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 30%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.6,
  });

  // One persistent wrapper so useScroll keeps tracking across the media switch.
  return (
    <div ref={ref}>
      {wide && !reduced ? (
        <Fanned progress={progress} />
      ) : (
        <Stacked reduced={!!reduced} />
      )}
    </div>
  );
}

function Fanned({ progress }: { progress: MotionValue<number> }) {
  return (
    <ol className="mt-16 grid grid-cols-3 gap-6">
      {engagementModels.map((model, i) => (
        <FanCard key={model.name} model={model} i={i} progress={progress} />
      ))}
    </ol>
  );
}

function Stacked({ reduced }: { reduced: boolean }) {
  return (
    <ol className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {engagementModels.map((model, i) => (
        <motion.li
          key={model.name}
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            delay: (i % 2) * 0.08,
            ease: easeOutExpo,
          }}
        >
          <article className={cardClass(model)}>
            <Note model={model} />
            <CardBody model={model} />
          </article>
        </motion.li>
      ))}
    </ol>
  );
}
