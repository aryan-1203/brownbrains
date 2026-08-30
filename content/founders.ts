/**
 * Founder profiles shown on /about.
 *
 * `side` controls which tone each founder card renders in — "human" reads on
 * paper, "machine" reads on espresso.
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
    discipline: "The human half",
    bio: "Three decades of building brands and leading marketing teams. He has taken products into crowded markets, rebuilt positioning that had stopped working, and run the kind of campaigns that are judged on revenue rather than impressions.",
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
    discipline: "The machine half",
    bio: "A software engineer who moved into product management, which means the roadmap and the implementation come from the same head. He builds the web apps, mobile products and AI workflows, and decides what is worth building in the first place.",
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
    discipline: "The machine half",
    bio: "A full-time senior software developer who has spent years shipping end-to-end product systems — from the application layer through to the databases underneath. He has built scalable solutions across the stack, and he designs for the load that shows up after launch, not only the demo.",
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
    a: "It depends on scope, so we quote per engagement rather than publish a rate card. Sprints start small and fixed; builds are priced once the scope is written down in week one. You will always see the number before work begins.",
  },
  {
    q: "How quickly can you start?",
    a: "We take on a limited number of engagements at a time so senior leadership stays close to every one of them. Reach out and we will tell you honestly what the next open slot looks like.",
  },
  {
    q: "Can you work with our existing team or agency?",
    a: "Often that is the best setup. We plug in where the gap is, hand over documentation as we go, and stay out of the way of what is already working.",
  },
  {
    q: "Do you only take on both marketing and engineering together?",
    a: "No. Plenty of clients hire us for one half. The advantage is that the other half is available the moment you need it, without onboarding a second vendor.",
  },
];
