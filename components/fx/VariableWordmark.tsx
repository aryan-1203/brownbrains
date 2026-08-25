"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useTone } from "@/components/tone/ToneProvider";

const INFLUENCE = 260;

/**
 * Oversized wordmark whose letters bend toward the pointer along Fraunces'
 * weight, softness and wonk axes.
 *
 * Letter centres are measured once into document coordinates and cached, so a
 * pointer sweep never reads layout. The listener is only attached while the
 * wordmark is actually on screen, and styles are written straight to the DOM so
 * nothing here triggers a React render.
 */
export function VariableWordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const centers = useRef<Array<{ x: number; y: number } | null>>([]);
  const pointer = useRef({ x: -99999, y: -99999 });
  const raf = useRef(0);
  const { reduced } = useTone();

  const measure = useCallback(() => {
    centers.current = letterRefs.current.map((el) => {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height / 2,
      };
    });
  }, []);

  const paint = useCallback(() => {
    raf.current = 0;
    for (let i = 0; i < letterRefs.current.length; i++) {
      const letter = letterRefs.current[i];
      const center = centers.current[i];
      if (!letter || !center) continue;

      const dx = pointer.current.x - center.x;
      const dy = pointer.current.y - center.y;
      const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / INFLUENCE);
      const eased = proximity * proximity;

      letter.style.fontVariationSettings = `"wght" ${Math.round(
        300 + eased * 600,
      )}, "SOFT" ${Math.round(eased * 100)}, "WONK" ${eased > 0.45 ? 1 : 0}`;
      letter.style.transform = `translateY(${(-eased * 10).toFixed(2)}px)`;
      letter.style.color = eased > 0.6 ? "var(--color-ember)" : "";
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (reduced || !wrap) return;

    let active = false;

    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX + window.scrollX;
      pointer.current.y = event.clientY + window.scrollY;
      if (active && !raf.current) raf.current = requestAnimationFrame(paint);
    };

    const onResize = () => measure();

    const visibility = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) {
          measure();
          if (!raf.current) raf.current = requestAnimationFrame(paint);
        }
      },
      { rootMargin: "60px" },
    );
    visibility.observe(wrap);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    // Swapping in the webfont changes every letter's box.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      visibility.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [measure, paint, reduced]);

  let flatIndex = 0;
  const words = text.split(" ").map((word) =>
    word.split("").map((char) => ({ char, index: flatIndex++ })),
  );

  return (
    <div
      ref={wrapRef}
      className={cn(
        "font-display leading-[0.8] tracking-[-0.035em] select-none",
        className,
      )}
      aria-label={text}
    >
      {words.map((letters, wordIndex) => (
        <span
          key={`word-${wordIndex}`}
          className="inline-block whitespace-nowrap"
        >
          {letters.map(({ char, index }) => (
            <span
              key={index}
              aria-hidden
              ref={(node) => {
                letterRefs.current[index] = node;
              }}
              className="inline-block transition-[color] duration-300 will-change-transform"
              style={{ fontVariationSettings: '"wght" 300, "SOFT" 0, "WONK" 0' }}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 ? (
            <span aria-hidden className="inline-block w-[0.22em]" />
          ) : null}
        </span>
      ))}
    </div>
  );
}
