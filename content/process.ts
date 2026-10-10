/** The five stages every engagement runs through. Read by / and /approach. */

export type StageId = "signal" | "frame" | "prototype" | "ship" | "compound";

export type Stage = {
  id: StageId;
  title: string;
  /** Rough elapsed time. */
  duration: string;
  /** One short line. */
  description: string;
  outputs: string[];
};

export const stages: Stage[] = [
  {
    id: "signal",
    title: "Signal",
    duration: "Week 1",
    description: "Find the one thing actually blocking growth.",
    outputs: [
      "Data and funnel audit",
      "Competitor scan",
      "The constraint, named",
    ],
  },
  {
    id: "frame",
    title: "Frame",
    duration: "Week 2",
    description: "Position, audience and scope, on one page.",
    outputs: ["Positioning", "Scope and roadmap", "Success metrics"],
  },
  {
    id: "prototype",
    title: "Prototype",
    duration: "Weeks 3 to 4",
    description: "The cheapest version real people can judge.",
    outputs: ["Working prototype", "Creative directions", "User feedback"],
  },
  {
    id: "ship",
    title: "Ship",
    duration: "Weeks 5 to 8",
    description: "Build and campaign launch together, on a fixed date.",
    outputs: ["Production build", "Campaign live", "Handover docs"],
  },
  {
    id: "compound",
    title: "Compound",
    duration: "Ongoing",
    description: "Measure, cut what failed, double what worked.",
    outputs: ["Monthly review", "Iteration backlog", "Growth reports"],
  },
];

/** Engagement shapes listed on /approach. */
export const engagementModels = [
  {
    name: "Sprint",
    duration: "2 to 4 weeks",
    bestFor: "One sharp question, or a launch that cannot slip.",
    includes: [
      "Fixed scope, fixed price",
      "One clear deliverable",
      "Senior people, direct",
    ],
    covers: ["signal", "frame", "prototype"],
    /** Honest nudge, not a popularity claim. */
    note: "Easiest first step",
  },
  {
    name: "Build",
    duration: "6 to 12 weeks",
    bestFor: "A brand, site, app or workflow, taken from zero to live.",
    includes: [
      "Discovery through launch",
      "Weekly demos",
      "Code and assets handed over",
    ],
    covers: ["signal", "frame", "prototype", "ship"],
    note: null,
  },
  {
    name: "Partner",
    duration: "Monthly",
    bestFor: "A marketing and product team, on tap.",
    includes: [
      "Reserved monthly capacity",
      "Ship and report continuously",
      "30 days notice to stop",
    ],
    covers: ["ship", "compound"],
    note: null,
  },
] as const satisfies ReadonlyArray<{
  name: string;
  duration: string;
  bestFor: string;
  includes: readonly string[];
  covers: readonly StageId[];
  note: string | null;
}>;

/** Operating principles listed on /about and /approach. */
export const principles = [
  { title: "One team, one brief", body: "The people you meet do the work." },
  {
    title: "Strategy that ships",
    body: "We only recommend what we would build.",
  },
  {
    title: "Small scope, real dates",
    body: "A smaller thing, on the promised day.",
  },
  {
    title: "Evidence over instinct",
    body: "Instinct guesses. Numbers decide.",
  },
  { title: "You own everything", body: "Code, accounts, assets. No lock-in." },
  {
    title: "Automate the boring",
    body: "Repeated and unloved? It becomes a workflow.",
  },
] as const;
