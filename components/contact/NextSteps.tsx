"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOutExpo, inView, springSnappy } from "@/lib/motion";

const steps = [
  {
    title: "We reply",
    body: "Within one working day.",
    icon: <path d="M4 7h16v10H4zM4 7l8 6 8-6" />,
  },
  {
    title: "We talk",
    body: "One short call about your goals.",
    icon: <path d="M5 6h14v9H10l-4 3v-3H5z" />,
  },
  {
    title: "You get a plan",
    body: "Scope, timeline and price, in writing.",
    icon: <path d="M7 4h7l4 4v12H7zM14 4v4h4M10 13l2 2 3.5-4" />,
  },
];

/** Three steps on a line that draws itself as the list scrolls in. */
export function NextSteps() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="relative"
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={inView}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
    >
      {/* Connector between the step icons: a rule, with a saffron line drawn over it. */}
      <span
        aria-hidden
        className="absolute top-6 bottom-6 left-[1.3125rem] w-0.5 rounded-full bg-rule"
      />
      <motion.span
        aria-hidden
        className="absolute top-6 bottom-6 left-[1.3125rem] w-0.5 origin-top rounded-full bg-saffron"
        variants={{
          hidden: { scaleY: 0 },
          show: {
            scaleY: 1,
            transition: { duration: 1.2, ease: easeOutExpo, delay: 0.2 },
          },
        }}
      />
      <ol className="relative space-y-6">
        {steps.map((step, index) => (
          <motion.li
            key={step.title}
            className="relative flex items-start gap-4"
            variants={{
              hidden: { opacity: 0, x: -12 },
              show: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: easeOutExpo },
              },
            }}
          >
            <motion.span
              aria-hidden
              className={
                "relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full " +
                (index === 0
                  ? "bg-saffron text-midnight"
                  : index === 1
                    ? "bg-cobalt text-white"
                    : "bg-[linear-gradient(90deg,#ffb224_50%,#2b59ff_50%)] text-midnight")
              }
              variants={{
                hidden: { scale: 0.4 },
                show: { scale: 1, transition: springSnappy },
              }}
            >
              {index === 2 ? (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {step.icon}
                  </svg>
                </span>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {step.icon}
                </svg>
              )}
            </motion.span>
            <div className="pt-1">
              <p className="font-display text-[1.1rem] leading-tight font-bold">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </p>
              <p className="mt-1 text-[0.95rem] text-muted">{step.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
