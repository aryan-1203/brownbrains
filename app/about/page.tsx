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
    "Brown Brains runs on two fronts: three decades of marketing leadership on one side, product and engineering on the other — with a team behind each half.",
  alternates: { canonical: "/about" },
};

const notList = [
  {
    title: "Not an agency with forty juniors",
    body: "We stay lean on purpose — no account layer, no endless handoffs — with senior leadership on both fronts and a team behind each half.",
  },
  {
    title: "Not a template shop",
    body: "Nothing here is assembled from a page builder and resold. If it can be bought off the shelf, we will tell you to buy it.",
  },
  {
    title: "Not a retainer trap",
    body: "Monthly work is optional and cancellable. Keeping you is meant to be a choice you re-make, not a contract you are stuck in.",
  },
];

export default function AboutPage() {
  const [human, machine] = founders;

  return (
    <>
      <Section tone="paper" pad="none" className="pb-20 md:pb-28">
        <PageHero
          kicker="About"
          title="Two fronts, one studio"
          accent={["one"]}
          lead="One side carries three decades of marketing leadership. The other carries product and engineering. Each front has its own team — we started solving each other's problems over dinner and made it official."
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
        <FounderCard founder={human} />
      </Section>

      <ToneBridge from="paper" to="machine" />

      <Section tone="machine" pad="md" canvas>
        <FounderCard founder={machine} mirrored />
      </Section>

      <ToneBridge from="machine" to="paper" />

      <Section tone="paper" pad="lg">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <p className="mono-label">Why we started</p>
            <WordReveal
              text="The best advice we ever gave each other was free."
              className="mt-5 text-title"
              accent={["free."]}
            />
          </div>
          <div className="space-y-6 text-[1.05rem] leading-[1.75] text-muted">
            <p>
              For years the conversations went one way and then the other. A
              campaign that needed a landing page nobody had built. A product
              decision that hinged on how it would be positioned. Two different
              vocabularies for the same problem, translated across a dinner table.
            </p>
            <p>
              Eventually it was obvious that the translation was the valuable part.
              Most companies buy strategy from one place and execution from
              another, then absorb the cost of the gap between them without ever
              putting a number on it.
            </p>
            <p>
              {site.name} exists to remove that gap. The human front and the
              machine front work in the same room, led by people who are equally
              answerable for the result.
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
                <p className="mt-3 text-[0.95rem] leading-[1.65] text-muted">
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
            Come and use both halves.
          </h2>
          <p className="lead mt-6 max-w-xl">
            Whether you need the strategy, the software or the argument between
            them, you will talk directly to the team doing the work — not an
            account layer.
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
