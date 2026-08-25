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
      "Before anything gets made, we listen. Your numbers, your customers, your competitors and the thing that is quietly blocking growth. Most engagements change shape in this week, which is exactly the point.",
    outputs: ["Discovery calls", "Data and funnel audit", "Constraint named"],
  },
  {
    id: "frame",
    title: "Frame",
    duration: "Week 1",
    description:
      "We write down the position, the audience and the scope in language you would repeat to an investor. If we cannot make it fit on one page, it is not clear enough yet.",
    outputs: ["Positioning", "Scope and roadmap", "Success metrics"],
  },
  {
    id: "prototype",
    title: "Prototype",
    duration: "Weeks 2–3",
    description:
      "The cheapest version that can still be judged. A landing page, a clickable flow, one automated workflow. We put it in front of real people early, while changing our minds is still free.",
    outputs: ["Working prototype", "Creative directions", "Early feedback"],
  },
  {
    id: "ship",
    title: "Ship",
    duration: "Weeks 4–8",
    description:
      "Build and launch, in public, with a date. Marketing and engineering move together here rather than in sequence, which is the whole advantage of hiring one studio instead of two vendors.",
    outputs: ["Production build", "Campaign live", "Handover docs"],
  },
  {
    id: "compound",
    title: "Compound",
    duration: "Ongoing",
    description:
      "Launch is the start of the data. We read what happened, kill what did not work, and reinvest in what did. This is where the returns actually accumulate.",
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
    title: "One studio, no telephone game",
    body: "The people you meet are the people who do the work. Nothing gets translated through an account manager and diluted on the way.",
  },
  {
    title: "Strategy that survives contact",
    body: "A plan that cannot be built is a slide deck. We only recommend things we are willing to ship ourselves.",
  },
  {
    title: "Small scope, real dates",
    body: "We would rather ship a smaller thing on the day we promised than a bigger thing eventually.",
  },
  {
    title: "Evidence over instinct",
    body: "Instinct sets the hypothesis. Numbers decide what happens next, and we show you both.",
  },
  {
    title: "You own everything",
    body: "Code, accounts, assets, documentation. No lock-in, no hostage situations, no mystery logins.",
  },
  {
    title: "Automate the boring half",
    body: "If a task is repeated and unloved, it should be a workflow. Your hours belong on the work only you can do.",
  },
] as const;
