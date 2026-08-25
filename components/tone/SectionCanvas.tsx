"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const SynapseCanvas = dynamic(
  () =>
    import("@/components/fx/SynapseCanvas").then((m) => ({
      default: m.SynapseCanvas,
    })),
  { ssr: false },
);

/** Mounts the neuron canvas only once the section is near the viewport. */
export function SectionCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0 -z-10">
      {active ? <SynapseCanvas /> : null}
    </div>
  );
}
