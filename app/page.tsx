import { capabilities, site } from "@/content/site";
import { founders } from "@/content/founders";
import { Section } from "@/components/ui/Section";
import { Marquee } from "@/components/ui/Marquee";
import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Services } from "@/components/home/Services";
import { Flow } from "@/components/home/Flow";
import { Proof } from "@/components/home/Proof";
import { TeamTeaser } from "@/components/home/TeamTeaser";
import { ClosingCta } from "@/components/home/ClosingCta";

/** Leadership portraits for the team teaser. Names double as alt text. */
const people = founders
  .filter((person) => person.portrait)
  .slice(0, 3)
  .map(({ name, portrait }) => ({ name, portrait }));

/**
 * Home is told in chapters, and every chapter changes the ground colour:
 * midnight hero, chalk problem, cobalt ticker, midnight services, chalk flow,
 * cobalt proof, midnight team, saffron close.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Problem />

      <Section
        theme="cobalt"
        pad={false}
        className="overflow-hidden py-6 md:py-8"
      >
        <h2 className="sr-only">Capabilities</h2>
        <Marquee
          items={capabilities}
          duration={36}
          className="font-display text-[clamp(1.6rem,3.4vw,2.75rem)] font-extrabold tracking-[-0.035em]"
        />
      </Section>

      <Services />
      <Flow />
      <Proof />

      <Section theme="midnight" className="overflow-x-clip">
        <TeamTeaser people={people} />
      </Section>

      <ClosingCta />

      <script
        type="application/ld+json"
        // Structured data helps the company show up correctly in local search.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name,
            description: site.description,
            url: site.url,
            email: site.contact.emails,
            telephone: site.contact.phones,
            address: {
              "@type": "PostalAddress",
              addressLocality: site.contact.city,
              addressCountry: site.contact.country,
            },
            sameAs: site.socials.map((social) => social.href),
            areaServed: "Worldwide",
          }),
        }}
      />
    </>
  );
}
