import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  // Accent fill: saffron on dark themes, cobalt on chalk, navy on saffron.
  primary: "bg-accent text-on-accent hover:brightness-110",
  secondary: "border-2 border-ink text-ink hover:bg-ink hover:text-bg",
  ghost: "text-ink hover:bg-ink/8",
};

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
    >
      <path
        d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pill CTA. Internal hrefs use next/link; anything with a scheme opens out. */
export function Button({
  href,
  children,
  variant = "primary",
  className,
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  const classes = cn(
    "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 font-display text-[0.98rem] font-semibold tracking-[-0.01em] transition-[background-color,color,filter,transform] duration-200 active:scale-[0.97]",
    variants[variant],
    className,
  );

  const external = /^[a-z]+:/i.test(href);
  if (external) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
        {arrow ? <Arrow /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}
