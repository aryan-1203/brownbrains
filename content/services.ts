/**
 * The seven capabilities.
 *
 * `side` drives the Human / Machine filter on the capability matrix and decides
 * which tone a service reads in. "both" services show up under either filter.
 */

export type ServiceSide = "human" | "machine" | "both";

export type Service = {
  slug: string;
  title: string;
  side: ServiceSide;
  /** One line, shown on the collapsed matrix row. */
  blurb: string;
  /** Two or three sentences, shown when a row expands and on /services. */
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
    blurb: "Demand that compounds instead of renting attention.",
    detail:
      "We build the whole engine, not a single campaign: who you are talking to, what makes them move, and the channel mix that reaches them at a price you can sustain. Then we run it and report on it in plain language.",
    deliverables: [
      "Audience and market research",
      "Channel strategy and budget model",
      "Campaign planning and execution",
      "Content and creative direction",
      "Performance reporting cadence",
    ],
    outcome: "Cost per qualified lead you can actually forecast",
  },
  {
    slug: "consultation",
    title: "Consultation",
    side: "both",
    blurb: "A senior second opinion before you spend the money.",
    detail:
      "Sometimes you do not need a retainer, you need an experienced senior team to pressure-test the plan for a few weeks. We audit what exists, name the real constraint, and hand you a sequenced plan your team can run without us.",
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
    blurb: "A position worth defending, expressed consistently.",
    detail:
      "Brand is the promise you can keep and the reason someone picks you over the cheaper option. We find that promise, write it down, and build the identity and voice that carry it across every surface you own.",
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
    blurb: "Fast, accessible sites that hold up under real traffic.",
    detail:
      "Production engineering, not a template with your logo on it. We build on modern frameworks with performance and accessibility treated as requirements, and we hand over a codebase your future team will thank you for.",
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
    blurb: "Automation aimed at the work that actually costs you hours.",
    detail:
      "We start by finding where your time leaks, then automate that specific thing. Retrieval over your own documents, drafting and triage, internal copilots, pipelines that move data between the tools you already pay for, with a human checkpoint wherever the stakes are high.",
    deliverables: [
      "Workflow audit and automation map",
      "Retrieval and knowledge assistants",
      "Content and support automation",
      "Tool and API integrations",
      "Evaluation, guardrails and monitoring",
    ],
    outcome: "Hours per week back, measured before and after",
  },
  {
    slug: "app-development",
    title: "App Development",
    side: "machine",
    blurb: "Mobile products shipped to the store, then iterated.",
    detail:
      "Cross-platform apps built to reach both stores without doubling the budget. We scope hard toward a first release that earns feedback, then keep shipping against what users actually do rather than what the spec assumed.",
    deliverables: [
      "iOS and Android from one codebase",
      "API and backend integration",
      "Offline behaviour and notifications",
      "Store submission and release process",
      "Crash, usage and retention analytics",
    ],
    outcome: "A live app with a release cadence behind it",
  },
  {
    slug: "product-building",
    title: "Product Building",
    side: "both",
    blurb: "From a rough idea to something people pay for.",
    detail:
      "This is the discipline that sits over everything else: deciding what to build, in what order, and when to stop. We run discovery, cut scope to the smallest honest version, ship it, and read the evidence before committing the next rupee.",
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
  { id: "human", label: "Human" },
  { id: "machine", label: "Machine" },
] as const;

export type ServiceFilter = (typeof serviceFilters)[number]["id"];
