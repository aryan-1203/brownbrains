"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useTransform } from "@/lib/use-transform";
import { contactTelHref, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";

const letters = site.name.split("");

/** Closing band. The giant wordmark assembles itself as the page bottoms out. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  return (
    <footer ref={ref} className="theme-midnight relative overflow-hidden pt-24 md:pt-32">
      <div className="shell">
        <div className="grid gap-12 border-b border-rule pb-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.95]">
              Got something worth building?
            </h2>
            <p className="lead mt-5 max-w-md">
              Tell us where you are stuck. We reply within one working day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact">Start a project</Button>
              {site.contact.whatsapp ? (
                <Button
                  href={`https://wa.me/${site.contact.whatsapp}`}
                  variant="secondary"
                  arrow={false}
                >
                  WhatsApp us
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-[0.98rem]">
            <div>
              <p className="eyebrow">Explore</p>
              <ul className="mt-5 space-y-3">
                {[{ label: "Home", href: "/" }, ...site.nav].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-underline text-ink/85 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Reach us</p>
              <ul className="mt-5 space-y-3 break-words">
                {site.contact.emails.map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`} className="link-underline text-ink/85 hover:text-ink">
                      {email}
                    </a>
                  </li>
                ))}
                {site.contact.phones.map((phone) => (
                  <li key={phone}>
                    <a href={contactTelHref(phone)} className="link-underline text-ink/85 hover:text-ink">
                      {phone}
                    </a>
                  </li>
                ))}
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-ink/85 hover:text-ink"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-[0.88rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <Logo className="text-[1rem] text-ink" />
          <p>
            &copy; {site.legalName} · {site.contact.city}, {site.contact.country}
          </p>
          <Link href="/privacy" className="link-underline hover:text-ink">
            Privacy
          </Link>
        </div>
      </div>

      <p
        aria-hidden
        className="flex select-none justify-center overflow-hidden px-2 pb-2 font-display text-[clamp(3.5rem,15.5vw,15rem)] leading-[0.8] font-black tracking-[-0.06em] whitespace-nowrap"
      >
        {letters.map((letter, index) => (
          <FooterLetter
            key={`${letter}-${index}`}
            letter={letter}
            index={index}
            total={letters.length}
            progress={scrollYProgress}
            reduced={!!reduced}
          />
        ))}
      </p>
    </footer>
  );
}

function FooterLetter({
  letter,
  index,
  total,
  progress,
  reduced,
}: {
  letter: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) {
  const start = 0.35 + (index / total) * 0.4;
  const y = useTransform(progress, [start, start + 0.25], ["100%", "0%"]);
  // "Brown" in saffron, "Brains" in cobalt-sky: the two halves again.
  const color = index < 5 ? "text-saffron" : "text-sky";

  if (letter === " ") return <span className="w-[0.25em]" />;

  return (
    <motion.span style={reduced ? undefined : { y }} className={`inline-block ${color}`}>
      {letter}
    </motion.span>
  );
}
