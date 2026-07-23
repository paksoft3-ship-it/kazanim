import { AdminCard, PageHeader, StatCard } from "@/components/admin/AdminUI";
import { MediaUploader, type MediaItem } from "@/components/admin/MediaUploader";
import { prisma } from "@/lib/db";
import { formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  let media: MediaItem[] = [];
  let projects: Array<{ id: string; title: string }> = [];
  let missingAlt = 0;

  try {
    const [rows, projectRows] = await Promise.all([
      prisma.mediaAsset.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: { linkedProject: { select: { title: true } } },
      }),
      prisma.project.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true },
      }),
    ]);

    media = rows.map((m) => ({
      id: m.id,
      url: m.url,
      fileName: m.fileName,
      title: m.title,
      altText: m.altText,
      description: m.description,
      category: m.category,
      mimeType: m.mimeType,
      sortOrder: m.sortOrder,
      linkedProjectId: m.linkedProjectId,
      linkedProjectTitle: m.linkedProject?.title ?? null,
      createdAt: formatDateShortTR(m.createdAt),
    }));
    projects = projectRows;
    missingAlt = rows.filter((m) => !m.altText).length;
  } catch (error) {
    console.error("[admin/gallery] load failed:", error);
  }

  const linked = media.filter((m) => m.linkedProjectId).length;

  return (
    <div>
      <PageHeader
        title="Galeri ve Medya"
        description="Görselleri yükleyin, alt metin ve kategori bilgilerini düzenleyin."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Toplam Dosya" value={media.length} icon="image" tone="navy" />
        <StatCard label="Projeye Bağlı" value={linked} icon="link" tone="cyan" />
        <StatCard label="Kategori" value={new Set(media.map((m) => m.category)).size} icon="layers" tone="gold" />
        <StatCard label="Eksik Alt Metin" value={missingAlt} icon="alert-triangle" tone={missingAlt > 0 ? "gold" : "green"} />
      </div>

      <AdminCard>
        <MediaUploader media={media} projects={projects} />
      </AdminCard>
    </div>
  );
}
