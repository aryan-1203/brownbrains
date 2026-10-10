import type { Metadata } from "next";
import { stages } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { HeroSignal } from "@/components/approach/HeroSignal";
import { StageMachine } from "@/components/approach/StageMachine";
import { EngagementFan } from "@/components/approach/EngagementFan";
import { PrinciplesFocus } from "@/components/approach/PrinciplesFocus";
import { ClosingSpiral } from "@/components/approach/ClosingSpiral";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Five stages from signal to shipped, three ways to work together, and six rules we keep.",
  alternates: { canonical: "/approach" },
};

export default function ApproachPage() {
  return (
    <>
      {/* Hero */}
      <Section
        theme="midnight"
        pad={false}
        className="overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28"
      >
        <div className="shell grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>Approach</Eyebrow>
            <SplitReveal
              as="h1"
              immediate
              text="From signal to shipped."
              accent={["shipped."]}
              className="mt-6 text-display"
            />
            <Reveal immediate delay={0.35}>
              <p className="lead mt-6 max-w-md">
                Five stages. Marketing and engineering in one room, the whole
                way through.
              </p>
            </Reveal>
            <Reveal immediate delay={0.5} className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact">Start a project</Button>
              <Button href="#stages" variant="ghost" arrow={false}>
                See the stages
              </Button>
            </Reveal>
          </div>
          <div className="mx-auto w-full max-w-xl">
            <HeroSignal />
          </div>
        </div>

        <ol className="shell mt-16 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-muted md:mt-20">
          {stages.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2">
              <span className="text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </li>
          ))}
        </ol>
      </Section>

      {/* The five stages */}
      <Section
        theme="chalk"
        id="stages"
        pad={false}
        className="pt-24 pb-20 md:pt-32 lg:pb-8"
      >
        <div className="shell">
          <Eyebrow>How it runs</Eyebrow>
          <SplitReveal
            text="Five stages. One line."
            accent={["line."]}
            className="mt-5 max-w-2xl text-title"
          />
          <p className="lead mt-5 max-w-md">
            Scroll the machine. Each stop changes the shape of the work.
          </p>
        </div>
        <StageMachine />
      </Section>

      {/* Engagement models */}
      <Section theme="midnight" className="overflow-x-clip">
        <div className="shell">
          <Eyebrow>Ways to work</Eyebrow>
          <SplitReveal
            text="Three ways in."
            accent={["in."]}
            className="mt-5 text-title"
          />
          <p className="lead mt-5 max-w-md">
            Pick a shape. Scope and price are agreed before we start.
          </p>
          <EngagementFan />
          <Reveal className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4">
            <p className="text-lg font-semibold">
              Not sure which fits? We will tell you on the first call.
            </p>
            <Button href="/contact" variant="secondary">
              Ask us
            </Button>
          </Reveal>
        </div>
      </Section>

      {/* Principles */}
      <Section theme="saffron" className="overflow-x-clip">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>How we behave</Eyebrow>
            <SplitReveal
              text="Six rules we keep."
              className="mt-5 text-title"
            />
            <p className="lead mt-5 max-w-xs">Hold us to every one.</p>
          </div>
          <PrinciplesFocus />
        </div>
      </Section>

      {/* Closing CTA */}
      <Section theme="cobalt" className="overflow-hidden">
        <div className="shell grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SplitReveal
              text="Start with one honest call."
              className="text-display"
            />
            <Reveal delay={0.15}>
              <p className="lead mt-6 max-w-md">
                Bring the problem. We will tell you which stage it starts at.
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-9">
              <Button href="/contact">Book a call</Button>
            </Reveal>
          </div>
          <div className="mx-auto w-full max-w-[16rem] md:max-w-sm">
            <ClosingSpiral />
          </div>
        </div>
      </Section>
    </>
  );
}
