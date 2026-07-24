import type { MetadataRoute } from "next";
import { eventsCatalog } from "@/lib/events/catalog";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/events`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...eventsCatalog.map((e) => ({
      url: `${siteConfig.url}${e.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: e.featured ? 0.9 : 0.8,
    })),
    {
      url: `${siteConfig.url}/retreats/kodaikanal-full-moon-2026`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
