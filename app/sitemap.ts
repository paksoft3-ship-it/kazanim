import type { MetadataRoute } from "next";

import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

/**
 * Dynamic sitemap.
 *
 * Static routes are always emitted. Published projects and news articles are
 * appended from the database — but the query is wrapped so an unreachable
 * database (first deploy before `prisma migrate deploy`, a Neon cold start
 * that times out, …) degrades to the static list instead of failing the build.
 */

export const revalidate = 3600; // rebuild hourly

type StaticRoute = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },

  // Kurumsal
  { path: "/kurumsal/hakkimizda", priority: 0.8, changeFrequency: "monthly" },
  { path: "/kurumsal/tarihcemiz", priority: 0.6, changeFrequency: "yearly" },
  { path: "/kurumsal/vizyon-misyon", priority: 0.6, changeFrequency: "yearly" },
  { path: "/kurumsal/kalite-politikamiz", priority: 0.6, changeFrequency: "yearly" },
  { path: "/kurumsal/faaliyet-alanlari", priority: 0.7, changeFrequency: "monthly" },

  // Projeler
  { path: "/projeler", priority: 0.9, changeFrequency: "weekly" },
  { path: "/projeler/devam-eden", priority: 0.8, changeFrequency: "weekly" },
  { path: "/projeler/tamamlanan", priority: 0.8, changeFrequency: "monthly" },

  // Diğer listeleme sayfaları
  { path: "/galeri", priority: 0.8, changeFrequency: "monthly" },
  { path: "/haberler", priority: 0.8, changeFrequency: "weekly" },
  { path: "/insan-kaynaklari", priority: 0.7, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.8, changeFrequency: "monthly" },

  // Yasal metinler
  { path: "/kvkk", priority: 0.3, changeFrequency: "yearly" },
  { path: "/gizlilik-politikasi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cerez-politikasi", priority: 0.3, changeFrequency: "yearly" },
  { path: "/kullanim-kosullari", priority: 0.3, changeFrequency: "yearly" },
];

async function dynamicEntries(base: string): Promise<MetadataRoute.Sitemap> {
  const [projects, news] = await Promise.all([
    prisma.project.findMany({
      where: { publishStatus: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  return [
    ...projects.map((project) => ({
      url: `${base}/projeler/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...news.map((article) => ({
      url: `${base}/haberler/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: route.path === "/" ? base : `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    return [...staticEntries, ...(await dynamicEntries(base))];
  } catch (error) {
    console.error("[sitemap] database unavailable, serving static routes only:", error);
    return staticEntries;
  }
}
