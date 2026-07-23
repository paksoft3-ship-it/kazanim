"use client";

import { useEffect } from "react";

import { trackProjectListView } from "@/lib/tracking";

/**
 * Fires a single `project_list_view` on mount for the filtered listing pages
 * (devam-eden / tamamlanan) that render server-side without client filters.
 */
export function ProjectListTracker({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  useEffect(() => {
    trackProjectListView({ event_label: label, value: count });
  }, [label, count]);

  return null;
}
