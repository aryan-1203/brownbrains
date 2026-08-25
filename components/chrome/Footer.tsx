"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site, contactMailtoHref, contactTelHref } from "@/content/site";
import { services } from "@/content/services";
import { Section } from "@/components/tone/Section";
import { VariableWordmark } from "@/components/fx/VariableWordmark";

/** Live clock in the studio's timezone — a small sign the site is awake. */
function StudioClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs text-filament tabular-nums">
      {time ?? "--:--:--"}
      <span className="animate-blink ml-1">_</span>
    </span>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <Section tone="machine" pad="none" seam className="overflow-hidden">
      <div className="shell pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_2fr]">
          <div>
            <p className="mono-label">Next step</p>
            <h2 className="mt-4 text-title">
              Tell us what you are trying to build.
            </h2>
            <p className="lead mt-5 max-w-sm">
              One reply from both of us, usually within a working day. No
              discovery-call funnel, no pitch deck.
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-3 text-lg"
              data-cursor-label="write"
            >
              <span className="link-underline">Start a conversation</span>
              <span
                aria-hidden
                className="text-ember transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              >
                &rarr;
              </span>
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <nav aria-label="Pages" className="space-y-3">
              <p className="mono-label">Pages</p>
              {[{ label: "Home", href: "/" }, ...site.nav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="link-underline block text-sm text-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <nav aria-label="Services" className="space-y-3">
              <p className="mono-label">Services</p>
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services#${service.slug}`}
                  className="link-underline block text-sm text-muted transition-colors hover:text-ink"
                >
                  {service.title}
                </Link>
              ))}
            </nav>

            <div className="space-y-3">
              <p className="mono-label">Studio</p>
              {site.contact.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="link-underline block text-sm text-muted transition-colors hover:text-ink"
                >
                  {email}
                </a>
              ))}
              {site.contact.phones.map((phone) => (
                <a
                  key={phone}
                  href={contactTelHref(phone)}
                  className="link-underline block text-sm text-muted transition-colors hover:text-ink"
                >
                  {phone}
                </a>
              ))}
              <p className="text-sm text-muted">
                {site.contact.city}, {site.contact.country}
              </p>
              <div className="pt-2">
                <StudioClock />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline font-mono text-[0.68rem] tracking-[0.12em] text-muted uppercase hover:text-ink"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none px-[1.375rem] md:px-10">
        <VariableWordmark
          text="Brown Brains"
          className="w-full text-[clamp(3.2rem,15.5vw,15rem)] text-ink/90"
        />
      </div>

      <div className="shell flex flex-col gap-3 border-t border-rule py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.68rem] tracking-[0.1em] text-faint uppercase">
          &copy; {year} {site.legalName}. Built by the two of us.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="/privacy"
            className="link-underline font-mono text-[0.68rem] tracking-[0.1em] text-faint uppercase hover:text-ink"
          >
            Privacy
          </Link>
          <a
            href="#top"
            className="link-underline font-mono text-[0.68rem] tracking-[0.1em] text-faint uppercase hover:text-ink"
            data-cursor-label="top"
          >
            Back to top
          </a>
        </div>
      </div>
    </Section>
  );
}
