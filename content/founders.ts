/**
 * Founder profiles shown on /about.
 *
 * `side` controls which tone each founder card renders in — "human" reads on
 * paper, "machine" reads on sand.
 */

export type Founder = {
  side: "human" | "machine";
  name: string;
  role: string;
  /** Mono kicker above the name. */
  discipline: string;
  bio: string;
  focus: string[];
  /** Optional headshot in /public, e.g. "/founder-dad.jpg". Leave "" for the
   *  generated monogram fallback, which looks intentional either way. */
  portrait: string;
  linkedin: string;
};

export const founders: Founder[] = [
  {
    side: "human",
    name: "Ajay Shrivastava",
    role: "Founder & Chairman",
    discipline: "Marketing",
    bio: "Three decades building brands and leading marketing teams — positioning, campaigns, and growth judged on revenue.",
    focus: [
      "Brand and positioning",
      "Go-to-market strategy",
      "Campaign leadership",
      "Client and channel relationships",
    ],
    portrait: "/founder-ajay.jpg",
    linkedin: "https://www.linkedin.com/in/ajay-shrivastava-20148795/",
  },
  {
    side: "machine",
    name: "Aryan Shrivastava",
    role: "Co-Founder & Director",
    discipline: "Product & Engineering",
    bio: "Engineer turned product lead — roadmaps and implementation from the same person. Web, mobile, and AI workflows.",
    focus: [
      "Product strategy and discovery",
      "Web and app engineering",
      "AI workflows and automation",
      "Analytics and instrumentation",
    ],
    portrait: "/founder-aryan.jpg",
    linkedin: "https://www.linkedin.com/in/aryan-shrivastava27/",
  },
  {
    side: "machine",
    name: "Rammuni Diwan",
    role: "Co-Founder & Director",
    discipline: "Engineering",
    bio: "Senior full-stack engineer shipping end-to-end systems — apps to databases, designed for production load.",
    focus: [
      "End-to-end product engineering",
      "Scalable systems and databases",
      "Backend architecture",
      "Production reliability",
    ],
    portrait: "/founder-rammuni.jpg",
    linkedin: "",
  },
];

/** Short answers shown on /contact. */
export const faqs = [
  {
    q: "What does a project typically cost?",
    a: "Scoped per engagement. Sprints are fixed; builds are priced after week-one scope. You always see the number before work begins.",
  },
  {
    q: "How quickly can you start?",
    a: "We take a limited number of engagements so senior people stay close. Reach out and we will tell you the next open slot.",
  },
  {
    q: "Can you work with our existing team or agency?",
    a: "Often that is the best setup. We fill the gap, hand over docs as we go, and stay out of what already works.",
  },
  {
    q: "Do you only take on marketing and engineering together?",
    a: "No. Hire us for one side; the other is available when you need it — without onboarding another vendor.",
  },
];
