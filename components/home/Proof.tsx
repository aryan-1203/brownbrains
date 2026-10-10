import { engagements, proofStats } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { ProofLine } from "@/components/home/ProofLine";

/** Chapter 5. Big numbers, then three short stories. */
export function Proof() {
  return (
    <Section theme="cobalt" id="proof" className="overflow-x-clip">
      <div className="shell">
        <Eyebrow className="text-ink">Proof</Eyebrow>
        <SplitReveal
          text="Numbers first. Adjectives later."
          accent={["Numbers"]}
          className="mt-5 max-w-3xl font-display text-title font-extrabold"
        />

        <div className="relative mt-14 md:mt-20">
          <ProofLine />
          <dl className="relative grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {proofStats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 0.08}
                className="border-t-2 border-white/40 pt-5"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-[clamp(3rem,7.5vw,6.5rem)] leading-none font-extrabold tracking-[-0.05em]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dd
                  aria-hidden
                  className="mt-3 text-[0.95rem] font-semibold text-ink"
                >
                  {stat.label}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <ul className="mt-20 grid gap-5 md:mt-28 md:grid-cols-3">
          {engagements.map((work, index) => (
            <Reveal
              as="li"
              key={work.title}
              delay={index * 0.1}
              className="flex flex-col gap-6 rounded-card bg-midnight p-6 text-chalk shadow-[0_24px_60px_-24px_rgba(10,23,51,0.7)] md:p-8"
            >
              <p className="text-[0.75rem] font-bold tracking-[0.14em] text-saffron uppercase">
                {work.sector}
              </p>
              <h3 className="font-display text-heading font-bold tracking-[-0.03em]">
                {work.title}
              </h3>
              <ul
                className="mt-auto flex flex-wrap gap-2"
                aria-label="What we did"
              >
                {work.contribution.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-sky"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
