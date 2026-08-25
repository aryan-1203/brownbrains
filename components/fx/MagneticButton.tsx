"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { useTone } from "@/components/tone/ToneProvider";
import { springSoft } from "@/lib/motion";

const MotionLink = motion.create(Link);

type MagneticButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "solid" | "outline";
  className?: string;
  cursorLabel?: string;
  /** How far the button leans toward the pointer, in pixels. */
  pull?: number;
};

/** Button that leans toward the pointer and springs back on leave. */
export function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  disabled,
  variant = "solid",
  className,
  cursorLabel,
  pull = 7,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useTone();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, springSoft);
  const y = useSpring(py, springSoft);
  // The label drifts a little further than the shell for a parallax feel.
  const labelX = useTransform(x, (value) => value * 0.4);
  const labelY = useTransform(y, (value) => value * 0.4);

  const handleMove = (event: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    px.set(Math.max(-1, Math.min(1, dx)) * pull);
    py.set(Math.max(-1, Math.min(1, dy)) * pull);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  const shell = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full",
    "px-7 py-3.5 font-mono text-[0.72rem] font-medium tracking-[0.14em] uppercase",
    "transition-colors duration-500 disabled:pointer-events-none disabled:opacity-45",
    variant === "solid"
      ? "bg-ink text-bg"
      : "border border-rule text-ink hover:border-ember",
    className,
  );

  const inner = (
    <>
      {/* Ember wash that wipes up from the bottom edge on hover. */}
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full bg-ember transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      />
      <motion.span
        style={reduced ? undefined : { x: labelX, y: labelY }}
        className={cn(
          "relative z-10 transition-colors duration-300",
          variant === "solid"
            ? "group-hover:text-[#fbf8f3]"
            : "group-hover:text-[#fbf8f3]",
        )}
      >
        {children}
      </motion.span>
    </>
  );

  const shared = {
    className: shell,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    "data-cursor-label": cursorLabel,
  };

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");

    if (external) {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          style={reduced ? undefined : { x, y }}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...shared}
        >
          {inner}
        </motion.a>
      );
    }

    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        style={reduced ? undefined : { x, y }}
        {...shared}
      >
        {inner}
      </MotionLink>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={reduced ? undefined : { x, y }}
      {...shared}
    >
      {inner}
    </motion.button>
  );
}
