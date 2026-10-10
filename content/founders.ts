/**
 * The people leading Brown Brains, shown on /about.
 *
 * `half` picks the colour each portrait is washed in and the tag on it:
 * saffron for marketing, mint for product, cobalt for engineering.
 */

export type Founder = {
  half: "marketing" | "product" | "engineering";
  name: string;
  role: string;
  /** Short label shown above the name. */
  discipline: string;
  /** Overrides the tag pinned to the portrait (defaults to the half's name). */
  tag?: string;
  /** One line. */
  bio: string;
  /** A few short focus areas (keep it brief). */
  focus: string[];
  /** Portrait in /public, e.g. "/founder-ajay.jpg". */
  portrait: string;
  /** Leave "" to hide the link. */
  linkedin: string;
};

export const founders: Founder[] = [
  {
    half: "marketing",
    name: "Ajay Shrivastava",
    role: "Founder & Chairman",
    discipline: "Strategy & Brand Building",
    tag: "Strategy & Brand Building",
    bio: "Decades of brand leadership, with growth judged on revenue, not reach.",
    focus: ["Brand & positioning", "Go-to-market", "Campaign leadership"],
    portrait: "/founder-ajay.jpg",
    linkedin: "https://www.linkedin.com/in/ajay-shrivastava-20148795/",
  },
  {
    half: "product",
    name: "Aryan Shrivastava",
    role: "Co-Founder & Director",
    discipline: "Product & Engineering",
    bio: "Engineer turned product lead. The roadmap and the build come from one desk.",
    focus: ["Product strategy", "Web & app engineering", "AI workflows"],
    portrait: "/founder-aryan.jpg",
    linkedin: "https://www.linkedin.com/in/aryan-shrivastava27/",
  },
  {
    half: "engineering",
    name: "Rammuni Diwan",
    role: "Co-Founder & Director",
    discipline: "Engineering",
    bio: "Full-stack systems built for production load, from apps to databases.",
    focus: ["Product engineering", "Scalable systems", "Backend architecture"],
    portrait: "/founder-rammuni.jpg",
    linkedin: "https://www.linkedin.com/in/rammuni-diwan-832053256/",
  },
];
