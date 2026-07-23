import Link from "next/link";

import { deleteProjectAction, toggleProjectFeaturedAction } from "@/app/admin/_actions/content";
import {
  AdminButton,
  AdminCard,
  AdminTable,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";
import { CONTENT_STATUS_LABELS, PROJECT_STATUS_LABELS } from "@/lib/navigation";
import { formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function loadProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        type: true,
        location: true,
        status: true,
        publishStatus: true,
        isFeatured: true,
        updatedAt: true,
      },
    });
    return { projects, failed: false };
  } catch (error) {
    console.error("[admin] projects list failed:", error);
    return { projects: [], failed: true };
  }
}

export default async function AdminProjectsPage() {
  const { projects, failed } = await loadProjects();

  const stats = {
    total: projects.length,
    ongoing: projects.filter((p) => p.status === "ONGOING").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    upcoming: projects.filter((p) => p.status === "UPCOMING").length,
    drafts: projects.filter((p) => p.publishStatus !== "PUBLISHED").length,
  };

  return (
    <div>
      <PageHeader
        title="Projeler"
        description="Proje portföyünü yönetin"
        action={
          <AdminButton href="/admin/projects/new">
            <Icon name="plus" className="h-4 w-4" />
            Yeni Proje
          </AdminButton>
        }
      />

      {failed ? (
        <EmptyState
          icon="alert-triangle"
          title="Projeler yüklenemedi"
          description="Veritabanına bağlanılamadı. Bağlantıyı ve seed verilerini kontrol edin."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Toplam Proje" value={stats.total} icon="building" tone="navy" />
            <StatCard label="Devam Eden" value={stats.ongoing} icon="layers" tone="cyan" />
            <StatCard label="Tamamlanan" value={stats.completed} icon="check-circle" tone="green" />
            <StatCard label="Yakında" value={stats.upcoming} icon="clock" tone="gold" />
            <StatCard label="Taslak" value={stats.drafts} icon="file-text" tone="navy" />
          </div>

          <AdminCard padded={false}>
            {projects.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon="building"
                  title="Henüz proje yok"
                  description="İlk projenizi ekleyerek portföyünüzü oluşturmaya başlayın."
                  action={<AdminButton href="/admin/projects/new">Yeni Proje Ekle</AdminButton>}
                />
              </div>
            ) : (
              <AdminTable headers={["Proje Adı", "Durum", "Yayın", "Öne Çıkan", "Güncelleme", "İşlem"]}>
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-admin-bg">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-semibold text-charcoal hover:text-forest-emerald"
                      >
                        {project.title}
                      </Link>
                      <p className="text-[12px] text-slate">
                        {[project.type, project.location].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={project.status}
                        label={PROJECT_STATUS_LABELS[project.status] ?? project.status}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={project.publishStatus}
                        label={CONTENT_STATUS_LABELS[project.publishStatus] ?? project.publishStatus}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <form action={toggleProjectFeaturedAction}>
                        <input type="hidden" name="id" value={project.id} />
                        <button
                          type="submit"
                          aria-label={
                            project.isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"
                          }
                          aria-pressed={project.isFeatured}
                          className="inline-flex text-slate transition-colors hover:text-champagne-gold"
                        >
                          <Icon
                            name="star"
                            filled={project.isFeatured}
                            className={
                              project.isFeatured
                                ? "h-5 w-5 text-champagne-gold"
                                : "h-5 w-5"
                            }
                          />
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {formatDateShortTR(project.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="inline-flex items-center gap-1.5 border border-warm-border bg-white px-3 py-1.5 text-[13px] font-semibold text-charcoal transition-colors hover:border-forest-emerald"
                        >
                          <Icon name="edit" className="h-3.5 w-3.5" />
                          Düzenle
                        </Link>
                        <DeleteButton id={project.id} action={deleteProjectAction} />
                      </div>
                    </td>
                  </tr>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        </>
      )}
    </div>
  );
}
