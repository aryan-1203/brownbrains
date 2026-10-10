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

/** Standard "enters as it scrolls into frame" viewport config. Soft margins —
 *  aggressive negative margins miss on slow paints and strand once:true reveals. */
export const inView = { once: true, amount: 0.2, margin: "0px 0px -8% 0px" } as const;

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
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
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};
