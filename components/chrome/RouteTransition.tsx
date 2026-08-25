"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import { easeInOutQuart, easeOutExpo } from "@/lib/motion";
import { useTone } from "@/components/tone/ToneProvider";

function routeLabel(pathname: string) {
  if (pathname === "/") return site.name;
  const match = site.nav.find((item) => pathname.startsWith(item.href));
  return match?.label ?? pathname.replace("/", "");
}

/** Warm panel that sweeps up across the viewport between routes. */
export function RouteTransition() {
  const pathname = usePathname();
  const [sweeping, setSweeping] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const { reduced } = useTone();

  // Comparing against the previous route during render means the sweep starts on
  // the same commit as the new page, with no extra frame of the old one.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (!reduced) setSweeping(pathname);
  }

  useEffect(() => {
    if (!sweeping) return;
    const timer = setTimeout(() => setSweeping(null), 820);
    return () => clearTimeout(timer);
  }, [sweeping]);

  const label = sweeping ? routeLabel(sweeping) : "";

  return (
    <AnimatePresence>
      {sweeping ? (
        <motion.div
          key={sweeping}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center bg-[#14100e]"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.62, ease: easeInOutQuart }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.34, ease: easeOutExpo }}
            className="flex flex-col items-center gap-5 px-6 text-center"
          >
            {label === site.name ? null : (
              <span className="font-mono text-[0.62rem] tracking-[0.34em] text-[#a2938a] uppercase">
                {site.name}
              </span>
            )}
            <span className="font-display text-[clamp(2.75rem,11vw,7.5rem)] leading-[0.85] font-[380] tracking-[-0.035em] text-[#f0e9df]">
              {label}
            </span>
            <span
              aria-hidden
              className="h-px w-16 bg-[#e9b44c]"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
