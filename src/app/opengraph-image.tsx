import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Founder-Being | Building Healthier Founders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#0B0B0B",
          color: "#F8F8F8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 64,
            letterSpacing: 1,
            marginBottom: 40,
          }}
        >
          <span>Founder</span>
          <span style={{ color: "#FFAB33", margin: "0 8px" }}>-</span>
          <span>Being</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 42,
            lineHeight: 1.25,
            maxWidth: 900,
          }}
        >
          <span>Building Healthier Founders.</span>
          <span style={{ opacity: 0.9 }}>Building Better Companies.</span>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#FFAB33",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          founderbeing.org
        </div>
      </div>
    ),
    { ...size },
  );
}
