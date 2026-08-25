import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { services, type Service } from "@/content/services";
import { capabilities, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Section } from "@/components/tone/Section";
import { ToneBridge } from "@/components/tone/ToneBridge";
import { PageHero } from "@/components/layout/PageHero";
import { Marquee } from "@/components/fx/Marquee";
import { MagneticButton } from "@/components/fx/MagneticButton";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Marketing, consultation, brand building, web development, AI workflows, app development and product building — delivered by the studio you meet, not a relay chain.",
  alternates: { canonical: "/services" },
};

const sideCopy = {
  human: "Human led",
  machine: "Machine led",
  both: "Both halves",
} as const;

/** Only fully machine-led work goes dark; "both" stays on paper. */
const toneFor = (side: Service["side"]) =>
  side === "machine" ? "machine" : "paper";

export default function ServicesPage() {
  return (
    <>
      <Section tone="paper" pad="none" className="pb-20 md:pb-28">
        <PageHero
          kicker="Services"
          title="Seven capabilities that share one brain"
          accent={["one"]}
          lead="Hire us for one of them or all of them. The order below is roughly the order a business needs them, and the page gets warmer or cooler depending on which half of the studio leads the work."
          aside={
            <nav aria-label="Jump to a service" className="space-y-2">
              <p className="mono-label">Jump to</p>
              {services.map((service, index) => (
                <Link
                  key={service.slug}
                  href={`#${service.slug}`}
                  className="link-underline flex items-baseline gap-3 text-sm text-muted transition-colors hover:text-ink"
                >
                  <span className="font-mono text-[0.66rem] text-faint tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {service.title}
                </Link>
              ))}
            </nav>
          }
        />
      </Section>

      {services.map((service, index) => {
        const tone = toneFor(service.side);
        // The section above the first service is the paper page hero.
        const previous = index === 0 ? "paper" : toneFor(services[index - 1].side);
        const flips = previous !== tone;

        return (
          <Fragment key={service.slug}>
            {flips ? <ToneBridge from={previous} to={tone} /> : null}
          <Section
            id={service.slug}
            tone={tone}
            pad="md"
            seam={!flips}
            canvas={tone === "machine"}
            className="scroll-mt-24"
          >
            <div className="shell grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[0.72rem] text-faint tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase",
                      service.side === "both"
                        ? "border-signal/60 text-signal-soft"
                        : "border-rule text-muted",
                    )}
                  >
                    {sideCopy[service.side]}
                  </span>
                </div>
                <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.94]">
                  {service.title}
                </h2>
                <p className="mt-5 max-w-sm text-lead leading-[1.5]">
                  {service.blurb}
                </p>
              </div>

              <div>
                <p className="max-w-2xl text-[1.05rem] leading-[1.7] text-muted">
                  {service.detail}
                </p>

                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="mono-label">What you get</p>
                    <ul className="mt-4 space-y-3 border-t border-rule pt-4">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[0.925rem] leading-snug text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-ember"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-rule bg-surface p-6">
                    <p className="mono-label">Outcome</p>
                    <p className="mt-3 font-display text-[1.35rem] leading-snug">
                      {service.outcome}
                    </p>
                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="mt-6 inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] text-ember uppercase"
                      data-cursor-label="enquire"
                    >
                      <span className="link-underline">Enquire about this</span>
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Section>
          </Fragment>
        );
      })}

      <ToneBridge from="paper" to="machine" />

      <Section tone="machine" pad="none" className="py-9 md:py-12">
        <Marquee items={capabilities} speed={2} />
      </Section>

      <ToneBridge from="machine" to="ember" />

      <Section tone="machine" pad="lg" className="tone-ember">
        <div className="shell max-w-3xl">
          <p className="font-mono text-[0.68rem] tracking-[0.2em] text-muted uppercase">
            Not sure which one you need
          </p>
          <h2 className="mt-6 font-display text-title leading-[0.95]">
            That is usually the first thing we work out together.
          </h2>
          <p className="lead mt-6 max-w-xl">
            Send over the situation and we will tell you which of the seven
            actually applies, including the ones you do not need yet.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="/contact"
              cursorLabel="write"
              className="!bg-[#fdf6ee] !text-[#7d2a0e]"
            >
              Start a project
            </MagneticButton>
            {site.contact.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="link-underline font-mono text-[0.72rem] tracking-[0.12em] text-muted uppercase hover:text-ink"
              >
                {email}
              </a>
            ))}
          </div>
        </div>
      </Section>

      <ToneBridge from="ember" to="machine" />
    </>
  );
}
