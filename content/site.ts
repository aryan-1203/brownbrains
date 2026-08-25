/**
 * Single source of truth for company details.
 *
 * Everything marked REPLACE is a placeholder — search this file for "REPLACE"
 * and swap in your real details. Nothing else in the codebase needs to change.
 */

export const site = {
  name: "Brown Brains",
  legalName: "Brown Brains", // REPLACE if you register a different legal entity name
  tagline: "Two brains. One built for people, one built for machines.",
  description:
    "Brown Brains is a two-person studio pairing three decades of marketing leadership with hands-on product and AI engineering. We take brands from positioning to shipped software.",
  shortDescription:
    "A marketing and engineering studio for founders who need both halves of the brain.",

  // REPLACE with your production domain once you have one. Used for canonical
  // URLs, sitemap and Open Graph tags. Include the protocol, no trailing slash.
  url: "https://brown-brains.vercel.app",

  founded: 2026, // REPLACE if different

  contact: {
    emails: ["ajay@brownbrains.com", "aryan@brownbrains.com"],
    phones: ["+91 7694015167", "+91 7611199572"],
    // Digits only, with country code, no "+" or spaces. Leave "" to hide the button.
    whatsapp: "917694015167",
    city: "Bhopal",
    country: "India",
    timezone: "IST (UTC+5:30)",
  },

  socials: [
    // REPLACE these URLs, or delete any line you do not want shown.
    { label: "LinkedIn", href: "https://linkedin.com/company/brown-brains" },
    { label: "Instagram", href: "https://instagram.com/brownbrains" },
    { label: "X", href: "https://x.com/brownbrains" },
  ],

  nav: [
    { label: "Services", href: "/services" },
    { label: "Approach", href: "/approach" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export function contactMailtoHref(subject?: string) {
  const href = `mailto:${site.contact.emails.join(",")}`;
  if (!subject) return href;
  return `${href}?subject=${encodeURIComponent(subject)}`;
}

export function contactTelHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** Rotating strip of capabilities used in the tone-seam marquees. */
export const capabilities = [
  "Brand Strategy",
  "Go-to-Market",
  "Positioning",
  "Web Development",
  "AI Workflows",
  "Product Discovery",
  "Mobile Apps",
  "Design Systems",
  "Campaign Ops",
  "Automation",
  "Consulting",
  "Analytics",
] as const;

/**
 * Numbers shown in the Proof section.
 * REPLACE the values and labels with figures you can stand behind.
 */
export const proofStats = [
  { value: 25, suffix: "+", label: "Years of marketing leadership" },
  { value: 5, suffix: "+", label: "Years building software products" },
  { value: 2, suffix: "", label: "People, zero handoffs" },
  { value: 14, suffix: " days", label: "From kickoff to first shipped asset" },
] as const;

/**
 * Illustrative engagements. REPLACE all three with real work as you land it —
 * keep the shape identical and the section will lay itself out.
 */
export const engagements = [
  {
    sector: "D2C Beverage",
    title: "Repositioned a regional brand for national retail",
    summary:
      "Rebuilt the positioning and packaging story, then shipped a headless storefront that cut page weight by more than half.",
    contribution: ["Brand Building", "Web Development"],
  },
  {
    sector: "B2B SaaS",
    title: "Turned a manual sales desk into an AI workflow",
    summary:
      "Mapped the funnel end to end, then automated qualification and follow-up so the founding team stopped losing warm leads.",
    contribution: ["AI Workflows", "Consultation"],
  },
  {
    sector: "Healthcare",
    title: "Took a clinic network from idea to launched app",
    summary:
      "Ran discovery with real patients, defined the roadmap, and delivered the first release with booking and reminders.",
    contribution: ["Product Building", "App Development"],
  },
] as const;
