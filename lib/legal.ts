import "server-only";

import type { Metadata } from "next";

import type { LegalSection } from "@/components/public/LegalPageLayout";
import { getPageBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { formatDateTR, parseJson } from "@/lib/utils";

type LegalContent = {
  legalNotice?: string;
  sections?: LegalSection[];
};

export type ResolvedLegalPage = {
  title: string;
  updatedLabel: string;
  sections: LegalSection[];
  legalNotice?: string;
};

/**
 * Load a legal page from the DB, falling back to the provided default sections
 * when the row (or its content) is missing — so legal pages always render.
 */
export async function resolveLegalPage(
  slug: string,
  fallbackTitle: string,
  fallbackSections: LegalSection[],
): Promise<ResolvedLegalPage> {
  const page = await getPageBySlug(slug);
  const content = parseJson<LegalContent>(page?.content, {});

  const sections =
    content.sections && content.sections.length > 0 ? content.sections : fallbackSections;

  const updatedLabel = page?.heroSubtitle?.trim()
    ? page.heroSubtitle
    : `Son Güncelleme: ${formatDateTR(page?.updatedAt ?? new Date())}`;

  return {
    title: page?.heroTitle || page?.title || fallbackTitle,
    updatedLabel,
    sections,
    legalNotice: content.legalNotice,
  };
}

export async function legalMetadata(
  slug: string,
  title: string,
  description: string,
): Promise<Metadata> {
  const page = await getPageBySlug(slug);
  return buildMetadata({
    title: page?.seoTitle || `${title} | Kazanım Gayrimenkul`,
    description: page?.seoDescription || description,
    path: `/${slug}`,
    ogImage: page?.ogImage,
    canonicalUrl: page?.canonicalUrl,
    robots: page?.robots,
  });
}
