import { cn } from "@/lib/cn";

/** CSS-only infinite ticker. Content is duplicated once; the copy is hidden from AT. */
export function Marquee({
  items,
  className,
  duration = 40,
  reverse = false,
  separator = "✦",
}: {
  items: readonly string[];
  className?: string;
  duration?: number;
  reverse?: boolean;
  separator?: string;
}) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap">
          <span>{item}</span>
          <span aria-hidden className="text-accent">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("flex overflow-hidden", className)}>
      <div
        className="animate-marquee flex w-max"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
