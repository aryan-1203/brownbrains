/**
 * The seven services.
 *
 * `side` decides which half a service belongs to: "human" is marketing
 * (saffron), "machine" is engineering (cobalt), "both" sits in the overlap.
 * `slug` doubles as the anchor id on /services and the contact form value,
 * so keep slugs stable.
 */

export type ServiceSide = "human" | "machine" | "both";

export type Service = {
  slug: string;
  title: string;
  side: ServiceSide;
  /** One line. The promise. */
  blurb: string;
  /** One short sentence of how. */
  detail: string;
  /** Three or four, never more. */
  deliverables: string[];
  /** The shape of the result, in a few words. */
  outcome: string;
};

export const services: Service[] = [
  {
    slug: "marketing",
    title: "Marketing",
    side: "human",
    blurb: "Demand that compounds, not rented attention.",
    detail: "Audience, message and channels, run on a cadence you can forecast.",
    deliverables: [
      "Audience and market research",
      "Channel plan and budget model",
      "Campaigns, run end to end",
      "Plain-language reporting",
    ],
    outcome: "Leads you can forecast",
  },
  {
    slug: "consultation",
    title: "Consultation",
    side: "both",
    blurb: "A senior second opinion before you spend.",
    detail: "We name the real constraint and leave a plan your team can run.",
    deliverables: [
      "Business and funnel audit",
      "Competitor and pricing teardown",
      "A sequenced written roadmap",
    ],
    outcome: "A decision you stop second-guessing",
  },
  {
    slug: "brand-building",
    title: "Brand Building",
    side: "human",
    blurb: "A position worth defending, told the same way everywhere.",
    detail: "We find the promise, then build the identity and voice that carry it.",
    deliverables: [
      "Positioning and messaging",
      "Naming and verbal identity",
      "Logo and visual system",
      "Brand guidelines and asset kit",
    ],
    outcome: "One story, everywhere",
  },
  {
    slug: "web-development",
    title: "Web Development",
    side: "machine",
    blurb: "Fast sites that hold up under real traffic.",
    detail: "Modern, accessible builds on a codebase you own.",
    deliverables: [
      "Marketing sites and landing pages",
      "Headless CMS and commerce",
      "Dashboards and web apps",
      "SEO, speed and tracking",
    ],
    outcome: "Sub-second loads, your code",
  },
  {
    slug: "ai-workflows",
    title: "AI Workflows",
    side: "machine",
    blurb: "Automation aimed at the hours you actually lose.",
    detail: "We automate the leaky work and keep a human where stakes are high.",
    deliverables: [
      "Workflow audit and automation map",
      "Knowledge and support assistants",
      "Tool and API integrations",
      "Guardrails and monitoring",
    ],
    outcome: "Hours back every week, measured",
  },
  {
    slug: "app-development",
    title: "App Development",
    side: "machine",
    blurb: "Mobile apps shipped to the store, then improved.",
    detail: "One codebase for iOS and Android, scoped to a first release that earns feedback.",
    deliverables: [
      "iOS and Android, one codebase",
      "Backend and API integration",
      "Store release process",
      "Usage and crash analytics",
    ],
    outcome: "A live app with a release rhythm",
  },
  {
    slug: "product-building",
    title: "Product Building",
    side: "both",
    blurb: "From a rough idea to something people pay for.",
    detail: "Smallest honest scope, ship it, then let the evidence pick what is next.",
    deliverables: [
      "Discovery and user interviews",
      "Scope and roadmap",
      "Prototype, build and launch",
      "Metrics and pricing plan",
    ],
    outcome: "Fewer features, the right ones",
  },
];

export const serviceFilters = [
  { id: "all", label: "Everything" },
  { id: "human", label: "Marketing" },
  { id: "machine", label: "Engineering" },
] as const;

export type ServiceFilter = (typeof serviceFilters)[number]["id"];

/** Display names for each side. */
export const sideLabel: Record<ServiceSide, string> = {
  human: "Marketing",
  machine: "Engineering",
  both: "Both",
};
