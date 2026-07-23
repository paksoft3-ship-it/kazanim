import Link from "next/link";

import { deleteNewsAction } from "@/app/admin/_actions/content";
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
import { CONTENT_STATUS_LABELS } from "@/lib/navigation";
import { formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function loadNews() {
  try {
    const news = await prisma.newsArticle.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        isFeatured: true,
        publishedAt: true,
        relatedProject: { select: { title: true } },
      },
    });
    return { news, failed: false };
  } catch (error) {
    console.error("[admin] news list failed:", error);
    return { news: [], failed: true };
  }
}

export default async function AdminNewsPage() {
  const { news, failed } = await loadNews();

  const stats = {
    total: news.length,
    published: news.filter((n) => n.status === "PUBLISHED").length,
    drafts: news.filter((n) => n.status === "DRAFT").length,
  };

  return (
    <div>
      <PageHeader
        title="Haberler ve Duyurular"
        description="Haber ve duyuru içeriklerini yönetin"
        action={
          <AdminButton href="/admin/news/new">
            <Icon name="plus" className="h-4 w-4" />
            Yeni Haber
          </AdminButton>
        }
      />

      {failed ? (
        <EmptyState
          icon="alert-triangle"
          title="Haberler yüklenemedi"
          description="Veritabanına bağlanılamadı. Bağlantıyı ve seed verilerini kontrol edin."
        />
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Toplam İçerik" value={stats.total} icon="newspaper" tone="navy" />
            <StatCard label="Yayında" value={stats.published} icon="check-circle" tone="green" />
            <StatCard label="Taslak" value={stats.drafts} icon="file-text" tone="gold" />
          </div>

          <AdminCard padded={false}>
            {news.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon="newspaper"
                  title="Henüz haber yok"
                  description="İlk haberinizi ekleyerek duyurularınızı yayınlamaya başlayın."
                  action={<AdminButton href="/admin/news/new">Yeni Haber Ekle</AdminButton>}
                />
              </div>
            ) : (
              <AdminTable headers={["Haber", "Kategori", "Bağlı Proje", "Durum", "Yayın Tarihi", "İşlem"]}>
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-admin-bg">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/news/${item.id}`}
                        className="inline-flex items-center gap-2 font-semibold text-charcoal hover:text-forest-emerald"
                      >
                        {item.isFeatured ? (
                          <Icon name="star" filled className="h-4 w-4 text-champagne-gold" />
                        ) : null}
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate">{item.category}</td>
                    <td className="px-4 py-3 text-slate">
                      {item.relatedProject?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={item.status}
                        label={CONTENT_STATUS_LABELS[item.status] ?? item.status}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate">
                      {item.publishedAt ? formatDateShortTR(item.publishedAt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/news/${item.id}`}
                          className="inline-flex items-center gap-1.5 border border-warm-border bg-white px-3 py-1.5 text-[13px] font-semibold text-charcoal transition-colors hover:border-forest-emerald"
                        >
                          <Icon name="edit" className="h-3.5 w-3.5" />
                          Düzenle
                        </Link>
                        <DeleteButton id={item.id} action={deleteNewsAction} />
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
