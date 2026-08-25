"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { SynapseCanvas } from "@/components/fx/SynapseCanvas";
import { type Tone, useTone } from "./ToneProvider";

type SectionProps = {
  tone: Tone;
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** Draw the animated neuron graph behind the content. Machine tone only. */
  canvas?: boolean;
  /** Hairline across the top of the section, marking the seam between tones. */
  seam?: boolean;
  /** Vertical rhythm. "none" opts out entirely (used by the hero and seams). */
  pad?: "none" | "sm" | "md" | "lg";
};

const padding = {
  none: "",
  sm: "py-14 md:py-20",
  md: "py-20 md:py-32",
  lg: "py-28 md:py-44",
};

export function Section({
  tone,
  children,
  id,
  className,
  canvas = false,
  seam = false,
  pad = "md",
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { register } = useTone();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register(el, tone);
  }, [register, tone]);

  return (
    <section
      ref={ref}
      id={id}
      data-tone-section={tone}
      className={cn(
        tone === "paper" ? "tone-paper" : "tone-machine",
        "relative isolate bg-bg text-ink",
        padding[pad],
        className,
      )}
    >
      {seam ? (
        <div aria-hidden className="seam absolute inset-x-0 top-0" />
      ) : null}
      {canvas && tone === "machine" ? <SynapseCanvas /> : null}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
