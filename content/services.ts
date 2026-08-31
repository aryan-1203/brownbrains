/**
 * The seven capabilities.
 *
 * `side` drives the Marketing / Engineering filter on the capability matrix
 * and decides which tone a service reads in. "both" services show under either.
 */

export type ServiceSide = "human" | "machine" | "both";

export type Service = {
  slug: string;
  title: string;
  side: ServiceSide;
  /** One line, shown on the collapsed matrix row. */
  blurb: string;
  /** Short detail, shown when a row expands and on /services. */
  detail: string;
  deliverables: string[];
  /** Short proof of the shape of the outcome, set in mono. */
  outcome: string;
};

export const services: Service[] = [
  {
    slug: "marketing",
    title: "Marketing",
    side: "human",
    blurb: "Demand that compounds, not rented attention.",
    detail:
      "Audience, message, channels, and a cadence you can forecast — run and reported in plain language.",
    deliverables: [
      "Audience and market research",
      "Channel strategy and budget model",
      "Campaign planning and execution",
      "Content and creative direction",
      "Performance reporting cadence",
    ],
    outcome: "Cost per qualified lead you can forecast",
  },
  {
    slug: "consultation",
    title: "Consultation",
    side: "both",
    blurb: "A senior second opinion before you spend.",
    detail:
      "We audit what exists, name the real constraint, and leave you a sequenced plan your team can run.",
    deliverables: [
      "Business and funnel audit",
      "Competitive and pricing teardown",
      "Prioritised opportunity map",
      "Written recommendations and roadmap",
      "Working sessions with your team",
    ],
    outcome: "A decision you stop second-guessing",
  },
  {
    slug: "brand-building",
    title: "Brand Building",
    side: "human",
    blurb: "A position worth defending, told consistently.",
    detail:
      "We find the promise, write it down, and build the identity and voice that carry it everywhere.",
    deliverables: [
      "Positioning and messaging framework",
      "Naming and verbal identity",
      "Visual identity and logo system",
      "Brand guidelines and asset kit",
      "Launch or relaunch narrative",
    ],
    outcome: "One story, told the same way everywhere",
  },
  {
    slug: "web-development",
    title: "Web Development",
    side: "machine",
    blurb: "Fast sites that hold up under real traffic.",
    detail:
      "Production engineering on modern frameworks — performance and accessibility as requirements, codebase you own.",
    deliverables: [
      "Marketing sites and landing systems",
      "Headless commerce and CMS builds",
      "Web app front ends and dashboards",
      "Core Web Vitals and SEO groundwork",
      "Analytics and conversion tracking",
    ],
    outcome: "Sub-second loads and a codebase you own",
  },
  {
    slug: "ai-workflows",
    title: "AI Workflows",
    side: "machine",
    blurb: "Automation aimed at the hours you actually lose.",
    detail:
      "We find where time leaks, automate that specific work, and keep a human checkpoint where stakes are high.",
    deliverables: [
      "Workflow audit and automation map",
      "Retrieval and knowledge assistants",
      "Content and support automation",
      "Tool and API integrations",
      "Evaluation, guardrails and monitoring",
    ],
    outcome: "Hours per week back, measured",
  },
  {
    slug: "app-development",
    title: "App Development",
    side: "machine",
    blurb: "Mobile products shipped to the store, then iterated.",
    detail:
      "Cross-platform apps scoped to a first release that earns feedback, then shipped against real usage.",
    deliverables: [
      "iOS and Android from one codebase",
      "API and backend integration",
      "Offline behaviour and notifications",
      "Store submission and release process",
      "Crash, usage and retention analytics",
    ],
    outcome: "A live app with a release cadence",
  },
  {
    slug: "product-building",
    title: "Product Building",
    side: "both",
    blurb: "From a rough idea to something people pay for.",
    detail:
      "Discovery, the smallest honest scope, ship, then read the evidence before the next rupee.",
    deliverables: [
      "Discovery and user interviews",
      "Scope definition and roadmap",
      "Prototypes and validation",
      "Delivery management through launch",
      "Metrics, pricing and iteration plan",
    ],
    outcome: "Fewer features, more of the right ones",
  },
];

export const serviceFilters = [
  { id: "all", label: "Everything" },
  { id: "human", label: "Marketing" },
  { id: "machine", label: "Engineering" },
] as const;

export type ServiceFilter = (typeof serviceFilters)[number]["id"];
