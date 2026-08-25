import type { Metadata } from "next";
import { site } from "@/content/site";
import { Section } from "@/components/tone/Section";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Brown Brains collects through this website, where it is stored and how to have it removed.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

const sections = [
  {
    heading: "What we collect",
    body: [
      "If you submit the contact form we collect the name, email address, company, budget range, service interest and message you type into it. We also record the time of submission.",
      "We do not use advertising trackers, we do not sell data, and we do not set marketing cookies on this site.",
    ],
  },
  {
    heading: "Where it goes",
    body: [
      "Submissions are appended as a row in a private Google Sheet that only the two of us can open, and a copy is emailed to us through Resend so we notice it quickly.",
      "The site is hosted on Vercel, which processes standard server logs including IP address for security and abuse prevention.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Enquiries stay in the sheet for as long as the conversation is potentially live, and are deleted on request at any time.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      `Email ${site.contact.emails.join(" or ")} and ask us to send you a copy of what we hold, correct it, or delete it. We will do it and confirm in writing.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Section tone="paper" pad="none" className="pb-16">
        <PageHero
          kicker="Privacy"
          title="Short, because we collect very little"
          accent={["little"]}
          lead="This page describes exactly what happens to the information you send through this website. If anything here is unclear, ask us and we will answer plainly."
        />
      </Section>

      <Section tone="paper" pad="lg" seam>
        <div className="shell max-w-3xl space-y-14">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-heading leading-tight">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[1.02rem] leading-[1.75] text-muted">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}

          <p className="border-t border-rule pt-8 font-mono text-[0.68rem] tracking-[0.1em] text-faint uppercase">
            Last updated {new Date().getFullYear()}
          </p>
        </div>
      </Section>
    </>
  );
}
