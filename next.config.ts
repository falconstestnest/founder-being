import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root,
  },
  async redirects() {
    return [
      {
        source: "/gatherings/interest",
        destination: "/events/interest",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      // Canonical public URL serves full residential programme page
      {
        source: "/events/kodaikanal-full-moon-retreat-2026",
        destination: "/retreats/kodaikanal-full-moon-2026",
      },
    ];
  },
};

export default nextConfig;
