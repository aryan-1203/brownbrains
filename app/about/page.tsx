import type { Metadata } from "next";
import { founders } from "@/content/founders";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { HalvesMark } from "@/components/about/HalvesMark";
import { LeaderCard } from "@/components/about/LeaderCard";
import { Horizon } from "@/components/about/Horizon";
import { NotList, type NotItem } from "@/components/about/NotList";
import { RoleRows } from "@/components/about/RoleRows";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the people leading Brown Brains: marketing and engineering under one roof, answerable for one result.",
  alternates: { canonical: "/about" },
};

const notList: NotItem[] = [
  { not: "Two vendors", instead: "One team, one plan, one invoice." },
  { not: "Juniors on your account", instead: "Senior people on the work." },
  { not: "Templates for everyone", instead: "Built around your problem." },
  { not: "Retainer traps", instead: "Monthly work you can cancel." },
  { not: "Vanity metrics", instead: "Judged on revenue and usage." },
];

const roles = [
  "Strategists",
  "Brand designers",
  "Engineers",
  "Marketers",
  "Writers",
  "Product designers",
  "Analysts",
  "AI builders",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section theme="midnight" pad={false} className="overflow-hidden">
        <div className="shell grid items-center gap-12 pt-36 pb-20 md:pt-44 md:pb-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal y={16}>
              <Eyebrow>About</Eyebrow>
            </Reveal>
            <SplitReveal
              as="h1"
              immediate
              delay={0.1}
              text="Built by people who ship."
              accent={["ship."]}
              className="mt-6 text-display font-black"
            />
            <Reveal delay={0.35} y={20}>
              <p className="lead mt-6 max-w-md">
                Marketing leadership and engineering under one roof, answerable
                for one result.
              </p>
            </Reveal>
            <Reveal delay={0.5} y={20} className="mt-9">
              <Button href="#leadership" variant="secondary">
                Meet the leadership
              </Button>
            </Reveal>
          </div>
          <HalvesMark className="mx-auto aspect-square w-full max-w-[22rem] text-sky md:max-w-[28rem]" />
        </div>
      </Section>

      {/* Story */}
      <Section theme="chalk">
        <div className="shell max-w-5xl">
          <Eyebrow>Why we exist</Eyebrow>
          <ScrollWords
            text="Strategy got written in one office and built in another. Budgets vanished in the gap, so we closed it."
            accent={["gap,", "closed", "it."]}
            className="mt-8 font-display text-title font-bold tracking-[-0.035em] leading-[1.08]"
          />
        </div>
      </Section>

      {/* Leadership */}
      <Section theme="midnight" id="leadership" className="scroll-mt-24 overflow-hidden">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <Eyebrow>Leadership</Eyebrow>
              <SplitReveal
                text="The people at the helm."
                accent={["helm."]}
                className="mt-6 text-title font-extrabold"
              />
            </div>
            <Reveal delay={0.15}>
              <p className="lead max-w-sm">
                Backed by a team of strategists, designers, engineers and
                marketers.
              </p>
            </Reveal>
          </div>

          <Horizon className="mt-12 md:mt-16" />

          <div className="mx-auto mt-12 grid max-w-md gap-16 md:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-10 xl:gap-14">
            {founders.map((founder, index) => (
              <LeaderCard key={founder.name} founder={founder} index={index} />
            ))}
          </div>
        </div>
      </Section>

      {/* How we work */}
      <Section theme="cobalt">
        <div className="shell">
          <div className="max-w-2xl">
            <Eyebrow>How we work</Eyebrow>
            <SplitReveal
              text="What we are not."
              accent={["not."]}
              className="mt-6 text-title font-extrabold"
            />
          </div>
          <div className="mt-12 md:mt-16">
            <NotList items={notList} />
          </div>
        </div>
      </Section>

      {/* Wider team */}
      <Section theme="saffron" className="overflow-hidden">
        <div className="shell grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Eyebrow>Behind the leadership</Eyebrow>
            <SplitReveal
              text="A bench for every brief."
              className="mt-6 text-title font-extrabold"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="lead max-w-sm">
              The right specialist joins your project when it needs one. Same
              roof, same plan.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 md:mt-20">
          <RoleRows roles={roles} />
        </div>
      </Section>

      {/* Closing CTA */}
      <Section theme="chalk" className="overflow-hidden">
        <div className="shell grid items-center gap-12 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <SplitReveal
              text="Talk to the team."
              accent={["team."]}
              className="text-display font-black"
            />
            <Reveal delay={0.2}>
              <p className="lead mt-5 max-w-md">
                Strategy, software, or both. Tell us what you are building.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-9">
              <Button href="/contact">Start a conversation</Button>
            </Reveal>
          </div>
          <HalvesMark
            mode="close-on-scroll"
            className="mx-auto aspect-square w-48 text-midnight md:w-64"
          />
        </div>
      </Section>
    </>
  );
}
