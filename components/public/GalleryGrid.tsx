"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Icon } from "@/components/public/Icon";
import { trackGalleryFilter, trackGalleryOpen } from "@/lib/tracking";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  id: string;
  url: string;
  title: string | null;
  altText: string | null;
  category: string;
  projectName?: string | null;
};

type Props = {
  items: GalleryItem[];
  categories: Array<{ id: string; label: string }>;
};

export function GalleryGrid({ items, categories }: Props) {
  const [active, setActive] = useState("tumu");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible =
    active === "tumu" ? items : items.filter((item) => item.category === active);

  const close = useCallback(() => setLightboxIndex(null), []);

  const step = useCallback(
    (delta: number) => {
      setLightboxIndex((current) => {
        if (current === null) return null;
        const next = (current + delta + visible.length) % visible.length;
        return next;
      });
    },
    [visible.length],
  );

  // Keyboard controls for the lightbox.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, step]);

  const current = lightboxIndex !== null ? visible[lightboxIndex] : null;

  return (
    <>
      {/* Filter tabs */}
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Galeri kategorileri">
        {categories.map((category) => {
          const isActive = active === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActive(category.id);
                trackGalleryFilter(category.label);
              }}
              className={cn(
                "border px-6 py-2.5 font-button-text uppercase tracking-[0.1em] transition-colors",
                isActive
                  ? "border-midnight-navy bg-midnight-navy text-white"
                  : "border-warm-border bg-white text-midnight-navy hover:border-forest-emerald hover:text-forest-emerald",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="border border-warm-border bg-white p-12 text-center text-slate">
          Bu kategoride henüz görsel bulunmuyor.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setLightboxIndex(index);
                trackGalleryOpen({
                  gallery_category: item.category,
                  event_label: item.title ?? item.id,
                });
              }}
              className="group relative aspect-square overflow-hidden border border-warm-border/40 bg-surface-container-low"
              aria-label={`${item.title ?? "Galeri görseli"} — büyüt`}
            >
              <Image
                src={item.url}
                alt={item.altText || item.title || "Kazanım Gayrimenkul proje görseli"}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-forest-emerald/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Icon name="maximize" className="h-7 w-7 text-white" />
                {item.title ? (
                  <span className="px-3 text-center text-body-sm font-medium text-white">
                    {item.title}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title ?? "Görsel önizleme"}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight-navy/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute right-5 top-5 p-2 text-white/80 transition-colors hover:text-white"
          >
            <Icon name="close" className="h-7 w-7" />
          </button>

          {visible.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Önceki görsel"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 p-3 text-white/70 transition-colors hover:text-white lg:left-8"
              >
                <Icon name="chevron-left" className="h-9 w-9" />
              </button>
              <button
                type="button"
                aria-label="Sonraki görsel"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 p-3 text-white/70 transition-colors hover:text-white lg:right-8"
              >
                <Icon name="chevron-right" className="h-9 w-9" />
              </button>
            </>
          ) : null}

          <figure
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={current.url}
                alt={current.altText || current.title || "Kazanım Gayrimenkul proje görseli"}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {current.title || current.projectName ? (
              <figcaption className="mt-4 text-center text-body-sm text-white/70">
                {current.title}
                {current.projectName ? ` — ${current.projectName}` : ""}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </>
  );
}
