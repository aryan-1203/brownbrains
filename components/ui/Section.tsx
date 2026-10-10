import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Theme = "chalk" | "midnight" | "cobalt" | "saffron";

/** A full-bleed band that paints one of the four section themes. */
export function Section({
  theme = "chalk",
  id,
  className,
  children,
  pad = true,
}: {
  theme?: Theme;
  id?: string;
  className?: string;
  children: ReactNode;
  /** Apply the standard generous vertical padding. */
  pad?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(`theme-${theme} relative`, pad && "section-pad", className)}
    >
      {children}
    </section>
  );
}
