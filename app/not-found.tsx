import Link from "next/link";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { MissedHalves } from "@/components/contact/MissedHalves";

export default function NotFound() {
  return (
    <Section
      theme="midnight"
      pad={false}
      className="flex min-h-[100svh] items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <div className="shell relative grid items-center gap-12 pt-36 pb-24 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="mt-6 text-display">
            This page <span className="text-accent">missed</span> its other
            half.
          </h1>
          <p className="lead mt-6 max-w-md">
            It moved, or never existed. Everything else is one click away.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/">Back home</Button>
            <Button href="/contact" variant="secondary">
              Tell us what you needed
            </Button>
          </div>

          <nav
            aria-label="Site pages"
            className="mt-12 flex flex-wrap gap-x-2 gap-y-1 border-t border-rule pt-6"
          >
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center px-2 font-semibold text-muted transition-colors hover:text-ink"
              >
                <span className="link-underline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <MissedHalves />
        </div>
      </div>
    </Section>
  );
}
