import { stages } from "@/content/process";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { FlowPath } from "@/components/home/FlowPath";

/** Chapter 4. Five stages on one continuous line. */
export function Flow() {
  return (
    <Section theme="chalk" id="how-it-flows" className="overflow-x-clip">
      <div className="shell">
        <div className="mx-auto max-w-2xl md:text-center">
          <Eyebrow className="md:justify-center">How it flows</Eyebrow>
          <SplitReveal
            text="Five stages. Zero handoffs."
            accent={["Zero"]}
            className="mt-5 font-display text-title font-extrabold"
          />
          <p className="lead mt-5">
            One line from first call to growth. Nobody passes the baton because
            nobody leaves the room.
          </p>
        </div>

        <div className="mt-14 md:mt-20">
          <FlowPath stages={stages} />
        </div>

        <div className="mt-14 flex md:justify-center">
          <Button href="/approach">See the approach</Button>
        </div>
      </div>
    </Section>
  );
}
