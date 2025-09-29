import type { MetadataRoute } from "next";

const BASE_URL = "https://phoskee.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...baseEntries];
}
