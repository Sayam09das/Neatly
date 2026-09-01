import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  if (siteUrl === undefined) {
    return [];
  }

  return [
    {
      url: siteUrl,
    },
    {
      url: `${siteUrl}/about`,
    },
    {
      url: `${siteUrl}/contact`,
    },
    {
      url: `${siteUrl}/process`,
    },
    {
      url: `${siteUrl}/services`,
    },
    {
      url: `${siteUrl}/testimonials`,
    },
    {
      url: `${siteUrl}/blog`,
    },
    {
      url: `${siteUrl}/privacy`,
    },
    {
      url: `${siteUrl}/terms`,
    },
    {
      url: `${siteUrl}/cookies`,
    },
  ];
}
