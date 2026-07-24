import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Founder-Being | Building Healthier Founders";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const lockupData = await readFile(
    join(process.cwd(), "public/brand/lockup-white.png"),
  );
  const lockupSrc = `data:image/png;base64,${lockupData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "64px",
          background: "#0B0B0B",
          color: "#F8F8F8",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lockupSrc}
          width={200}
          height={240}
          alt=""
          style={{ marginBottom: 36 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Georgia, serif",
            fontSize: 40,
            lineHeight: 1.25,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          <span>Building Healthier Founders.</span>
          <span style={{ opacity: 0.9 }}>Building Better Companies.</span>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 16,
            letterSpacing: 5,
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
