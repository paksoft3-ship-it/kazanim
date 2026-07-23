"use client";

import { useEffect, useMemo, useState } from "react";

import { ProjectCard, type ProjectCardData } from "@/components/public/ProjectCard";
import { Icon } from "@/components/public/Icon";
import { PROJECT_STATUS_LABELS } from "@/lib/navigation";
import { trackProjectFilter, trackProjectListView } from "@/lib/tracking";

type Filter = { id: string; label: string };

const STATUS_FILTERS: Filter[] = [
  { id: "all", label: "Tüm Projeler" },
  { id: "ONGOING", label: PROJECT_STATUS_LABELS.ONGOING },
  { id: "COMPLETED", label: PROJECT_STATUS_LABELS.COMPLETED },
  { id: "UPCOMING", label: PROJECT_STATUS_LABELS.UPCOMING },
];

export type ProjectListingInitialFilters = {
  status?: string;
  type?: string;
  location?: string;
  deliveryYear?: string;
};

/**
 * Client-side project browser: status, type, location and delivery filters
 * plus a search box. Initial values come from the /projeler query parameters
 * so the homepage project finder deep-links directly into a filtered list.
 * Fires project_list_view once on mount and project_filter_apply on change.
 */
export function ProjectListing({
  projects,
  initialFilters = {},
}: {
  projects: ProjectCardData[];
  initialFilters?: ProjectListingInitialFilters;
}) {
  const [status, setStatus] = useState(initialFilters.status || "all");
  const [type, setType] = useState(initialFilters.type || "all");
  const [location, setLocation] = useState(initialFilters.location || "all");
  const [delivery, setDelivery] = useState(initialFilters.deliveryYear || "all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    trackProjectListView({ event_label: `${projects.length} proje` });
  }, [projects.length]);

  const types = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      if (project.type) set.add(project.type);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [projects]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      if (project.location) set.add(project.location);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "tr"));
  }, [projects]);

  const deliveryYears = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      if (project.deliveryDate) {
        set.add(String(new Date(project.deliveryDate).getFullYear()));
      }
    }
    return Array.from(set).sort();
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return projects.filter((project) => {
      if (status !== "all" && project.status !== status) return false;
      if (type !== "all" && project.type !== type) return false;
      if (location !== "all" && project.location !== location) return false;
      if (delivery !== "all") {
        const year = project.deliveryDate
          ? String(new Date(project.deliveryDate).getFullYear())
          : null;
        if (year !== delivery) return false;
      }
      if (q) {
        const haystack = `${project.title} ${project.location ?? ""} ${project.shortDescription ?? ""}`.toLocaleLowerCase("tr");
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [projects, status, type, location, delivery, query]);

  const selectClass =
    "border border-warm-border bg-white px-4 py-2.5 text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald";

  return (
    <>
      {/* Filters */}
      <div className="mb-10 space-y-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Duruma göre filtrele">
          {STATUS_FILTERS.map((filter) => {
            const active = status === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setStatus(filter.id);
                  trackProjectFilter(`durum: ${filter.label}`, {
                    filter_project_status: filter.id === "all" ? undefined : filter.id,
                  });
                }}
                className={
                  active
                    ? "border border-deep-emerald bg-deep-emerald px-6 py-2.5 font-button-text uppercase tracking-[0.1em] text-white"
                    : "border border-warm-border bg-white px-6 py-2.5 font-button-text uppercase tracking-[0.1em] text-midnight-navy transition-colors hover:border-forest-emerald hover:text-forest-emerald"
                }
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          {locations.length > 0 ? (
            <label className="flex items-center gap-2 text-body-sm text-slate">
              <span className="font-label-caps uppercase tracking-wider">Lokasyon</span>
              <select
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  trackProjectFilter(`lokasyon: ${event.target.value}`, {
                    filter_location:
                      event.target.value === "all" ? undefined : event.target.value,
                  });
                }}
                className={selectClass}
              >
                <option value="all">Tümü</option>
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {types.length > 0 ? (
            <label className="flex items-center gap-2 text-body-sm text-slate">
              <span className="font-label-caps uppercase tracking-wider">Tür</span>
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  trackProjectFilter(`tür: ${event.target.value}`, {
                    filter_project_type:
                      event.target.value === "all" ? undefined : event.target.value,
                  });
                }}
                className={selectClass}
              >
                <option value="all">Tümü</option>
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {deliveryYears.length > 0 ? (
            <label className="flex items-center gap-2 text-body-sm text-slate">
              <span className="font-label-caps uppercase tracking-wider">Teslim</span>
              <select
                value={delivery}
                onChange={(event) => {
                  setDelivery(event.target.value);
                  trackProjectFilter(`teslim: ${event.target.value}`);
                }}
                className={selectClass}
              >
                <option value="all">Tümü</option>
                {deliveryYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="relative flex-1 sm:max-w-xs">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Proje ara…"
              aria-label="Proje ara"
              className="w-full border border-warm-border bg-white py-2.5 pl-10 pr-4 text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
            />
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="border border-warm-border bg-white p-16 text-center">
          <Icon name="building" className="mx-auto mb-4 h-10 w-10 text-slate/60" />
          <p className="text-slate">Aramanıza uygun proje bulunamadı.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
