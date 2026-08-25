import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card. Composed from geometry rather than a webfont so it renders
 * identically without a network fetch at build time.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#14100e",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            width: "74%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: "#c2431c",
              }}
            />
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                border: "3px solid #e9b44c",
                marginLeft: -14,
              }}
            />
            <div
              style={{
                marginLeft: 14,
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#a2938a",
              }}
            >
              {`${site.contact.city} — Est. ${site.founded}`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div
              style={{
                display: "flex",
                fontSize: 104,
                lineHeight: 1,
                letterSpacing: -4,
                color: "#f0e9df",
                fontWeight: 600,
              }}
            >
              Brown Brains
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 32,
                lineHeight: 1.3,
                color: "#e9b44c",
                maxWidth: 720,
              }}
            >
              Two brains, one studio. Marketing and engineering under one roof.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 24,
              fontSize: 19,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#a2938a",
            }}
          >
            <span>Brand</span>
            <span>Web</span>
            <span>Apps</span>
            <span>AI Workflows</span>
            <span>Product</span>
          </div>
        </div>

        {/* Paper band, echoing the split hero and its ember seam */}
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            alignItems: "flex-end",
            justifyContent: "center",
            background: "#f4efe6",
            borderLeft: "3px solid #c2431c",
            paddingBottom: 64,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6b5b50",
          }}
        >
          Human
        </div>
      </div>
    ),
    size,
  );
}
