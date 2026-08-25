import Link from "next/link";
import { site } from "@/content/site";
import { Section } from "@/components/tone/Section";
import { MagneticButton } from "@/components/fx/MagneticButton";

export default function NotFound() {
  return (
    <Section tone="machine" pad="none" canvas className="flex min-h-[100svh] items-center">
      <div className="shell py-32">
        <p className="mono-label">Error 404</p>
        <h1 className="mt-6 font-display text-mega leading-[0.86]">
          Dead
          <br />
          <span className="text-filament italic">synapse.</span>
        </h1>
        <p className="lead mt-8 max-w-md">
          This page never existed, or it did and we moved it. Either way, the
          working parts of the site are one click away.
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-4">
          <MagneticButton href="/" cursorLabel="home" className="!bg-[#f0e9df] !text-[#14100e]">
            Back to the start
          </MagneticButton>
          <Link
            href="/contact"
            className="link-underline font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase hover:text-ink"
          >
            Tell us what you were looking for
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-8">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
