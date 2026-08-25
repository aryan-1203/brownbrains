export type GradientTone = "paper" | "machine" | "ember";

const surfaces: Record<GradientTone, string> = {
  paper: "#f4efe6",
  machine: "#14100e",
  ember: "#c2431c",
};

/**
 * Warm taupe sits between paper and espresso. Interpolating those two directly
 * — even in oklab — dips through a silvery grey that reads as a rendering
 * artefact rather than a dusk. Ember is already saturated and warm, so pairs
 * involving it need no help.
 */
const NEUTRAL_BRIDGE = "#5c4b41";

/**
 * The `background-image` for a band that dissolves one tone into another.
 *
 * Interpolated in oklab so the ramp is perceptually even instead of bunching up
 * at the dark end the way sRGB does.
 */
export function toneGradient(from: GradientTone, to: GradientTone) {
  const pair = new Set([from, to]);
  const stops = [surfaces[from]];

  if (pair.has("paper") && pair.has("machine")) {
    stops.push(`${NEUTRAL_BRIDGE} 52%`);
  }

  stops.push(surfaces[to]);
  return `linear-gradient(to bottom in oklab, ${stops.join(", ")})`;
}

export const toneSurface = (tone: GradientTone) => surfaces[tone];
