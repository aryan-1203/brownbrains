"use client";

import { site } from "@/content/site";
import { WordReveal } from "@/components/fx/WordReveal";
import { MagneticButton } from "@/components/fx/MagneticButton";

export function CtaBand() {
  return (
    <div className="shell">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="font-mono text-[0.68rem] tracking-[0.2em] text-muted uppercase">
            06 / Open for work
          </p>
          <WordReveal
            text="One team costs less than five vendors."
            className="mt-6 font-display text-display leading-[0.92]"
          />
        </div>

        <div className="space-y-7">
          <p className="text-lead leading-[1.55] text-muted">
            Tell us the problem in a paragraph. We will say honestly if we are
            the right fit — and what it takes.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              href="/contact"
              cursorLabel="write"
              className="!bg-[#fdf6ee] !text-[#7d2a0e]"
            >
              Start a project
            </MagneticButton>
            {site.contact.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="link-underline font-mono text-[0.72rem] tracking-[0.12em] text-muted uppercase transition-colors hover:text-ink"
              >
                {email}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
