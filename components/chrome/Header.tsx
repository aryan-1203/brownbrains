"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/lenis-store";
import { easeOutExpo } from "@/lib/motion";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // The home hero is split light/dark, so the header stays transparent and
  // blend-inverted until the visitor has scrolled clear of it.
  const overSplitHero = pathname === "/" && !condensed;

  useMotionValueEvent(scrollY, "change", (value) => {
    const threshold = pathname === "/" ? window.innerHeight * 0.82 : 40;
    setCondensed(value > threshold);
  });

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[padding,background-color,border-color] duration-500",
          condensed
            ? "border-b border-rule bg-bg/78 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-5",
          overSplitHero && !open && "text-white max-md:text-white md:mix-blend-difference",
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className={overSplitHero ? "text-white" : "text-ink"}
            data-cursor-label="home"
          >
            <Logo className="text-[1.0625rem] md:text-[1.15rem]" />
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {site.nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    "link-underline font-mono text-[0.72rem] tracking-[0.14em] uppercase transition-colors duration-300",
                    overSplitHero
                      ? active
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                      : active
                        ? "text-ink"
                        : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className={cn(
                "group relative overflow-hidden rounded-full border px-5 py-2.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase",
                overSplitHero ? "border-white text-white" : "border-ink text-ink",
              )}
              data-cursor-label="talk"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0",
                  overSplitHero ? "bg-white" : "bg-ink",
                )}
              />
              <span
                className={cn(
                  "relative z-10 transition-colors duration-300",
                  overSplitHero ? "group-hover:text-black" : "group-hover:text-bg",
                )}
              >
                Start a project
              </span>
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-[70] flex h-10 w-10 items-center justify-center md:hidden"
          >
            <span className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  overSplitHero ? "bg-white" : "bg-ink",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  overSplitHero ? "bg-white" : "bg-ink",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="tone-machine fixed inset-0 z-[60] flex flex-col justify-between bg-bg px-6 pt-28 pb-10 text-ink md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <nav className="flex flex-col gap-2">
              {[{ label: "Home", href: "/" }, ...site.nav].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.14 + index * 0.06,
                    duration: 0.6,
                    ease: easeOutExpo,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-rule py-4"
                  >
                    <span className="mono-label text-filament">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[2.35rem] leading-none">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="space-y-2"
            >
              <p className="mono-label">Say hello</p>
              {site.contact.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  onClick={() => setOpen(false)}
                  className="link-underline text-lg"
                >
                  {email}
                </a>
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
