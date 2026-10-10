import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}. ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = ["Marketing and", "engineering,", "built as one."];
const KICKER = "Brand · Campaigns · Websites · Apps · AI workflows";
const WORDMARK = site.name;
const PLACE = `${site.contact.city}, ${site.contact.country}`;

/**
 * Fetches a subset of Schibsted Grotesk (only the glyphs on the card) as TTF.
 * Google serves TTF to clients without a browser user agent. If the network is
 * unavailable the card still renders in the bundled fallback font.
 */
async function loadSchibsted(weight: number, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@${weight}&text=${encodeURIComponent(text)}`,
      { signal: AbortSignal.timeout(4000) },
    ).then((response) => response.text());
    const url = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
    )?.[1];
    if (!url) return null;
    const font = await fetch(url, { signal: AbortSignal.timeout(4000) });
    return font.ok ? await font.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [bold, medium] = await Promise.all([
    loadSchibsted(800, HEADLINE.join("") + WORDMARK),
    loadSchibsted(500, KICKER + PLACE),
  ]);

  const fonts = [
    ...(bold
      ? [
          {
            name: "Schibsted",
            data: bold,
            weight: 800 as const,
            style: "normal" as const,
          },
        ]
      : []),
    ...(medium
      ? [
          {
            name: "Schibsted",
            data: medium,
            weight: 500 as const,
            style: "normal" as const,
          },
        ]
      : []),
  ];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#0a1733",
        fontFamily: fonts.length ? "Schibsted" : undefined,
        overflow: "hidden",
      }}
    >
      {/* The mark, oversized and cropped: saffron and cobalt halves about to meet. */}
      <div
        style={{
          position: "absolute",
          right: 236,
          top: 75,
          width: 240,
          height: 480,
          background: "#ffb224",
          borderRadius: "240px 0 0 240px",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -16,
          top: 75,
          width: 240,
          height: 480,
          background: "#2b59ff",
          borderRadius: "0 240px 240px 0",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 0 64px 72px",
          width: 720,
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 3 }}>
            <div
              style={{
                width: 17,
                height: 34,
                background: "#ffb224",
                borderRadius: "17px 0 0 17px",
              }}
            />
            <div
              style={{
                width: 17,
                height: 34,
                background: "#2b59ff",
                borderRadius: "0 17px 17px 0",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: -1,
              color: "#f5f6f9",
            }}
          >
            {WORDMARK}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {HEADLINE.map((line, index) => (
            <div
              key={line}
              style={{
                display: "flex",
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: -4,
                color: index === 2 ? "#ffb224" : "#f5f6f9",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", color: "#9fb6ff" }}>{KICKER}</div>
          <div style={{ display: "flex", color: "#a9b4cf" }}>{PLACE}</div>
        </div>
      </div>
    </div>,
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
