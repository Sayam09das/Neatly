import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/quote", "/booking"],
    },
    ...(siteUrl === undefined
      ? {}
      : {
          sitemap: `${siteUrl}/sitemap.xml`,
        }),
  };
}
