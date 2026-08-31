/** The five stages rendered as the pinned horizontal assembly line. */

export type Stage = {
  id: string;
  title: string;
  /** Rough elapsed time, set in mono under the title. */
  duration: string;
  description: string;
  outputs: string[];
};

export const stages: Stage[] = [
  {
    id: "signal",
    title: "Signal",
    duration: "Week 0",
    description:
      "Numbers, customers, competitors, and the one thing blocking growth. Most engagements change shape here.",
    outputs: ["Discovery calls", "Data and funnel audit", "Constraint named"],
  },
  {
    id: "frame",
    title: "Frame",
    duration: "Week 1",
    description:
      "Position, audience, and scope on one page — clear enough to repeat to an investor.",
    outputs: ["Positioning", "Scope and roadmap", "Success metrics"],
  },
  {
    id: "prototype",
    title: "Prototype",
    duration: "Weeks 2–3",
    description:
      "The cheapest version that can still be judged, in front of real people while changing our minds is free.",
    outputs: ["Working prototype", "Creative directions", "Early feedback"],
  },
  {
    id: "ship",
    title: "Ship",
    duration: "Weeks 4–8",
    description:
      "Build and launch with a date. Marketing and engineering move together — one team, one invoice.",
    outputs: ["Production build", "Campaign live", "Handover docs"],
  },
  {
    id: "compound",
    title: "Compound",
    duration: "Ongoing",
    description:
      "Launch is the start of the data. Kill what failed, double down on what worked.",
    outputs: ["Monthly review", "Iteration backlog", "Growth reporting"],
  },
];

/** Engagement shapes listed on /approach. */
export const engagementModels = [
  {
    name: "Sprint",
    duration: "2–4 weeks",
    bestFor: "A specific question or a launch that cannot slip.",
    includes: [
      "Fixed scope and fixed price",
      "One clear deliverable",
      "Direct access to senior leadership",
    ],
  },
  {
    name: "Build",
    duration: "6–12 weeks",
    bestFor: "Taking a brand, site, app or workflow from nothing to live.",
    includes: [
      "Full discovery through launch",
      "Weekly demos, no status theatre",
      "Codebase and assets handed over",
    ],
  },
  {
    name: "Partner",
    duration: "Monthly",
    bestFor: "Founders who want a marketing and product team on tap.",
    includes: [
      "Reserved capacity each month",
      "Continuous shipping and reporting",
      "Cancel with 30 days notice",
    ],
  },
] as const;

/** Operating principles listed on /about and /approach. */
export const principles = [
  {
    title: "One team, no telephone game",
    body: "The people you meet do the work. No account layer diluting the brief.",
  },
  {
    title: "Strategy that ships",
    body: "We only recommend what we are willing to build ourselves.",
  },
  {
    title: "Small scope, real dates",
    body: "Ship a smaller thing on the day we promised — not a bigger thing eventually.",
  },
  {
    title: "Evidence over instinct",
    body: "Instinct sets the hypothesis. Numbers decide what happens next.",
  },
  {
    title: "You own everything",
    body: "Code, accounts, assets, docs. No lock-in, no mystery logins.",
  },
  {
    title: "Automate the boring work",
    body: "If a task is repeated and unloved, it should be a workflow.",
  },
] as const;
