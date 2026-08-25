"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useTone } from "@/components/tone/ToneProvider";

const INTERACTIVE =
  "a, button, [role='button'], [role='slider'], label, input, textarea, summary, [data-cursor-label]";

/**
 * Replaces the pointer with a ring that expands into a contextual label over
 * interactive elements.
 *
 * Two deliberate choices keep it fast and always visible:
 * - Coordinates go straight into motion values on `pointermove`, so tracking the
 *   pointer never triggers a React render. Label lookups ride on `pointerover`,
 *   which only fires when the pointer crosses into a new element.
 * - The plain ring is white with `mix-blend-mode: difference`, so it inverts
 *   against whatever is underneath. A tone-derived colour cannot work here: the
 *   home hero is light and dark at the same time.
 */
export function CursorRing() {
  const { reduced } = useTone();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const hasMoved = useRef(false);

  const rawX = useMotionValue(-120);
  const rawY = useMotionValue(-120);
  // Stiff and light: enough smoothing to feel liquid, not enough to feel laggy.
  const spring = { stiffness: 1800, damping: 44, mass: 0.12 } as const;
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches && !reduced);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
      if (!hasMoved.current) {
        hasMoved.current = true;
        // Jump to the first known position instead of flying in from offscreen.
        x.jump(event.clientX);
        y.jump(event.clientY);
        setVisible(true);
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.(
        INTERACTIVE,
      ) as HTMLElement | null;
      setLabel(target ? (target.dataset.cursorLabel ?? "") : null);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, rawX, rawY, x, y]);

  if (!enabled) return null;

  // The ring only fills when there is a label worth reading. Filling on every
  // interactive element drops an opaque disc over the link being aimed at.
  const labelled = Boolean(label);
  const size = labelled ? 76 : label !== null ? 44 : 26;

  return (
    <motion.div
      aria-hidden
      style={{
        x,
        y,
        // Difference blending inverts the ring against whatever is under it; the
        // filled state opts out so the ember reads as ember. This has to live on
        // the outermost node: any z-indexed ancestor would isolate the blend
        // group and the ring would just stay white.
        mixBlendMode: labelled ? "normal" : "difference",
      }}
      className="pointer-events-none fixed top-0 left-0 z-[100] will-change-transform"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px]"
        animate={{
          width: size,
          height: size,
          backgroundColor: labelled ? "#c2431c" : "rgba(255, 255, 255, 0)",
          borderColor: labelled ? "#c2431c" : "#ffffff",
          scale: pressed ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 520, damping: 32, mass: 0.4 }}
      >
        <AnimatePresence>
          {labelled ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="font-mono text-[0.58rem] font-medium tracking-[0.12em] text-[#fdf6ee] uppercase"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
