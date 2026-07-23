import type { MetadataRoute } from "next";

import { isIndexingAllowed, siteUrl } from "@/lib/seo";

/**
 * robots.txt — public content is crawlable; the admin panel and API surface
 * are not. (next.config.mjs additionally sends X-Robots-Tag: noindex on
 * /admin/* and /api/*, so the block holds even if a crawler ignores this.)
 *
 * Preview deployments and deployments without a configured production domain
 * disallow everything — the Kazanım domain is not confirmed yet, and no
 * temporary host should ever be indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  if (!isIndexingAllowed()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: base,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
