"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import {
  services,
  sideLabel,
  type Service,
  type ServiceSide,
} from "@/content/services";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ServiceGlyph } from "./ServiceGlyph";

/*
 * Signature moment: a sticky "stage" on the left re-draws its illustration,
 * swaps its number and repaints its ground (saffron, cobalt, or split for
 * "both") as each service row crosses the middle of the viewport on the
 * right. Below lg the stage is dropped and each row carries its own small
 * illustration, so nothing is pinned on phones.
 */

type Skin = { layer: string; text: string; accent: string };

const skins: Record<ServiceSide, Skin> = {
  human: { layer: "bg-saffron", text: "text-midnight", accent: "#ffffff" },
  machine: { layer: "bg-cobalt", text: "text-white", accent: "#ffb224" },
  both: {
    layer:
      "bg-[linear-gradient(90deg,var(--color-saffron)_50%,var(--color-cobalt)_50%)]",
    text: "text-midnight",
    accent: "#ffffff",
  },
};

const sides: ServiceSide[] = ["human", "machine", "both"];
const pad = (n: number) => String(n).padStart(2, "0");

function SideDot({ side, className }: { side: ServiceSide; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2.5 w-2.5 shrink-0 rounded-full",
        side === "human" && "bg-saffron",
        side === "machine" && "bg-cobalt ring-1 ring-sky/60",
        side === "both" && skins.both.layer,
        className,
      )}
    />
  );
}

function Stage({
  active,
  progress,
}: {
  active: number;
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const seen = useInView(stageRef, { once: true, amount: 0.4 });
  const service = services[active];
  const skin = skins[service.side];
  const spin = useTransform(progress, [0, 1], [0, 220]);
  const fast = { duration: reduced ? 0 : 0.45, ease: easeOutExpo };

  return (
    <div
      ref={stageRef}
      aria-hidden
      className="relative aspect-square w-[min(100%,calc(100vh-10rem))] overflow-hidden rounded-card shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
    >
      {sides.map((side) => (
        <motion.div
          key={side}
          className={cn("absolute inset-0", skins[side].layer)}
          initial={false}
          animate={{ opacity: service.side === side ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: easeOutExpo }}
        />
      ))}

      <div
        className={cn("absolute inset-0", skin.text)}
        style={{ "--glyph-accent": skin.accent } as React.CSSProperties}
      >
        {/* Scroll-scrubbed orbit behind the drawing. */}
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-[8%] opacity-25"
          style={reduced ? undefined : { rotate: spin }}
        >
          <circle
            cx={100}
            cy={100}
            r={96}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
            strokeDasharray="2 6"
          />
          <circle cx={100} cy={4} r={3} fill="currentColor" />
        </motion.svg>

        <div className="absolute top-7 left-7 flex items-start gap-2 font-display leading-none font-extrabold tracking-[-0.05em]">
          <span className="relative block overflow-hidden text-[clamp(3.5rem,7vw,6rem)]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={active}
                className="block"
                initial={reduced ? false : { y: "100%" }}
                animate={{ y: "0%" }}
                exit={reduced ? undefined : { y: "-100%" }}
                transition={fast}
              >
                {pad(active + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="mt-2 text-base font-bold tracking-normal opacity-70">
            / {pad(services.length)}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={service.slug}
              className="w-[46%]"
              exit={reduced ? undefined : { opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
            >
              <ServiceGlyph slug={service.slug} play={seen} className="h-auto w-full" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-7 bottom-7 flex items-end justify-between gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={service.slug}
              className="font-display text-heading leading-tight font-bold"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={fast}
            >
              {service.title}
            </motion.p>
          </AnimatePresence>
          <span className="shrink-0 font-display text-xs font-bold tracking-[0.14em] uppercase">
            {sideLabel[service.side]}
          </span>
        </div>

        {/* Seven ticks down the right edge, one per service. */}
        <div className="absolute top-1/2 right-6 flex -translate-y-1/2 flex-col gap-2">
          {services.map((item, i) => (
            <motion.span
              key={item.slug}
              className="block h-6 w-1 origin-center rounded-full bg-current"
              initial={false}
              animate={{
                opacity: i === active ? 1 : 0.3,
                scaleY: i === active ? 1 : 0.55,
              }}
              transition={fast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({
  service,
  index,
  onActive,
}: {
  service: Service;
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // A thin band across the middle of the viewport decides the active row.
  const centred = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const cardSeen = useInView(cardRef, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const skin = skins[service.side];

  useEffect(() => {
    if (centred) onActive(index);
  }, [centred, index, onActive]);

  return (
    <li
      ref={ref}
      id={service.slug}
      className="scroll-mt-28 border-t border-rule py-14 first:border-t-0 first:pt-4 lg:flex lg:min-h-[85vh] lg:items-center lg:py-20"
    >
      <motion.article
        className="w-full"
        initial={reduced ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: easeOutExpo }}
      >
        {/* Phones and tablets: the illustration rides with its row. */}
        <div
          ref={cardRef}
          aria-hidden
          className={cn(
            "mb-8 flex aspect-[16/9] items-center justify-center rounded-card lg:hidden",
            skin.layer,
            skin.text,
          )}
          style={{ "--glyph-accent": skin.accent } as React.CSSProperties}
        >
          <ServiceGlyph slug={service.slug} play={cardSeen} className="h-auto w-[34%]" />
        </div>

        <div className="flex items-center gap-4">
          <span className="font-display text-sm font-bold text-muted tabular-nums">
            {pad(index + 1)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-rule px-3 py-1 text-xs font-bold tracking-[0.12em] text-ink uppercase">
            <SideDot side={service.side} />
            {sideLabel[service.side]}
          </span>
        </div>

        <h3 className="mt-5 text-title">{service.title}</h3>
        <p className="mt-5 max-w-xl text-lead leading-snug font-medium text-ink">
          {service.blurb}
        </p>
        <p className="mt-3 max-w-xl text-muted">{service.detail}</p>

        <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {service.deliverables.map((item) => (
            <li key={item} className="flex gap-3 leading-snug">
              <svg
                aria-hidden
                focusable="false"
                viewBox="0 0 20 20"
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              >
                <path
                  d="M4.5 10.5l3.5 3.5 7.5-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col gap-4 rounded-2xl bg-surface p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <p className="eyebrow">Outcome</p>
            <p className="mt-1.5 font-display text-heading leading-tight font-bold">
              {service.outcome}
            </p>
          </div>
          <Link
            href={`/contact?service=${service.slug}`}
            className="group inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border-2 border-ink/80 px-5 font-display text-sm font-semibold transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-on-accent sm:self-auto"
          >
            <span aria-hidden>Ask about this</span>
            <span className="sr-only">Ask about {service.title}</span>
            <svg
              aria-hidden
              focusable="false"
              viewBox="0 0 20 20"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            >
              <path
                d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </motion.article>
    </li>
  );
}

export function ServiceScroller() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  return (
    <div
      ref={listRef}
      className="shell relative grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 xl:gap-24"
    >
      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-screen items-center pt-16">
          <Stage active={active} progress={scrollYProgress} />
        </div>
      </div>

      <ol className="min-w-0">
        {services.map((service, index) => (
          <Row
            key={service.slug}
            service={service}
            index={index}
            onActive={setActive}
          />
        ))}
      </ol>
    </div>
  );
}
