import { cn } from "@/lib/cn";
import { WordReveal } from "@/components/fx/WordReveal";

type PageHeroProps = {
  kicker: string;
  title: string;
  lead: string;
  /** Words in the title to italicise in the accent colour. */
  accent?: string[];
  aside?: React.ReactNode;
  className?: string;
};

export function PageHero({
  kicker,
  title,
  lead,
  accent,
  aside,
  className,
}: PageHeroProps) {
  return (
    <div className={cn("shell pt-32 md:pt-40", className)}>
      <p className="mono-label">{kicker}</p>
      <WordReveal
        as="h1"
        text={title}
        accent={accent}
        className="mt-6 font-display text-display leading-[0.9]"
      />
      <div className="mt-10 grid gap-8 border-t border-rule pt-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
        <p className="lead max-w-2xl">{lead}</p>
        {aside ? <div className="md:pt-1">{aside}</div> : null}
      </div>
    </div>
  );
}
