import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { faqs } from "@/content/faq";
import { site, contactTelHref } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { ConversationGraphic } from "@/components/contact/ConversationGraphic";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { LocalTime } from "@/components/contact/LocalTime";
import { NextSteps } from "@/components/contact/NextSteps";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell Brown Brains what you are building. A senior person replies from ${site.contact.city} within one working day.`,
  alternates: { canonical: "/contact" },
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-midnight-3 text-saffron transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-105"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

function DirectRow({
  href,
  label,
  value,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  value: string;
  icon: ReactNode;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex min-h-14 items-center gap-4 rounded-2xl px-2 py-2 transition-colors duration-200 hover:bg-midnight-2"
      >
        <Icon>{icon}</Icon>
        <span className="min-w-0">
          <span className="block text-xs font-bold tracking-[0.14em] text-muted uppercase">
            {label}
          </span>
          <span className="block truncate font-display text-[1.05rem] font-semibold">
            {value}
          </span>
        </span>
      </a>
    </li>
  );
}

export default function ContactPage() {
  const email = site.contact.emails[0];
  const phone = site.contact.phones[0];
  const whatsappHref = site.contact.whatsapp
    ? `https://wa.me/${site.contact.whatsapp}`
    : null;

  return (
    <>
      {/* Hero */}
      <Section
        theme="midnight"
        pad={false}
        className="overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28"
      >
        <div
          aria-hidden
          className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]"
        />
        <div className="shell relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <SplitReveal
              as="h1"
              immediate
              text="Let's talk about what's next."
              accent={["next."]}
              className="mt-6 text-display"
            />
            <Reveal delay={0.35}>
              <p className="lead mt-6 max-w-md">
                Tell us what you are building. A senior person replies within
                one working day.
              </p>
              <p className="mt-8 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-rule bg-surface px-4 text-sm font-semibold">
                <span
                  aria-hidden
                  className="animate-pulse-dot h-2 w-2 rounded-full bg-mint"
                />
                <LocalTime city={site.contact.city} />
                <span aria-hidden className="hidden text-muted sm:inline">
                  ·
                </span>
                <span className="hidden text-muted sm:inline">
                  {site.contact.timezone}
                </span>
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={0.2}
            y={40}
            className="mx-auto w-full max-w-md lg:mr-0"
          >
            <ConversationGraphic />
          </Reveal>
        </div>
      </Section>

      {/* Form + direct lines */}
      <Section theme="chalk" pad={false} className="py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <div
            id="form"
            className="relative scroll-mt-28 rounded-card bg-surface p-6 shadow-[0_24px_60px_-30px_rgba(10,23,51,0.28)] ring-1 ring-rule sm:p-8 md:p-12"
          >
            <div className="mb-8">
              <h2 className="text-title">Tell us the situation.</h2>
            </div>
            {/* useSearchParams needs a boundary so the rest of the page can stay static. */}
            <Suspense
              fallback={
                <div
                  aria-hidden
                  className="h-[46rem] animate-pulse rounded-2xl bg-chalk"
                />
              }
            >
              <ContactForm />
            </Suspense>
          </div>

          <aside
            className="space-y-6 lg:sticky lg:top-28 lg:self-start"
            aria-label="Other ways to reach us"
          >
            <div className="theme-midnight rounded-card p-5 sm:p-6">
              <p className="eyebrow px-2">Prefer to skip the form</p>
              <ul className="mt-4 space-y-1">
                <DirectRow
                  href={`mailto:${email}`}
                  label="Email"
                  value={email}
                  icon={<path d="M4 6h16v12H4zM4 7l8 6 8-6" />}
                />
                <DirectRow
                  href={contactTelHref(phone)}
                  label="Call"
                  value={phone}
                  icon={
                    <path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2Z" />
                  }
                />
                {whatsappHref ? (
                  <DirectRow
                    href={whatsappHref}
                    label="WhatsApp"
                    value="Message us"
                    external
                    icon={
                      <path d="M4 20l1.3-3.8A8 8 0 1 1 8 19Z M9 9.5c0 3 2.5 5.5 5.5 5.5" />
                    }
                  />
                ) : null}
              </ul>
              <p className="mt-4 flex items-center gap-2 border-t border-rule px-2 pt-4 text-sm text-muted">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-sky"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
                  <circle cx="12" cy="10" r="2.3" />
                </svg>
                {site.contact.city}, {site.contact.country} ·{" "}
                {site.contact.timezone}
              </p>
            </div>

            <div className="rounded-card border border-rule p-6 sm:p-7">
              <h2 className="eyebrow">What happens next</h2>
              <div className="mt-6">
                <NextSteps />
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* FAQ */}
      <Section theme="saffron">
        <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <SplitReveal text="Quick answers." className="mt-5 text-title" />
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-xs text-[1.05rem] text-muted">
                Something else on your mind?{" "}
                <a
                  href="#form"
                  className="font-semibold text-ink underline decoration-2 underline-offset-4 focus-visible:outline-midnight"
                >
                  Ask in the form
                </a>
                .
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
