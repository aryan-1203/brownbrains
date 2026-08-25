import { cn } from "@/lib/cn";
import { toneGradient, type GradientTone } from "@/lib/tone-gradient";

/**
 * A short contentless band that dissolves one tone into the next.
 *
 * Sections paint flat colours, so a light section meeting a dark one produces a
 * hard horizontal line mid-scroll. This sits between them and ramps `from` into
 * `to`. Keeping the gradient in its own band means it can never end up behind
 * text, and it deliberately does not register with ToneProvider: the chrome
 * should flip based on the real sections either side, not on the gap.
 */
export function ToneBridge({
  from,
  to,
  className,
}: {
  from: GradientTone;
  to: GradientTone;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("h-[18vh] min-h-32 md:min-h-44", className)}
      style={{ backgroundImage: toneGradient(from, to) }}
    />
  );
}
