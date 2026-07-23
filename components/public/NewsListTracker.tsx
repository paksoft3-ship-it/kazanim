"use client";

import { useEffect } from "react";

import { trackNewsListView } from "@/lib/tracking";

/** Fires a `news_list_view` dataLayer event once when the listing mounts. */
export function NewsListTracker({ count }: { count: number }) {
  useEffect(() => {
    trackNewsListView({ event_label: "haberler", value: count });
  }, [count]);

  return null;
}
