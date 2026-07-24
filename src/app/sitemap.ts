import type { MetadataRoute } from "next";
import { eventsCatalog } from "@/lib/events/catalog";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/mission`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/impact`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteConfig.url}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${siteConfig.url}/patrons`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteConfig.url}/community`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteConfig.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const eventRoutes: MetadataRoute.Sitemap = eventsCatalog.map((e) => ({
    url: `${siteConfig.url}${e.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: e.featured ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...eventRoutes];
}
