"use client";

import { useEffect } from "react";

import { trackNewsView } from "@/lib/tracking";

/** Fires a `news_article_view` dataLayer event once when a news detail mounts. */
export function NewsViewTracker({
  slug,
  category,
}: {
  slug: string;
  category: string;
}) {
  useEffect(() => {
    trackNewsView({ news_slug: slug, news_category: category });
  }, [slug, category]);

  return null;
}
