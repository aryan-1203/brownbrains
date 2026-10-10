"use client";

import { useId, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { easeOutExpo, springSoft } from "@/lib/motion";

type Faq = { q: string; a: string };

/**
 * Disclosure list (button + aria-expanded + region). Opening an answer slides
 * the rows below with layout transforms rather than animating height.
 */
export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  const reduced = useReducedMotion();
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  const layoutTransition = reduced ? { duration: 0 } : springSoft;

  return (
    <LayoutGroup>
      <ul className="border-t-2 border-midnight">
        {items.map((item, index) => {
          const expanded = open === index;
          const buttonId = `${baseId}-q-${index}`;
          const panelId = `${baseId}-a-${index}`;

          return (
            <motion.li
              key={item.q}
              layout="position"
              transition={layoutTransition}
              className="border-b border-midnight/25"
            >
              <h3 className="text-heading leading-tight">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : index)}
                  className="group flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left font-display font-bold tracking-[-0.03em] focus-visible:outline-midnight"
                >
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={
                      "relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-300 " +
                      (expanded
                        ? "bg-midnight"
                        : "bg-midnight/10 group-hover:bg-midnight/20")
                    }
                  >
                    <span
                      className={
                        "absolute h-0.5 w-4 rounded-full transition-colors duration-300 " +
                        (expanded ? "bg-saffron" : "bg-midnight")
                      }
                    />
                    <motion.span
                      className="absolute h-4 w-0.5 rounded-full bg-midnight"
                      initial={false}
                      animate={{
                        scaleY: expanded ? 0 : 1,
                        rotate: expanded ? 90 : 0,
                      }}
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { duration: 0.3, ease: easeOutExpo }
                      }
                    />
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!expanded}
              >
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.p
                      key="answer"
                      initial={reduced ? false : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      transition={{
                        duration: 0.45,
                        ease: easeOutExpo,
                        delay: 0.05,
                      }}
                      className="max-w-2xl pr-14 pb-6 text-[1.05rem] leading-relaxed text-muted"
                    >
                      {item.a}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </LayoutGroup>
  );
}
