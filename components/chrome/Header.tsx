"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { lockScroll } from "@/lib/lenis-store";
import { easeOutExpo } from "@/lib/motion";
import { Logo } from "./Logo";

/**
 * Floating navy capsule. It reads on every section theme, tucks away while
 * the visitor scrolls down into content and returns the moment they scroll up.
 */
export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(value > 240 && value > previous);
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
      <motion.header
        className="fixed inset-x-0 top-3 z-[70] px-3 md:top-5"
        animate={{ y: hidden && !open ? -120 : 0 }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
      >
        <div className="mx-auto flex max-w-[64rem] items-center justify-between gap-4 rounded-full border border-white/10 bg-midnight py-2 pr-2 pl-5 text-chalk md:bg-midnight/88 md:shadow-[0_18px_50px_-20px_rgba(10,23,51,0.55)] md:backdrop-blur-xl">
          <Link href="/" aria-label={`${site.name}, home`} className="py-2">
            <Logo className="text-[1.05rem]" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2.5 text-[0.92rem] font-semibold transition-colors duration-200",
                    active ? "text-midnight" : "text-chalk/75 hover:text-chalk",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-chalk"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden min-h-11 items-center rounded-full bg-saffron px-5 font-display text-[0.92rem] font-bold text-midnight transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97] sm:inline-flex"
            >
              Start a project
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 md:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 block h-[2px] w-full rounded bg-chalk transition-all duration-300",
                    open ? "top-[5px] rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-[2px] w-full rounded bg-chalk transition-all duration-300",
                    open ? "top-[5px] -rotate-45" : "top-[10px]",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="theme-midnight fixed inset-0 z-[65] flex flex-col justify-between px-6 pt-28 pb-10 md:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ label: "Home", href: "/" }, ...site.nav].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.06, duration: 0.6, ease: easeOutExpo }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-rule py-5"
                  >
                    <span className="font-display text-[2.4rem] leading-none font-bold tracking-[-0.04em]">
                      {item.label}
                    </span>
                    <span aria-hidden className="text-saffron">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="space-y-4"
            >
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex min-h-14 items-center justify-center rounded-full bg-saffron font-display text-lg font-bold text-midnight"
              >
                Start a project
              </Link>
              {site.contact.emails.map((email) => (
                <a key={email} href={`mailto:${email}`} className="block text-center text-muted">
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
