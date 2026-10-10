import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Uppercase label with a small accent dot, set above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow", className)}>
      <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
      {children}
    </p>
  );
}
