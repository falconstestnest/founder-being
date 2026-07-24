import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Founder-Being | Building Healthier Founders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const monogramData = await readFile(
    join(process.cwd(), "public/brand/monogram-gold-512.png"),
  );
  const monogramSrc = `data:image/png;base64,${monogramData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "72px 80px",
          background: "#0B0B0B",
          color: "#F8F8F8",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={monogramSrc}
          width={168}
          height={202}
          alt=""
          style={{ marginBottom: 40 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Georgia, serif",
            fontSize: 46,
            lineHeight: 1.2,
            maxWidth: 900,
            letterSpacing: -0.5,
          }}
        >
          <span>Building Healthier Founders.</span>
          <span style={{ opacity: 0.9 }}>Building Better Companies.</span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#FFAB33",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          Founder-Being · founderbeing.org
        </div>
      </div>
    ),
    { ...size },
  );
}
