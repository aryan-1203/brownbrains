import type { ReactNode } from "react";
import Image from "next/image";
import type { Founder } from "@/content/founders";
import { cn } from "@/lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function PortraitFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl border border-rule lg:mx-0 lg:max-w-none">
      {children}
    </div>
  );
}

/** Stand-in for a headshot: initials over a dot grid, deliberately typographic. */
function Monogram({ name }: { name: string }) {
  return (
    <PortraitFrame>
      <div className="relative flex h-full items-center justify-center bg-surface">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "14px 14px",
            color: "var(--rule)",
          }}
        />
        <span className="relative font-display text-[clamp(4rem,10vw,7rem)] leading-none tracking-[-0.04em] text-ink/85">
          {initials(name)}
        </span>
        <span className="absolute bottom-4 left-5 font-mono text-[0.6rem] tracking-[0.16em] text-faint uppercase">
          Portrait pending
        </span>
      </div>
    </PortraitFrame>
  );
}

export function FounderCard({
  founder,
  mirrored = false,
}: {
  founder: Founder;
  mirrored?: boolean;
}) {
  return (
    <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
      <div className={cn(mirrored && "lg:order-2")}>
        {founder.portrait ? (
          <PortraitFrame>
            <Image
              src={founder.portrait}
              alt={`${founder.name}, ${founder.role}`}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
          </PortraitFrame>
        ) : (
          <Monogram name={founder.name} />
        )}
      </div>

      <div className={cn(mirrored && "lg:order-1")}>
        <p className="mono-label">{founder.discipline}</p>
        <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.94]">
          {founder.name}
        </h2>
        <p className="mt-3 font-mono text-[0.72rem] tracking-[0.14em] text-ember uppercase">
          {founder.role}
        </p>
        <p className="mt-7 max-w-2xl text-[1.05rem] leading-[1.7] text-muted">
          {founder.bio}
        </p>

        <ul className="mt-9 grid gap-x-8 gap-y-2.5 border-t border-rule pt-7 sm:grid-cols-2">
          {founder.focus.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 font-mono text-[0.72rem] leading-relaxed text-muted"
            >
              <span aria-hidden className="text-filament">
                +
              </span>
              {item}
            </li>
          ))}
        </ul>

        {founder.linkedin ? (
          <a
            href={founder.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline mt-7 inline-block font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase hover:text-ink"
          >
            LinkedIn
          </a>
        ) : null}
      </div>
    </div>
  );
}
