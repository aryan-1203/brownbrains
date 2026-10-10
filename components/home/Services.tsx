import { services } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ServiceDeck } from "@/components/home/ServiceDeck";

/** Chapter 3. Seven services, dealt as a deck. */
export function Services() {
  return (
    <Section theme="midnight" id="what-we-do" className="overflow-x-clip">
      <div className="shell grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="md:sticky md:top-32 md:self-start">
          <Eyebrow>What we do</Eyebrow>
          <SplitReveal
            text="Seven services. One team behind all of them."
            accent={["One", "team"]}
            className="mt-5 font-display text-title font-extrabold"
          />
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-muted">
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-3 w-3 rounded-full bg-saffron" />
              Marketing
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-3 w-3 rounded-full bg-cobalt ring-1 ring-sky/50"
              />
              Engineering
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="flex">
                <span className="h-3 w-1.5 rounded-l-full bg-saffron" />
                <span className="h-3 w-1.5 rounded-r-full bg-cobalt" />
              </span>
              Both
            </li>
          </ul>
          <Button
            href="/services"
            variant="secondary"
            className="mt-10 hidden md:inline-flex"
          >
            Explore services
          </Button>
        </div>

        <ServiceDeck services={services} />

        <Button href="/services" variant="secondary" className="md:hidden">
          Explore services
        </Button>
      </div>
    </Section>
  );
}
