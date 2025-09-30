export const dynamic = "force-static"; // next export richiede dati totalmente statici

import type { MetadataRoute } from "next";

const HTTPS = "https://";
const APP_NAME = "template.";
const BASE_URL = "phoskee.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: `${HTTPS}${APP_NAME}${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${HTTPS}quiz-sapienza.${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${HTTPS}labs.${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${HTTPS}mutuo.${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${HTTPS}${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...baseEntries];
}
