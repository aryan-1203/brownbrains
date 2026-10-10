import type { Metadata } from "next";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Brown Brains collects through this website, where it is stored and how to have it removed.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

const promises = [
  { title: "No ad trackers", body: "No advertising or marketing cookies." },
  { title: "Never sold", body: "Your details are not sold or shared for ads." },
  {
    title: "Deleted on request",
    body: "One email and it is gone, confirmed in writing.",
  },
];

const sections = [
  {
    id: "collect",
    heading: "What we collect",
    body: [
      "If you send the contact form, we collect your name, email, company, service interest, budget range and message, plus the time you sent it.",
      "We do not use advertising trackers, we do not sell data and we do not set marketing cookies on this site.",
    ],
  },
  {
    id: "where",
    heading: "Where it goes",
    body: [
      "Each submission is saved as a row in a private Google Sheet that only authorised people on our team can open. A copy is emailed to us through Resend so we see it quickly.",
      "The site is hosted on Vercel, which keeps standard server logs, including IP addresses, for security and abuse prevention.",
    ],
  },
  {
    id: "keep",
    heading: "How long we keep it",
    body: [
      "Enquiries stay in the sheet while the conversation could still be live. You can ask us to delete them at any time.",
    ],
  },
  {
    id: "choices",
    heading: "Your choices",
    body: [
      `Email ${site.contact.emails.join(" or ")} to get a copy of what we hold, correct it or delete it. We will do it and confirm in writing.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Section
        theme="midnight"
        pad={false}
        className="overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24"
      >
        <div className="shell relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <Eyebrow>Privacy</Eyebrow>
            <SplitReveal
              as="h1"
              immediate
              text="Privacy, in plain words."
              accent={["plain"]}
              className="mt-6 max-w-3xl text-display"
            />
            <Reveal delay={0.3}>
              <p className="lead mt-6 max-w-lg">
                We collect very little. Here is exactly what, where it goes and
                how to remove it.
              </p>
            </Reveal>
          </div>
          {/* Two halves of the mark closed into a padlock seal. */}
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            className="hidden h-64 w-64 md:block lg:h-80 lg:w-80"
          >
            <g
              className="animate-spin-slow"
              style={{ transformOrigin: "100px 100px" }}
            >
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="#24365f"
                strokeWidth="2"
                strokeDasharray="4 10"
              />
            </g>
            <path d="M98 40a60 60 0 0 0 0 120Z" fill="#ffb224" />
            <path d="M102 40a60 60 0 0 1 0 120Z" fill="#2b59ff" />
            <path
              d="M100 82v-6a12 12 0 0 1 24 0v6"
              fill="none"
              stroke="#0a1733"
              strokeWidth="6"
              transform="translate(-12 0)"
            />
            <rect x="80" y="82" width="40" height="32" rx="6" fill="#0a1733" />
          </svg>
        </div>
      </Section>

      <Section theme="chalk">
        <div className="shell">
          <ul className="grid gap-4 sm:grid-cols-3">
            {promises.map((promise, index) => (
              <Reveal as="li" key={promise.title} delay={index * 0.08}>
                <div className="h-full rounded-card bg-surface p-6 ring-1 ring-rule">
                  <span
                    aria-hidden
                    className={
                      "grid h-10 w-10 place-items-center rounded-full " +
                      (index === 1
                        ? "bg-cobalt text-white"
                        : "bg-saffron text-midnight")
                    }
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8.5l3.2 3L13 4.5" />
                    </svg>
                  </span>
                  <p className="mt-5 font-display text-[1.2rem] font-bold tracking-[-0.02em]">
                    {promise.title}
                  </p>
                  <p className="mt-1.5 text-muted">{promise.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[14rem_1fr] lg:gap-20">
            <nav
              aria-label="On this page"
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <p className="eyebrow">On this page</p>
              <ol className="mt-4 space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex min-h-11 items-center gap-3 text-[0.98rem] font-medium text-muted transition-colors hover:text-ink"
                    >
                      <span className="w-5 text-sm font-bold text-cobalt tabular-nums">
                        {index + 1}
                      </span>
                      <span className="link-underline">{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-[42rem] space-y-14">
              {sections.map((section, index) => (
                <Reveal key={section.id}>
                  <section
                    id={section.id}
                    className="scroll-mt-28"
                    aria-labelledby={`${section.id}-h`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className={
                          "h-3 w-6 rounded-full " +
                          (index % 2 === 0
                            ? "bg-[linear-gradient(90deg,#ffb224_50%,transparent_50%)] ring-1 ring-saffron"
                            : "bg-[linear-gradient(90deg,transparent_50%,#2b59ff_50%)] ring-1 ring-cobalt")
                        }
                      />
                      <h2 id={`${section.id}-h`} className="text-heading">
                        {section.heading}
                      </h2>
                    </div>
                    <div className="mt-5 space-y-4 text-[1.0625rem] leading-[1.75] text-muted">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-rule pt-10">
                <p className="text-muted">Questions about your data?</p>
                <Button
                  href={`mailto:${site.contact.emails[0]}?subject=${encodeURIComponent("Privacy request")}`}
                >
                  Email us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
