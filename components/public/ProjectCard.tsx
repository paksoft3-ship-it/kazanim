"use client";

import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/public/Icon";
import { PROJECT_STATUS_LABELS } from "@/lib/navigation";
import { trackProjectCardClick } from "@/lib/tracking";
import { cn } from "@/lib/utils";

export type ProjectCardData = {
  id: string;
  title: string;
  slug: string;
  status: string;
  type: string | null;
  location: string | null;
  shortDescription: string | null;
  coverImage: string | null;
  progressOverall: number;
  deliveryDate?: Date | null;
};

const STATUS_STYLES: Record<string, string> = {
  ONGOING: "bg-forest-emerald text-white border-forest-emerald",
  COMPLETED: "bg-white/95 text-midnight-navy border-warm-border",
  UPCOMING: "bg-champagne-gold text-midnight-navy border-champagne-gold",
};

export function ProjectCard({
  project,
  priority = false,
}: {
  project: ProjectCardData;
  priority?: boolean;
}) {
  const href = `/projeler/${project.slug}`;
  const statusLabel = PROJECT_STATUS_LABELS[project.status] ?? project.status;

  return (
    <article className="group relative overflow-hidden border border-warm-border/60 bg-surface-container-low transition-colors hover:border-champagne-gold/50">
      <Link
        href={href}
        onClick={() =>
          trackProjectCardClick({
            project_id: project.id,
            project_slug: project.slug,
            project_name: project.title,
            project_status: project.status,
            project_type: project.type ?? undefined,
          })
        }
        className="block"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={project.coverImage || "/images/projects/proje-placeholder.svg"}
            alt={`${project.title} projesi görseli`}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <span
            className={cn(
              "absolute left-4 top-4 border px-4 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur",
              STATUS_STYLES[project.status] ?? STATUS_STYLES.COMPLETED,
            )}
          >
            {statusLabel}
          </span>

          {project.status === "ONGOING" && project.progressOverall > 0 ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight-navy/90 to-transparent p-4 pt-10">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/90">
                <span>İnşaat İlerlemesi</span>
                <span className="text-soft-gold">%{project.progressOverall}</span>
              </div>
              <div
                className="h-1 w-full bg-white/20"
                role="progressbar"
                aria-valuenow={project.progressOverall}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${project.title} inşaat ilerlemesi`}
              >
                <div
                  className="h-full bg-champagne-gold transition-all"
                  style={{ width: `${project.progressOverall}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-7">
          {project.location ? (
            <p className="mb-2 flex items-center gap-1.5 text-body-sm text-slate">
              <Icon name="map-pin" className="h-4 w-4 text-champagne-gold" />
              {project.location}
            </p>
          ) : null}

          <h3 className="mb-2 font-serif text-2xl text-midnight-navy transition-colors group-hover:text-forest-emerald">
            {project.title}
          </h3>

          {project.shortDescription ? (
            <p className="mb-6 line-clamp-2 text-body-sm leading-relaxed text-slate">
              {project.shortDescription}
            </p>
          ) : null}

          <div className="flex items-center justify-between border-t border-warm-border/60 pt-5">
            <span className="font-label-caps uppercase tracking-[0.08em] text-midnight-navy">
              {project.type || "Proje"}
            </span>
            <span className="flex items-center gap-2 font-button-text uppercase tracking-[0.1em] text-forest-emerald transition-all group-hover:gap-3 group-hover:text-champagne-gold">
              Detayları İncele
              <Icon name="arrow-right" className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
