import type { Metadata } from "next";

import { getSettings } from "@/lib/settings";

/**
 * Canonical site origin. The final Kazanım domain is not confirmed yet, so no
 * production host is ever hard-coded:
 *  - `NEXT_PUBLIC_SITE_URL` (set after the domain is confirmed) wins,
 *  - otherwise the current Vercel deployment URL,
 *  - otherwise localhost for local development.
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Preview and unconfigured deployments must never be indexed. Indexing is only
 * allowed on a production deployment with the final domain configured.
 */
export function isIndexingAllowed(): boolean {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return false;
  return Boolean(process.env.NEXT_PUBLIC_SITE_URL);
}

export function absoluteUrl(path: string): string {
  if (!path) return siteUrl();
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export type BuildMetadataInput = {
  title?: string | null;
  description?: string | null;
  path: string;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  keywords?: string | null;
  type?: "website" | "article";
  publishedTime?: Date | string | null;
};

/**
 * Single source of truth for page metadata. Falls back to the admin-editable
 * global SEO defaults whenever a page-level value is missing.
 */
export async function buildMetadata(input: BuildMetadataInput): Promise<Metadata> {
  const settings = await getSettings();

  // Absolute title (bypasses the root "%s | company" template) with the brand
  // suffix appended only when the page title doesn't already include it.
  const rawTitle = input.title?.trim() || settings.defaultSeoTitle;
  const title = rawTitle.includes(settings.companyName)
    ? rawTitle
    : `${rawTitle} | ${settings.companyName}`;
  const description = input.description?.trim() || settings.defaultSeoDescription;
  const image = absoluteUrl(input.ogImage?.trim() || settings.defaultOgImage);
  const canonical = input.canonicalUrl?.trim()
    ? absoluteUrl(input.canonicalUrl)
    : absoluteUrl(input.path);

  const robotsValue = (input.robots || "index, follow").toLowerCase();
  // Preview deployments are always noindex regardless of per-page settings.
  const noindex = robotsValue.includes("noindex") || !isIndexingAllowed();
  const nofollow = robotsValue.includes("nofollow") || !isIndexingAllowed();

  return {
    title: { absolute: title },
    description,
    keywords: input.keywords || undefined,
    alternates: { canonical },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: { index: !noindex, follow: !nofollow },
    },
    openGraph: {
      type: input.type ?? "website",
      locale: "tr_TR",
      siteName: settings.companyName,
      title,
      description,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(input.publishedTime
        ? { publishedTime: new Date(input.publishedTime).toISOString() }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// ─── JSON-LD builders ────────────────────────────────────────────────────────

type JsonLd = Record<string, unknown>;

export async function organizationJsonLd(): Promise<JsonLd> {
  const s = await getSettings();
  const socials = [s.instagramUrl, s.facebookUrl, s.linkedinUrl, s.youtubeUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.companyName,
    url: siteUrl(),
    logo: absoluteUrl(s.logoPath),
    // Contact fields are omitted until official values are configured.
    ...(s.email ? { email: s.email } : {}),
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: s.address,
            addressCountry: "TR",
          },
        }
      : {}),
    ...(socials.length ? { sameAs: socials } : {}),
  };
}

export async function localBusinessJsonLd(): Promise<JsonLd> {
  const s = await getSettings();
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: s.companyName,
    url: siteUrl(),
    image: absoluteUrl(s.defaultOgImage),
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.email ? { email: s.email } : {}),
    ...(s.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: s.address,
            addressCountry: "TR",
          },
        }
      : {}),
    ...(s.workingHours ? { openingHours: s.workingHours } : {}),
  };
}

export function websiteJsonLd(name: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: siteUrl(),
    inLanguage: "tr-TR",
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description?: string | null;
  image?: string | null;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  path: string;
  publisher: string;
  publisherLogo: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description ?? undefined,
    image: input.image ? absoluteUrl(input.image) : undefined,
    datePublished: input.publishedAt ? new Date(input.publishedAt).toISOString() : undefined,
    dateModified: input.updatedAt ? new Date(input.updatedAt).toISOString() : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    inLanguage: "tr-TR",
    publisher: {
      "@type": "Organization",
      name: input.publisher,
      logo: { "@type": "ImageObject", url: absoluteUrl(input.publisherLogo) },
    },
  };
}

/**
 * Project structured data. Deliberately conservative: we describe the project
 * as a Place with the fields the admin actually filled in, and make no
 * unsupported claims about price, availability or ratings.
 */
export function projectJsonLd(input: {
  name: string;
  description?: string | null;
  image?: string | null;
  location?: string | null;
  path: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: input.name,
    description: input.description ?? undefined,
    image: input.image ? absoluteUrl(input.image) : undefined,
    url: absoluteUrl(input.path),
    ...(input.location
      ? { address: { "@type": "PostalAddress", addressLocality: input.location, addressCountry: "TR" } }
      : {}),
  };
}
