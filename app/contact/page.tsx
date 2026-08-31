import type { Metadata } from "next";
import { Suspense } from "react";
import { faqs } from "@/content/founders";
import { site, contactMailtoHref, contactTelHref } from "@/content/site";
import { Section } from "@/components/tone/Section";
import { ToneBridge } from "@/components/tone/ToneBridge";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { WordReveal } from "@/components/fx/WordReveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Tell Brown Brains what you are building. We read every enquiry and reply from ${site.contact.city} within a working day.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const whatsappHref = site.contact.whatsapp
    ? `https://wa.me/${site.contact.whatsapp}`
    : null;

  return (
    <>
      <Section tone="paper" pad="none" className="pb-16">
        <PageHero
          kicker="Contact"
          title="Tell us the situation"
          accent={["situation"]}
          lead="Five fields. No discovery-call funnel. We reply within a working day."
          aside={
            <div className="space-y-5">
              <div>
                <p className="mono-label">Direct</p>
                {site.contact.emails.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="link-underline mt-2 block text-lg"
                  >
                    {email}
                  </a>
                ))}
                {site.contact.phones.map((phone) => (
                  <a
                    key={phone}
                    href={contactTelHref(phone)}
                    className="link-underline mt-1 block text-lg"
                  >
                    {phone}
                  </a>
                ))}
              </div>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 font-mono text-[0.68rem] tracking-[0.12em] text-muted uppercase transition-colors hover:border-ember hover:text-ink"
                >
                  Message on WhatsApp
                  <span aria-hidden>&rarr;</span>
                </a>
              ) : null}
              <p className="text-sm text-muted">
                {site.contact.city}, {site.contact.country} · {site.contact.timezone}
              </p>
            </div>
          }
        />
      </Section>

      <Section tone="paper" pad="lg" seam>
        <div className="shell grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-24">
          {/* useSearchParams needs a boundary so the rest of the page can stay static. */}
          <Suspense
            fallback={
              <div
                aria-hidden
                className="h-[42rem] animate-pulse rounded-2xl border border-rule bg-surface/50"
              />
            }
          >
            <ContactForm />
          </Suspense>

          <aside className="space-y-10 lg:pt-4">
            <div className="rounded-2xl border border-rule bg-surface p-7">
              <p className="mono-label">What happens next</p>
              <ol className="mt-5 space-y-4">
                {[
                  "We read it, usually the same day.",
                  "You get a straight reply: whether we are a fit, and what we would do first.",
                  "If it makes sense, we book one call and write the scope down.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-mono text-[0.68rem] text-ember tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.925rem] leading-[1.6] text-muted">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <p className="mono-label">Common questions</p>
              <div className="mt-5 divide-y divide-rule border-t border-rule">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group py-4">
                    <summary className="flex cursor-pointer items-start justify-between gap-4 text-[0.95rem] leading-snug marker:content-none">
                      {faq.q}
                      <span
                        aria-hidden
                        className="mt-0.5 shrink-0 font-mono text-ember transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-[0.9rem] leading-[1.65] text-muted">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <ToneBridge from="paper" to="machine" />

      <Section tone="machine" pad="lg" canvas>
        <div className="shell max-w-3xl">
          <p className="mono-label">Prefer to skip the form</p>
          <WordReveal
            text="Write one paragraph and email it."
            className="mt-5 text-title"
            accent={["one"]}
          />
          <a
            href={contactMailtoHref("Project enquiry")}
            className="mt-8 inline-block font-display text-[clamp(1.4rem,3vw,2.2rem)] text-filament"
            data-cursor-label="email"
          >
            <span className="link-underline">
              {site.contact.emails.join(", ")}
            </span>
          </a>
        </div>
      </Section>
    </>
  );
}
