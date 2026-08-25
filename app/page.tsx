import { capabilities, site } from "@/content/site";
import { Section } from "@/components/tone/Section";
import { ToneBridge } from "@/components/tone/ToneBridge";
import { Marquee } from "@/components/fx/Marquee";
import { Hero } from "@/components/home/Hero";
import { CapabilityMatrix } from "@/components/home/CapabilityMatrix";
import { DualBrain } from "@/components/home/DualBrain";
import { AssemblyLine } from "@/components/home/AssemblyLine";
import { Proof } from "@/components/home/Proof";
import { CtaBand } from "@/components/home/CtaBand";

const machineWords = capabilities.filter((_, index) => index % 2 === 0);
const humanWords = capabilities.filter((_, index) => index % 2 === 1);

export default function Home() {
  return (
    <>
      <Hero />

      {/* Seam one: the page commits to the machine tone */}
      <Section tone="machine" pad="none" className="py-9 md:py-12">
        <div className="space-y-3">
          <Marquee items={machineWords} direction={1} speed={2.2} />
          <Marquee
            items={humanWords}
            direction={-1}
            speed={1.7}
            className="text-muted"
          />
        </div>
      </Section>

      <Section tone="machine" id="capabilities" pad="lg" seam canvas>
        <CapabilityMatrix />
      </Section>

      <ToneBridge from="machine" to="paper" />

      <Section tone="paper" pad="lg">
        <DualBrain />
      </Section>

      <ToneBridge from="paper" to="machine" />

      <Section tone="machine" pad="none">
        <AssemblyLine />
      </Section>

      <ToneBridge from="machine" to="paper" />

      <Section tone="paper" pad="lg">
        <Proof />
      </Section>

      <ToneBridge from="paper" to="ember" />

      <Section tone="machine" pad="lg" className="tone-ember">
        <CtaBand />
      </Section>

      <ToneBridge from="ember" to="machine" />

      <script
        type="application/ld+json"
        // Structured data helps the studio show up correctly in local search.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name,
            description: site.description,
            url: site.url,
            email: site.contact.emails,
            telephone: site.contact.phones,
            foundingDate: String(site.founded),
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
