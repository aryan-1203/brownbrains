import type { Transition, Variants } from "motion/react";

/** Matches --ease-out-expo / --ease-in-out-quart in globals.css. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutQuart = [0.76, 0, 0.24, 1] as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 26,
  mass: 0.9,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.6,
};

/** Standard "enters as it scrolls into frame" viewport config. The positive
 *  bottom margin starts a reveal just before it reaches the screen, so a fast
 *  thumb-flick on a phone never lands on an empty, still-hidden block. */
export const inView = { once: true, amount: 0.1, margin: "0px 0px 12% 0px" } as const;

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const staggerParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Per-word mask reveal: the parent clips, the child slides up from under it. */
export const wordMask: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};
