"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Icon } from "@/components/public/Icon";
import {
  trackProjectGalleryOpen,
  trackProjectPdfClick,
  trackProjectView,
  type EventPayload,
} from "@/lib/tracking";

/** Fires project_detail_view once on mount. */
export function ProjectViewTracker({ payload }: { payload: EventPayload }) {
  useEffect(() => {
    trackProjectView(payload);
    // Only fire once per project.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.project_slug]);
  return null;
}

export type ProjectDocument = { label: string; url: string };

/** Downloadable project documents; each click fires project_pdf_click. */
export function ProjectDocuments({
  documents,
  projectName,
  projectSlug,
}: {
  documents: ProjectDocument[];
  projectName: string;
  projectSlug: string;
}) {
  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li key={doc.url}>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackProjectPdfClick(doc.label, {
                project_name: projectName,
                project_slug: projectSlug,
              })
            }
            className="flex items-center gap-3 border border-warm-border bg-surface-container-low p-3 text-body-sm text-charcoal transition-colors hover:border-forest-emerald"
          >
            <Icon name="download" className="h-5 w-5 text-forest-emerald" />
            {doc.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export type GalleryImage = { url: string; alt: string };

/** Project gallery with lightbox + keyboard navigation. */
export function ProjectGallery({
  images,
  projectName,
}: {
  images: GalleryImage[];
  projectName: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setIndex((current) =>
        current === null ? null : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
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
  }, [index, close, step]);

  if (images.length === 0) return null;
  const current = index !== null ? images[index] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={`${image.url}-${i}`}
            type="button"
            onClick={() => {
              setIndex(i);
              trackProjectGalleryOpen({ project_name: projectName, event_label: image.alt });
            }}
            className="group relative aspect-[4/3] overflow-hidden border border-warm-border/40"
            aria-label={`${image.alt} — büyüt`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-midnight-navy/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Icon name="maximize" className="h-7 w-7 text-white" />
            </span>
          </button>
        ))}
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} görseli`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-midnight-navy/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute right-5 top-5 p-2 text-white/80 hover:text-white"
          >
            <Icon name="close" className="h-7 w-7" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Önceki"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                className="absolute left-3 p-3 text-white/70 hover:text-white lg:left-8"
              >
                <Icon name="chevron-left" className="h-9 w-9" />
              </button>
              <button
                type="button"
                aria-label="Sonraki"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                className="absolute right-3 p-3 text-white/70 hover:text-white lg:right-8"
              >
                <Icon name="chevron-right" className="h-9 w-9" />
              </button>
            </>
          ) : null}
          <figure className="relative max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] w-full">
              <Image src={current.url} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="mt-4 text-center text-body-sm text-white/70">
              {current.alt}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
