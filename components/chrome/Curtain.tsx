import type { CSSProperties } from "react";

/**
 * First-load intro: "Brown" and "Brains" type out side by side in time, then
 * the curtain parts along the seam between them. Pure CSS (see globals.css),
 * so it runs before hydration and is skipped for the rest of the session.
 */

function Typed({ word, step, className }: { word: string; step: number; className: string }) {
  return (
    <span className={`curtain-word ${className}`}>
      {word.split("").map((char, index) => (
        <span
          key={index}
          className="curtain-char"
          style={{ "--i": index, "--step": `${step}s` } as CSSProperties}
        >
          {char}
        </span>
      ))}
      <span className="curtain-caret" />
    </span>
  );
}

export function Curtain() {
  return (
    <div className="curtain" aria-hidden>
      {/* Both words finish on the same beat: 5 letters and 6 letters. */}
      <div className="curtain-panel" data-side="top">
        <Typed word="Brown" step={0.13} className="pb-[0.06em] text-saffron" />
      </div>
      <div className="curtain-panel" data-side="bottom">
        <Typed word="Brains" step={0.105} className="pt-[0.06em] text-sky" />
      </div>
      <span className="curtain-seam" />
    </div>
  );
}
