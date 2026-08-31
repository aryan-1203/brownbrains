import type { Metadata } from "next";
import { engagementModels, principles } from "@/content/process";
import { site } from "@/content/site";
import { Section } from "@/components/tone/Section";
import { ToneBridge } from "@/components/tone/ToneBridge";
import { PageHero } from "@/components/layout/PageHero";
import { StageRail } from "@/components/approach/StageRail";
import { WordReveal } from "@/components/fx/WordReveal";
import { MagneticButton } from "@/components/fx/MagneticButton";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How Brown Brains runs an engagement: five stages from diagnosis to compounding returns, three ways to work with us.",
  alternates: { canonical: "/approach" },
};

export default function ApproachPage() {
  return (
    <>
      <Section tone="paper" pad="none" className="pb-16 md:pb-24">
        <PageHero
          kicker="Approach"
          title="Diagnose first. Then ship."
          accent={["Diagnose"]}
          lead="Five short stages — sprint or year-long. Something real exists fast enough to prove the plan."
          aside={
            <div className="rounded-2xl border border-rule bg-surface p-6">
              <p className="mono-label">Working hours</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {site.contact.timezone}, async in the tools your team already uses.
              </p>
            </div>
          }
        />
      </Section>

      <Section tone="paper" pad="lg" seam>
        <div className="shell">
          <p className="mono-label">The five stages</p>
          <StageRail />
        </div>
      </Section>

      <ToneBridge from="paper" to="machine" />

      <Section tone="machine" pad="lg" canvas>
        <div className="shell">
          <p className="mono-label">Ways to work together</p>
          <WordReveal
            text="Three shapes, priced before we start"
            className="mt-5 max-w-2xl text-title"
            accent={["before"]}
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {engagementModels.map((model, index) => (
              <article
                key={model.name}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-rule bg-surface/60 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-ember/60"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ember transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[0.68rem] text-faint tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[0.66rem] tracking-[0.12em] text-filament uppercase">
                    {model.duration}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-[2rem] leading-none">
                  {model.name}
                </h3>
                <p className="mt-4 text-[0.95rem] leading-[1.6] text-muted">
                  {model.bestFor}
                </p>

                <ul className="mt-7 space-y-2.5 border-t border-rule pt-6">
                  {model.includes.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 font-mono text-[0.7rem] leading-relaxed text-muted"
                    >
                      <span aria-hidden className="text-filament">
                        +
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <ToneBridge from="machine" to="paper" />

      <Section tone="paper" pad="lg">
        <div className="shell">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mono-label">How we behave</p>
              <WordReveal
                text="Six rules we do not bend"
                className="mt-5 max-w-xl text-title"
                accent={["not"]}
              />
            </div>
            <p className="max-w-xs font-mono text-[0.68rem] leading-relaxed tracking-[0.06em] text-faint uppercase">
              Hold us to these
            </p>
          </div>

          <ul className="mt-14 grid gap-x-14 gap-y-10 border-t border-rule pt-12 md:grid-cols-2 xl:grid-cols-3">
            {principles.map((principle, index) => (
              <li key={principle.title}>
                <span className="font-mono text-[0.68rem] text-faint tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-heading leading-tight">
                  {principle.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.6] text-muted">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <ToneBridge from="paper" to="ember" />

      <Section tone="machine" pad="lg" className="tone-ember">
        <div className="shell max-w-3xl">
          <h2 className="font-display text-title leading-[0.95]">
            Week one is a conversation, not a contract.
          </h2>
          <p className="lead mt-5 max-w-xl">
            We would rather say the work is not worth doing than sell a plan
            nobody believes in.
          </p>
          <div className="mt-9">
            <MagneticButton
              href="/contact"
              cursorLabel="write"
              className="!bg-[#fdf6ee] !text-[#7d2a0e]"
            >
              Book that hour
            </MagneticButton>
          </div>
        </div>
      </Section>

      <ToneBridge from="ember" to="machine" />
    </>
  );
}
