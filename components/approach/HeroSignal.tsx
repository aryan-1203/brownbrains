"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { easeOutExpo } from "@/lib/motion";

/**
 * Hero graphic: a scatter of signals (saffron = marketing, sky = engineering)
 * converges into one beam that ends in a solid, shipped shape. Draws itself on
 * load; on scroll the scatter tightens toward the beam.
 */

const POINTS: Array<[number, number, "s" | "c"]> = [
  [34, 62, "s"],
  [92, 34, "c"],
  [150, 76, "s"],
  [58, 128, "c"],
  [120, 150, "s"],
  [28, 196, "s"],
  [96, 214, "c"],
  [162, 196, "c"],
  [52, 266, "c"],
  [130, 278, "s"],
  [76, 334, "s"],
  [160, 330, "c"],
  [190, 122, "c"],
  [200, 262, "s"],
];

const MEET: [number, number] = [300, 190];
const END_X = 446;

export function HeroSignal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 30%", "end start"],
  });
  const pull = useTransform(scrollYProgress, [0, 1], [1, 0.55]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const shown = reduced ? false : "hidden";

  return (
    <div ref={ref}>
      <motion.svg
        aria-hidden
        viewBox="0 0 560 380"
        className="h-auto w-full"
        initial={shown}
        animate="show"
        style={reduced ? undefined : { y: lift }}
      >
        <defs>
          <linearGradient
            id="bb-hero-beam"
            x1="300"
            x2={END_X}
            y1="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#ffb224" />
            <stop offset="1" stopColor="#9fb6ff" />
          </linearGradient>
        </defs>

        {/* Scatter + converging threads, pulled toward the meet point on scroll. */}
        <motion.g
          style={
            reduced
              ? undefined
              : {
                  scale: pull,
                  transformOrigin: `${MEET[0]}px ${MEET[1]}px`,
                  transformBox: "view-box",
                }
          }
        >
          {POINTS.map(([x, y, tone], i) => (
            <motion.path
              key={`l-${i}`}
              d={`M${x} ${y} Q${(x + MEET[0]) / 2 + 30} ${y} ${MEET[0]} ${MEET[1]}`}
              fill="none"
              stroke={tone === "s" ? "#ffb224" : "#9fb6ff"}
              strokeOpacity={0.45}
              strokeWidth={1.5}
              variants={{
                hidden: { pathLength: 0 },
                show: {
                  pathLength: 1,
                  transition: {
                    duration: 1.1,
                    delay: 0.5 + i * 0.035,
                    ease: easeOutExpo,
                  },
                },
              }}
            />
          ))}
          {POINTS.map(([x, y, tone], i) => (
            <motion.circle
              key={`p-${i}`}
              cx={x}
              cy={y}
              r={i % 3 === 0 ? 7 : 5}
              fill={tone === "s" ? "#ffb224" : "#9fb6ff"}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                show: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 420,
                    damping: 20,
                    delay: 0.1 + i * 0.03,
                  },
                },
              }}
            />
          ))}
        </motion.g>

        {/* The beam */}
        <motion.path
          d={`M${MEET[0]} ${MEET[1]} H${END_X}`}
          stroke="url(#bb-hero-beam)"
          strokeWidth={6}
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            show: {
              pathLength: 1,
              transition: { duration: 0.7, delay: 1.2, ease: easeOutExpo },
            },
          }}
        />
        <circle
          cx={MEET[0]}
          cy={MEET[1]}
          r={9}
          fill="#0a1733"
          stroke="#ffb224"
          strokeWidth={3}
        />

        {/* A pulse riding the beam, forever. */}
        {!reduced && (
          <motion.circle
            cx={MEET[0]}
            cy={MEET[1]}
            r={5}
            fill="#ffffff"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [0, END_X - MEET[0] - 30], opacity: [0, 1, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 0.6,
              delay: 2,
              ease: "easeIn",
            }}
          />
        )}

        {/* Shipped */}
        <motion.g
          variants={{
            hidden: { scale: 0, rotate: -20, opacity: 0 },
            show: {
              scale: 1,
              rotate: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 16,
                delay: 1.6,
              },
            },
          }}
        >
          <rect
            x={END_X}
            y={MEET[1] - 46}
            width={92}
            height={92}
            rx={24}
            fill="#ffb224"
          />
          <path
            d={`M${END_X + 46} ${MEET[1] + 22} V${MEET[1] - 20} M${END_X + 30} ${MEET[1] - 4} L${END_X + 46} ${MEET[1] - 20} L${END_X + 62} ${MEET[1] - 4}`}
            fill="none"
            stroke="#0a1733"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        <text
          x={96}
          y={372}
          textAnchor="middle"
          fill="#a9b4cf"
          className="text-[15px] font-bold tracking-[0.14em] uppercase"
        >
          Signal
        </text>
        <text
          x={END_X + 46}
          y={MEET[1] + 80}
          textAnchor="middle"
          fill="#a9b4cf"
          className="text-[15px] font-bold tracking-[0.14em] uppercase"
        >
          Shipped
        </text>
      </motion.svg>
    </div>
  );
}
