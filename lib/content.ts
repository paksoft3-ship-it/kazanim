import { cache } from "react";

import { prisma } from "@/lib/db";

/**
 * Read helpers for public pages.
 *
 * Every helper degrades gracefully when the database is unreachable (e.g. a
 * build running before `prisma migrate` has been applied), returning empty
 * results instead of throwing so the site still renders.
 */

async function safe<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("[content] query failed:", error);
    return fallback;
  }
}

export const PROJECT_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  status: true,
  type: true,
  location: true,
  shortDescription: true,
  coverImage: true,
  progressOverall: true,
  deliveryDate: true,
} as const;

/**
 * Distinct filter options for the homepage project finder, derived from the
 * actual published project records so the finder never offers dead filters.
 */
export const getProjectFilterOptions = cache(async () =>
  safe(
    async () => {
      const projects = await prisma.project.findMany({
        where: { publishStatus: "PUBLISHED" },
        select: { location: true, type: true, deliveryDate: true },
      });
      const locations = new Set<string>();
      const types = new Set<string>();
      const deliveryYears = new Set<string>();
      for (const project of projects) {
        if (project.location) locations.add(project.location);
        if (project.type) types.add(project.type);
        if (project.deliveryDate) {
          deliveryYears.add(String(project.deliveryDate.getFullYear()));
        }
      }
      return {
        locations: Array.from(locations).sort((a, b) => a.localeCompare(b, "tr")),
        types: Array.from(types).sort((a, b) => a.localeCompare(b, "tr")),
        deliveryYears: Array.from(deliveryYears).sort(),
      };
    },
    { locations: [], types: [], deliveryYears: [] },
  ),
);

export const getPublishedProjects = cache(
  async (status?: "ONGOING" | "COMPLETED" | "UPCOMING") =>
    safe(
      () =>
        prisma.project.findMany({
          where: { publishStatus: "PUBLISHED", ...(status ? { status } : {}) },
          select: PROJECT_CARD_SELECT,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
      [],
    ),
);

export const getFeaturedProjects = cache(async (take = 3) =>
  safe(
    () =>
      prisma.project.findMany({
        where: { publishStatus: "PUBLISHED", isFeatured: true },
        select: PROJECT_CARD_SELECT,
        orderBy: { sortOrder: "asc" },
        take,
      }),
    [],
  ),
);

export const getProjectBySlug = cache(async (slug: string) =>
  safe(
    () =>
      prisma.project.findFirst({
        where: { slug, publishStatus: "PUBLISHED" },
        include: {
          media: { orderBy: { sortOrder: "asc" } },
          news: {
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
            take: 3,
          },
        },
      }),
    null,
  ),
);

/** Lightweight list used to populate project pickers in lead forms. */
export const getProjectOptions = cache(async () =>
  safe(
    () =>
      prisma.project.findMany({
        where: { publishStatus: "PUBLISHED" },
        select: { id: true, title: true, slug: true },
        orderBy: { sortOrder: "asc" },
      }),
    [],
  ),
);

export const NEWS_CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  category: true,
  publishedAt: true,
} as const;

export const getPublishedNews = cache(async (take?: number) =>
  safe(
    () =>
      prisma.newsArticle.findMany({
        where: { status: "PUBLISHED" },
        select: NEWS_CARD_SELECT,
        orderBy: { publishedAt: "desc" },
        ...(take ? { take } : {}),
      }),
    [],
  ),
);

export const getNewsBySlug = cache(async (slug: string) =>
  safe(
    () =>
      prisma.newsArticle.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: {
          relatedProject: { select: PROJECT_CARD_SELECT },
        },
      }),
    null,
  ),
);

export const getRelatedNews = cache(async (slug: string, take = 3) =>
  safe(
    () =>
      prisma.newsArticle.findMany({
        where: { status: "PUBLISHED", slug: { not: slug } },
        select: NEWS_CARD_SELECT,
        orderBy: { publishedAt: "desc" },
        take,
      }),
    [],
  ),
);

export const getGalleryMedia = cache(async () =>
  safe(
    () =>
      prisma.mediaAsset.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: { linkedProject: { select: { title: true, slug: true } } },
      }),
    [],
  ),
);

export const getPageBySlug = cache(async (slug: string) =>
  safe(
    () => prisma.page.findFirst({ where: { slug, status: "PUBLISHED" } }),
    null,
  ),
);

export const getOpenPositions = cache(async () =>
  safe(
    () =>
      prisma.jobPosition.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
    [],
  ),
);

/** Counts used by the homepage statistics strip when values are auto-derived. */
export const getProjectCounts = cache(async () =>
  safe(
    async () => {
      const [ongoing, completed] = await Promise.all([
        prisma.project.count({ where: { publishStatus: "PUBLISHED", status: "ONGOING" } }),
        prisma.project.count({ where: { publishStatus: "PUBLISHED", status: "COMPLETED" } }),
      ]);
      return { ongoing, completed };
    },
    { ongoing: 0, completed: 0 },
  ),
);
