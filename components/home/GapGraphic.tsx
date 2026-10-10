"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";

/** Coins drop into the gap one after another as the reader scrolls. */
const coins = [
  { x: -14, start: 0.28, size: 34, spin: 220 },
  { x: 10, start: 0.36, size: 26, spin: -180 },
  { x: -4, start: 0.44, size: 40, spin: 260 },
  { x: 16, start: 0.52, size: 28, spin: -240 },
  { x: -18, start: 0.6, size: 30, spin: 200 },
  { x: 4, start: 0.68, size: 36, spin: -200 },
];

function Coin({
  coin,
  progress,
}: {
  coin: (typeof coins)[number];
  progress: MotionValue<number>;
}) {
  const range = [coin.start, coin.start + 0.22];
  const y = useTransform(progress, range, [-40, 320]);
  const rotate = useTransform(progress, range, [0, coin.spin]);
  const opacity = useTransform(
    progress,
    [coin.start - 0.02, coin.start, coin.start + 0.16, coin.start + 0.22],
    [0, 1, 1, 0],
  );

  return (
    <motion.span
      style={{
        y,
        rotate,
        opacity,
        x: coin.x,
        width: coin.size,
        height: coin.size,
        marginLeft: -coin.size / 2,
      }}
      className="absolute top-0 left-1/2 grid place-items-center rounded-full border-2 border-saffron-deep bg-saffron font-display text-[0.8em] font-extrabold text-midnight shadow-md"
    >
      ₹
    </motion.span>
  );
}

/**
 * Two vendor blocks with a crack between them. Scroll pulls them apart, the
 * crack draws itself downward, and the budget falls through.
 */
export function GapGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.25"],
  });

  const leftX = useTransform(scrollYProgress, [0.1, 0.6], [0, -36]);
  const rightX = useTransform(scrollYProgress, [0.1, 0.6], [0, 36]);
  const leftRotate = useTransform(scrollYProgress, [0.1, 0.6], [0, -3]);
  const rightRotate = useTransform(scrollYProgress, [0.1, 0.6], [0, 3]);
  const crack = useTransform(scrollYProgress, [0.12, 0.5], [0, 1]);
  const gapOpen = useTransform(scrollYProgress, [0.1, 0.6], [0.15, 1]);
  const lossOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);

  const s = reduced
    ? {
        left: { x: -36, rotate: -3 },
        right: { x: 36, rotate: 3 },
        crack: 1,
        gap: 1,
        loss: 1,
      }
    : {
        left: { x: leftX, rotate: leftRotate },
        right: { x: rightX, rotate: rightRotate },
        crack,
        gap: gapOpen,
        loss: lossOpacity,
      };

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-card bg-surface p-5 ring-1 ring-rule md:aspect-[5/4] md:p-8"
    >
      <div className="dot-grid absolute inset-0 opacity-60" />

      {/* The chasm: a dark wedge that opens as the blocks part. */}
      <motion.div
        style={{ scaleX: s.gap }}
        className="absolute inset-y-[18%] left-[calc(50%_-_3rem)] w-24 origin-center bg-gradient-to-b from-midnight-3 to-midnight [clip-path:polygon(0_0,100%_0,62%_100%,38%_100%)] md:left-[calc(50%_-_3.5rem)] md:w-28"
      />

      <svg
        viewBox="0 0 40 200"
        className="absolute inset-y-[18%] left-1/2 h-[64%] w-10 -translate-x-1/2 text-saffron"
        fill="none"
      >
        <motion.path
          d="M20 0 L14 30 L25 55 L12 85 L26 115 L15 145 L23 172 L19 200"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ pathLength: s.crack }}
        />
      </svg>

      {/* Agency */}
      <motion.div
        style={s.left}
        className="absolute top-[18%] bottom-[18%] left-[6%] flex w-[38%] origin-bottom-right flex-col justify-between rounded-2xl bg-saffron p-4 text-midnight shadow-xl md:p-5"
      >
        <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase opacity-80">
          Vendor A
        </span>
        <span className="font-display text-xl leading-none font-extrabold tracking-tight md:text-3xl">
          The agency
        </span>
        <span className="flex gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-midnight/70" />
          <span className="h-1.5 w-4 rounded-full bg-midnight/40" />
        </span>
      </motion.div>

      {/* Dev shop */}
      <motion.div
        style={s.right}
        className="absolute top-[18%] right-[6%] bottom-[18%] flex w-[38%] origin-bottom-left flex-col justify-between rounded-2xl bg-cobalt p-4 text-white shadow-xl md:p-5"
      >
        <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase opacity-85">
          Vendor B
        </span>
        <span className="font-display text-xl leading-none font-extrabold tracking-tight md:text-3xl">
          The dev shop
        </span>
        <span className="flex gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-white/50" />
          <span className="h-1.5 w-8 rounded-full bg-white/80" />
        </span>
      </motion.div>

      {/* The budget, falling through. */}
      <div className="absolute inset-x-0 top-[6%] bottom-0">
        {reduced ? (
          <>
            <span className="absolute top-[30%] left-1/2 -ml-4 grid h-8 w-8 place-items-center rounded-full border-2 border-saffron-deep bg-saffron font-display font-extrabold text-midnight">
              ₹
            </span>
            <span className="absolute top-[55%] left-1/2 ml-1 grid h-7 w-7 place-items-center rounded-full border-2 border-saffron-deep bg-saffron font-display text-sm font-extrabold text-midnight">
              ₹
            </span>
          </>
        ) : (
          coins.map((coin) => (
            <Coin key={coin.start} coin={coin} progress={scrollYProgress} />
          ))
        )}
      </div>

      <motion.span
        style={{ opacity: s.loss }}
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2 rounded-full bg-midnight px-3 py-1 text-xs font-bold tracking-[0.1em] whitespace-nowrap text-saffron uppercase"
      >
        Budget lost in handoffs
      </motion.span>
    </div>
  );
}
