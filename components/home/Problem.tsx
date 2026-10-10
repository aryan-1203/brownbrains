import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { GapGraphic } from "@/components/home/GapGraphic";

/** Chapter 2. The gap between two vendors, and where the money goes. */
export function Problem() {
  return (
    <Section theme="chalk" id="problem" className="overflow-x-clip">
      <div className="shell grid items-center gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
        <div>
          <Eyebrow>The problem</Eyebrow>
          <SplitReveal
            text="Two vendors. One gap. Your budget falls in it."
            accent={["gap."]}
            className="mt-5 font-display text-title font-extrabold"
          />
          <ScrollWords
            text="The agency blames the developers. The developers blame the brief. You pay both, and nobody owns the result."
            accent={["nobody", "owns"]}
            className="mt-8 max-w-lg font-display text-heading leading-snug font-semibold tracking-[-0.02em]"
          />
          <p className="mt-8 inline-flex items-center gap-3 rounded-full bg-midnight px-5 py-3 font-display font-bold text-chalk">
            <span aria-hidden className="flex">
              <span className="h-4 w-2 rounded-l-full bg-saffron" />
              <span className="h-4 w-2 rounded-r-full bg-cobalt" />
            </span>
            We close the gap by being both.
          </p>
        </div>
        <GapGraphic />
      </div>
    </Section>
  );
}
