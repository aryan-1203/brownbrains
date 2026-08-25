"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Tone = "paper" | "machine";

type ToneContextValue = {
  /** Tone of the section currently occupying the middle of the viewport. */
  tone: Tone;
  /** True when the visitor asked the OS to reduce motion. */
  reduced: boolean;
  /** Sections register themselves so the provider can pick a winner. */
  register: (el: HTMLElement, tone: Tone) => () => void;
};

const ToneContext = createContext<ToneContextValue>({
  tone: "paper",
  reduced: false,
  register: () => () => {},
});

export function useTone() {
  return useContext(ToneContext);
}

export function ToneProvider({ children }: { children: React.ReactNode }) {
  const [tone, setTone] = useState<Tone>("paper");
  const [reduced, setReduced] = useState(false);

  // Every registered section, plus how much of the viewport centre it covers.
  const entries = useRef(new Map<HTMLElement, { tone: Tone; score: number }>());
  const observer = useRef<IntersectionObserver | null>(null);

  const recompute = useCallback(() => {
    let best: { tone: Tone; score: number } | null = null;
    for (const entry of entries.current.values()) {
      if (entry.score <= 0) continue;
      if (!best || entry.score > best.score) best = entry;
    }
    if (best) setTone(best.tone);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    // A narrow band across the middle of the screen decides the active tone,
    // so the chrome flips exactly when the seam passes the visitor's eyeline.
    observer.current = new IntersectionObserver(
      (observed) => {
        for (const record of observed) {
          const el = record.target as HTMLElement;
          const existing = entries.current.get(el);
          if (!existing) continue;
          existing.score = record.intersectionRatio;
        }
        recompute();
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of entries.current.keys()) observer.current.observe(el);

    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [recompute]);

  const register = useCallback((el: HTMLElement, sectionTone: Tone) => {
    entries.current.set(el, { tone: sectionTone, score: 0 });
    observer.current?.observe(el);
    return () => {
      observer.current?.unobserve(el);
      entries.current.delete(el);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.tone = tone;
  }, [tone]);

  useEffect(() => {
    document.documentElement.dataset.cursor = reduced ? "native" : "custom";
    return () => {
      delete document.documentElement.dataset.cursor;
    };
  }, [reduced]);

  const value = useMemo(
    () => ({ tone, reduced, register }),
    [tone, reduced, register],
  );

  return <ToneContext.Provider value={value}>{children}</ToneContext.Provider>;
}
