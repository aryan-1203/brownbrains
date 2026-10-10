/**
 * Single source of truth for company details.
 *
 * Everything marked REPLACE is a placeholder — search this file for "REPLACE"
 * and swap in your real details. Nothing else in the codebase needs to change.
 */

export const site = {
  name: "Brown Brains",
  legalName: "Brown Brains", // REPLACE if you register a different legal entity name
  tagline: "Marketing, product and engineering, under one roof",
  description:
    "Brown Brains is a marketing, product and engineering company. We take a brand from positioning to a shipped product, strategy and build as one team.",
  shortDescription:
    "Marketing, product and engineering. From positioning to a shipped product, one team.",

  // Production domain. Used for canonical URLs, sitemap and Open Graph tags.
  url: "https://www.brownbrains.com",

  contact: {
    emails: ["founder@brownbrains.com"],
    phones: ["+91 97555 61424"],
    // Digits only, with country code, no "+" or spaces. Leave "" to hide the button.
    whatsapp: "919755561424",
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

/** Short capability words for marquees. */
export const capabilities = [
  "Brand Strategy",
  "Positioning",
  "Campaigns",
  "Websites",
  "Mobile Apps",
  "AI Workflows",
  "Product Discovery",
  "Design Systems",
  "Automation",
  "Analytics",
] as const;

/**
 * Numbers shown in the Proof section (and the first two on /about).
 * REPLACE the values and labels with figures you can stand behind.
 */
export const proofStats = [
  { value: 25, suffix: "+", label: "Years leading marketing" },
  { value: 5, suffix: "+", label: "Years shipping software" },
  { value: 1, suffix: "", label: "Team. Zero handoffs." },
  { value: 14, suffix: "", label: "Days to the first shipped asset" },
] as const;

/**
 * Illustrative engagements. REPLACE all three with real work as you land it.
 * Keep the shape identical and the section lays itself out.
 */
export const engagements = [
  {
    sector: "D2C Beverage",
    title: "A regional brand, repositioned for national retail",
    summary:
      "New positioning and packaging story, plus a storefront half the weight.",
    contribution: ["Brand Building", "Web Development"],
  },
  {
    sector: "B2B SaaS",
    title: "A manual sales desk, turned into an AI workflow",
    summary: "Automated lead qualification so warm leads stopped going cold.",
    contribution: ["AI Workflows", "Consultation"],
  },
  {
    sector: "Healthcare",
    title: "A clinic network, from idea to launched app",
    summary:
      "Patient discovery, a clear roadmap, and a first release with booking.",
    contribution: ["Product Building", "App Development"],
  },
] as const;
