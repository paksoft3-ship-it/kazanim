import Link from "next/link";

import {
  AdminButton,
  AdminCard,
  AdminTable,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";
import { CONTENT_STATUS_LABELS } from "@/lib/navigation";
import { formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function loadPages() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        showInMenu: true,
        showInFooter: true,
        updatedAt: true,
      },
    });
    return { pages, failed: false };
  } catch (error) {
    console.error("[admin] pages list failed:", error);
    return { pages: [], failed: true };
  }
}

export default async function AdminPagesPage() {
  const { pages, failed } = await loadPages();

  const stats = {
    total: pages.length,
    published: pages.filter((p) => p.status === "PUBLISHED").length,
    drafts: pages.filter((p) => p.status === "DRAFT").length,
  };

  return (
    <div>
      <PageHeader
        title="Sayfa ve İçerik Yönetimi"
        description="Statik sayfaların içeriklerini ve SEO ayarlarını düzenleyin"
        action={
          <AdminButton href="/admin/pages/new">
            <Icon name="plus" className="h-4 w-4" />
            Yeni Sayfa
          </AdminButton>
        }
      />

      {failed ? (
        <EmptyState
          icon="alert-triangle"
          title="Sayfalar yüklenemedi"
          description="Veritabanına bağlanılamadı. Bağlantıyı ve seed verilerini kontrol edin."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Toplam Sayfa" value={stats.total} icon="file-text" tone="navy" />
            <StatCard label="Yayında" value={stats.published} icon="check-circle" tone="green" />
            <StatCard label="Taslak" value={stats.drafts} icon="edit" tone="gold" />
          </div>

          <AdminCard padded={false}>
            {pages.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon="file-text"
                  title="Henüz sayfa yok"
                  description="Seed verilerini çalıştırın ya da yeni bir sayfa oluşturun."
                  action={<AdminButton href="/admin/pages/new">Yeni Sayfa Ekle</AdminButton>}
                />
              </div>
            ) : (
              <AdminTable headers={["Sayfa Başlığı", "Slug", "Durum", "Menü", "Güncelleme", "Eylem"]}>
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-admin-bg">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="font-semibold text-charcoal hover:text-forest-emerald"
                      >
                        {page.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-slate">/{page.slug}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={page.status}
                        label={CONTENT_STATUS_LABELS[page.status] ?? page.status}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {page.showInMenu ? (
                        <Icon name="check" className="h-4 w-4 text-success-green" label="Menüde" />
                      ) : (
                        <span className="text-slate/50">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate">{formatDateShortTR(page.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="inline-flex items-center gap-1.5 border border-warm-border bg-white px-3 py-1.5 text-[13px] font-semibold text-charcoal transition-colors hover:border-forest-emerald"
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" />
                        Düzenle
                      </Link>
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
