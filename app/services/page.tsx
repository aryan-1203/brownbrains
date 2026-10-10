import type { Metadata } from "next";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Parallax } from "@/components/motion/Parallax";
import { ServicesSpectrum } from "@/components/services/ServicesSpectrum";
import { ServiceScroller } from "@/components/services/ServiceScroller";
import { SideMerge } from "@/components/services/SideMerge";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Marketing, brand, consultation, web, apps, AI workflows and product building. Take one side or both, from one team.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const email = site.contact.emails[0];

  return (
    <>
      {/* Hero: the two halves and the overlap, every service in its place. */}
      <Section theme="chalk" pad={false} className="overflow-x-clip pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="shell grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <Reveal immediate y={16}>
              <Eyebrow>Services</Eyebrow>
            </Reveal>
            <SplitReveal
              as="h1"
              immediate
              delay={0.1}
              text="Seven services. One team."
              accent={["One"]}
              className="mt-6 text-display"
            />
            <Reveal immediate delay={0.35} y={20}>
              <p className="lead mt-6 max-w-md">
                Take one side or both. Marketing and engineering, planned
                together.
              </p>
            </Reveal>
            <Reveal immediate delay={0.5} y={20} className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact">Start a project</Button>
              <Button href="#all-services" variant="secondary" arrow={false}>
                See all seven
              </Button>
            </Reveal>
          </div>

          <ServicesSpectrum />
        </div>
      </Section>

      {/* Signature: sticky stage that redraws per service. */}
      <Section theme="midnight" id="all-services" className="scroll-mt-0">
        <div className="shell mb-10 lg:mb-4">
          <Eyebrow>The seven</Eyebrow>
          <SplitReveal
            text="Scroll. Pick what fits."
            accent={["fits."]}
            className="mt-5 max-w-3xl text-title"
          />
        </div>
        <ServiceScroller />
      </Section>

      {/* How the halves combine. */}
      <Section theme="chalk">
        <div className="shell">
          <div className="max-w-2xl">
            <Eyebrow>Mix and match</Eyebrow>
            <SplitReveal
              text="Pick one side. Or both."
              accent={["both."]}
              className="mt-5 text-title"
            />
            <Reveal delay={0.15}>
              <p className="lead mt-5">
                Start with one. Adding the other is a conversation, not a new
                vendor.
              </p>
            </Reveal>
          </div>
          <SideMerge />
        </div>
      </Section>

      {/* Close. */}
      <Section theme="saffron" className="overflow-hidden">
        <Parallax
          speed={60}
          className="pointer-events-none absolute -top-24 -right-40 md:-right-16"
        >
          <svg
            aria-hidden
            focusable="false"
            viewBox="0 0 600 340"
            className="w-[36rem] max-w-none opacity-90 md:w-[44rem]"
          >
            <circle cx={220} cy={170} r={150} fill="none" stroke="#0a1733" strokeOpacity={0.14} strokeWidth={2} />
            <circle cx={380} cy={170} r={150} fill="none" stroke="#0a1733" strokeOpacity={0.14} strokeWidth={2} />
            <path
              d="M300 43.1A150 150 0 0 1 300 296.9A150 150 0 0 1 300 43.1Z"
              fill="#0a1733"
              fillOpacity={0.08}
            />
          </svg>
        </Parallax>

        <div className="shell relative">
          <Eyebrow>Not sure yet</Eyebrow>
          <SplitReveal
            text="Not sure which you need?"
            className="mt-5 max-w-3xl text-display"
          />
          <Reveal delay={0.15}>
            <p className="lead mt-6 max-w-lg">
              Tell us the problem. We will say what fits, and what to skip.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="/contact">Start a project</Button>
            <a
              href={`mailto:${email}`}
              className="inline-flex min-h-11 items-center font-display font-semibold"
            >
              <span className="link-underline">{email}</span>
            </a>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
