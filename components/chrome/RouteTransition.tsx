"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { easeInOutQuart } from "@/lib/motion";

function routeLabel(pathname: string) {
  if (pathname === "/") return "Home";
  const match = site.nav.find((item) => pathname.startsWith(item.href));
  return match?.label ?? pathname.replace("/", "");
}

/**
 * Between routes, a saffron and a cobalt panel sweep across from opposite
 * sides and meet in the middle — the logo's two halves, at screen scale.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [sweeping, setSweeping] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const reduced = useReducedMotion();

  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (!reduced) setSweeping(pathname);
  }

  useEffect(() => {
    if (!sweeping) return;
    const timer = setTimeout(() => setSweeping(null), 520);
    return () => clearTimeout(timer);
  }, [sweeping]);

  return (
    <AnimatePresence>
      {sweeping ? (
        <motion.div
          key={sweeping}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[95] flex"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="h-full w-1/2 bg-saffron"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.38, ease: easeInOutQuart }}
          />
          <motion.div
            className="h-full w-1/2 bg-cobalt"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.38, ease: easeInOutQuart }}
          />
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-display text-[clamp(2.5rem,9vw,6.5rem)] font-bold tracking-[-0.04em] text-midnight"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            {routeLabel(sweeping)}
          </motion.span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
