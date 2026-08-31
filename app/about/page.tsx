import type { Metadata } from "next";
import { founders } from "@/content/founders";
import { proofStats, site } from "@/content/site";
import { Section } from "@/components/tone/Section";
import { ToneBridge } from "@/components/tone/ToneBridge";
import { PageHero } from "@/components/layout/PageHero";
import { FounderCard } from "@/components/about/FounderCard";
import { WordReveal } from "@/components/fx/WordReveal";
import { MagneticButton } from "@/components/fx/MagneticButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Brown Brains is a growing marketing and engineering studio — decades of brand leadership, a product and engineering team, and one invoice.",
  alternates: { canonical: "/about" },
};

const notList = [
  {
    title: "Not an agency with forty juniors",
    body: "We stay lean on purpose — senior people on the work, a growing team behind them, no endless handoffs.",
  },
  {
    title: "Not a template shop",
    body: "If it can be bought off the shelf, we will tell you to buy it.",
  },
  {
    title: "Not a retainer trap",
    body: "Monthly work is optional and cancellable. Keeping you is a choice you remake.",
  },
];

export default function AboutPage() {
  const [ajay, aryan, rammuni] = founders;

  return (
    <>
      <Section tone="paper" pad="none" className="pb-20 md:pb-28">
        <PageHero
          kicker="About"
          title="A studio built to ship"
          accent={["ship"]}
          lead="Marketing leadership and an engineering team under one roof. We started solving each other's problems — then made it a company."
          aside={
            <dl className="grid grid-cols-2 gap-6">
              {proofStats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-[2.5rem] leading-none">
                      {stat.value}
                      {stat.suffix}
                    </span>
                    <span className="mt-2 block font-mono text-[0.62rem] leading-relaxed tracking-[0.08em] text-muted uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          }
        />
      </Section>

      <Section tone="paper" pad="md" seam>
        <FounderCard founder={ajay} />
      </Section>

      <ToneBridge from="paper" to="machine" />

      <Section tone="machine" pad="md" canvas>
        <FounderCard founder={aryan} mirrored />
      </Section>

      <Section tone="machine" pad="md" canvas>
        <FounderCard founder={rammuni} />
      </Section>

      <ToneBridge from="machine" to="paper" />

      <Section tone="paper" pad="lg">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p className="mono-label">Why we started</p>
            <WordReveal
              text="The gap between strategy and build was the product."
              className="mt-5 text-title"
              accent={["product."]}
            />
          </div>
          <div className="space-y-4 text-[1.05rem] leading-[1.7] text-muted">
            <p>
              Campaigns needed software nobody had built. Products needed
              positioning nobody owned. Two vocabularies, one problem — and the
              gap between vendors is where budgets disappear.
            </p>
            <p>
              {site.name} closes that gap. Marketing and engineering in the same
              room, answerable for the same result.
            </p>
          </div>
        </div>
      </Section>

      <ToneBridge from="paper" to="machine" />

      <Section tone="machine" pad="lg">
        <div className="shell">
          <p className="mono-label">Being clear</p>
          <WordReveal
            text="Three things we are not"
            className="mt-5 max-w-xl text-title"
            accent={["not"]}
          />

          <ul className="mt-14 grid gap-x-14 gap-y-10 border-t border-rule pt-12 md:grid-cols-3">
            {notList.map((item, index) => (
              <li key={item.title}>
                <span className="font-mono text-[0.68rem] text-filament tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-heading leading-tight">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <ToneBridge from="machine" to="ember" />

      <Section tone="machine" pad="lg" className="tone-ember">
        <div className="shell max-w-3xl">
          <h2 className="font-display text-title leading-[0.95]">
            Come work with the team.
          </h2>
          <p className="lead mt-5 max-w-xl">
            Strategy, software, or both — you talk to the people doing the work.
          </p>
          <div className="mt-9">
            <MagneticButton
              href="/contact"
              cursorLabel="write"
              className="!bg-[#fdf6ee] !text-[#7d2a0e]"
            >
              Get in touch
            </MagneticButton>
          </div>
        </div>
      </Section>

      <ToneBridge from="ember" to="machine" />
    </>
  );
}
