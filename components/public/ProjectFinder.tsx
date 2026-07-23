"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/public/Icon";
import { PROJECT_STATUS_LABELS } from "@/lib/navigation";
import { trackProjectFilter } from "@/lib/tracking";

export type ProjectFinderOptions = {
  locations: string[];
  types: string[];
  deliveryYears: string[];
};

/**
 * Premium project finder panel that overlaps the lower hero boundary.
 *
 * This is a finder for Kazanım's own projects — not a marketplace search.
 * Every filter maps 1:1 onto the /projeler query parameters, so the panel is
 * fully functional, never decorative.
 */
export function ProjectFinder({ options }: { options: ProjectFinderOptions }) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [delivery, setDelivery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("lokasyon", location);
    if (type) params.set("tur", type);
    if (status) params.set("durum", status);
    if (delivery) params.set("teslim", delivery);

    const applied = [
      location && `lokasyon: ${location}`,
      type && `tür: ${type}`,
      status && `durum: ${PROJECT_STATUS_LABELS[status] ?? status}`,
      delivery && `teslim: ${delivery}`,
    ]
      .filter(Boolean)
      .join(", ");
    trackProjectFilter(applied || "tümü", {
      cta_location: "home_finder",
      filter_location: location || undefined,
      filter_project_type: type || undefined,
      filter_project_status: status || undefined,
    });

    const query = params.toString();
    router.push(query ? `/projeler?${query}` : "/projeler");
  };

  const selectClass =
    "w-full appearance-none border border-white/15 bg-dark-navy/60 px-4 py-3.5 text-body-sm text-white outline-none transition-colors focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold [&>option]:bg-dark-navy [&>option]:text-white";
  const labelClass =
    "mb-2 block font-label-caps uppercase tracking-[0.14em] text-soft-gold/90";

  return (
    <section
      aria-label="Proje arama"
      className="container-max relative z-20 -mt-20 lg:-mt-24"
    >
      <form
        onSubmit={handleSubmit}
        className="border border-champagne-gold/25 bg-midnight-navy/95 p-6 shadow-2xl backdrop-blur-md lg:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <div>
            <label htmlFor="finder-location" className={labelClass}>
              Lokasyon
            </label>
            <select
              id="finder-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={selectClass}
            >
              <option value="">Tümü</option>
              {options.locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="finder-type" className={labelClass}>
              Proje Türü
            </label>
            <select
              id="finder-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className={selectClass}
            >
              <option value="">Tümü</option>
              {options.types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="finder-status" className={labelClass}>
              Proje Durumu
            </label>
            <select
              id="finder-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={selectClass}
            >
              <option value="">Tümü</option>
              {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="finder-delivery" className={labelClass}>
              Teslim Dönemi
            </label>
            <select
              id="finder-delivery"
              value={delivery}
              onChange={(event) => setDelivery(event.target.value)}
              className={selectClass}
            >
              <option value="">Tümü</option>
              {options.deliveryYears.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-champagne-gold px-6 py-3.5 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:bg-soft-gold"
          >
            <Icon name="search" className="h-5 w-5" />
            Projeleri Bul
          </button>
        </div>
      </form>
    </section>
  );
}
