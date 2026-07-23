import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminCard, PageHeader } from "@/components/admin/AdminUI";
import { ProjectForm, type ProjectFormValues } from "@/components/admin/ProjectForm";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Date → "YYYY-MM-DD" for <input type="date">. */
function toDateInput(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } }).catch(() => null);
  if (!project) notFound();

  const values: ProjectFormValues = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    slogan: project.slogan,
    status: project.status,
    publishStatus: project.publishStatus,
    type: project.type,
    location: project.location,
    mapsUrl: project.mapsUrl,
    shortDescription: project.shortDescription,
    description: project.description,
    coverImage: project.coverImage,
    videoUrl: project.videoUrl,
    gallery: parseJson<string[]>(project.gallery, []),
    progressOverall: project.progressOverall,
    progressItems: parseJson<Array<{ label: string; value: number }>>(project.progressItems, []),
    features: parseJson<string[]>(project.features, []),
    technicalDetails: parseJson<Array<{ label: string; value: string }>>(
      project.technicalDetails,
      [],
    ),
    documents: parseJson<Array<{ label: string; url: string }>>(project.documents, []),
    startDate: toDateInput(project.startDate),
    deliveryDate: toDateInput(project.deliveryDate),
    isFeatured: project.isFeatured,
    sortOrder: project.sortOrder,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    ogImage: project.ogImage,
    canonicalUrl: project.canonicalUrl,
    robots: project.robots,
  };

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-2 text-body-sm text-slate">
        <Link href="/admin/projects" className="hover:text-forest-emerald">
          Projeler
        </Link>
        <Icon name="chevron-right" className="h-4 w-4" />
        <span className="font-medium text-charcoal">Proje Düzenle</span>
      </nav>

      <PageHeader
        title={project.title}
        description="Proje bilgilerini düzenleyin"
        action={
          <Link
            href={`/projeler/${project.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-warm-border bg-white px-4 py-2 text-body-sm font-semibold text-charcoal transition-colors hover:border-forest-emerald"
          >
            <Icon name="external-link" className="h-4 w-4" />
            Önizle
          </Link>
        }
      />

      <AdminCard>
        <ProjectForm project={values} />
      </AdminCard>
    </div>
  );
}
