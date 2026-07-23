import Link from "next/link";

import { AdminCard, AdminTable, EmptyState, PageHeader } from "@/components/admin/AdminUI";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Icon } from "@/components/public/Icon";
import { siteUrl } from "@/lib/seo";
import { getSettings, SETTING_GROUPS, SETTING_LABELS } from "@/lib/settings";
import { cn, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const seoGroup = SETTING_GROUPS.find((g) => g.id === "seo")!;

function FillBadge({ filled }: { filled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider",
        filled
          ? "border-success-green/30 bg-success-green/10 text-success-green"
          : "border-warning-orange/40 bg-warning-orange/10 text-warning-orange",
      )}
    >
      <Icon name={filled ? "check" : "alert-triangle"} className="h-3 w-3" />
      {filled ? "Dolu" : "Eksik"}
    </span>
  );
}

type OverviewRow = {
  id: string;
  title: string;
  editHref: string;
  hasTitle: boolean;
  hasDescription: boolean;
};

function OverviewTable({ rows }: { rows: OverviewRow[] }) {
  if (rows.length === 0) {
    return <EmptyState icon="search" title="Kayıt yok" description="Bu içerik türünde henüz kayıt bulunmuyor." />;
  }
  return (
    <AdminTable headers={["Başlık", "SEO Başlığı", "Meta Açıklama", ""]}>
      {rows.map((r) => (
        <tr key={r.id}>
          <td className="px-4 py-3 font-medium text-charcoal">{r.title}</td>
          <td className="px-4 py-3"><FillBadge filled={r.hasTitle} /></td>
          <td className="px-4 py-3"><FillBadge filled={r.hasDescription} /></td>
          <td className="px-4 py-3 text-right">
            <Link href={r.editHref} className="inline-flex items-center gap-1 text-body-sm font-semibold text-forest-emerald hover:underline">
              <Icon name="edit" className="h-4 w-4" />
              Düzenle
            </Link>
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}

export default async function AdminSeoPage() {
  let settings: Record<string, string> = {};
  let pages: OverviewRow[] = [];
  let projects: OverviewRow[] = [];
  let news: OverviewRow[] = [];

  try {
    settings = await getSettings();
  } catch (error) {
    console.error("[admin/seo] settings load failed:", error);
  }

  try {
    const { prisma } = await import("@/lib/db");
    const [pageRows, projectRows, newsRows] = await Promise.all([
      prisma.page.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true, slug: true, seoTitle: true, seoDescription: true } }),
      prisma.project.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, seoTitle: true, seoDescription: true } }),
      prisma.newsArticle.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, title: true, seoTitle: true, seoDescription: true } }),
    ]);

    pages = pageRows.map((p) => ({
      id: p.id,
      title: p.title,
      editHref: "/admin/pages",
      hasTitle: Boolean(p.seoTitle),
      hasDescription: Boolean(p.seoDescription),
    }));
    projects = projectRows.map((p) => ({
      id: p.id,
      title: p.title,
      editHref: `/admin/projects/${p.id}`,
      hasTitle: Boolean(p.seoTitle),
      hasDescription: Boolean(p.seoDescription),
    }));
    news = newsRows.map((n) => ({
      id: n.id,
      title: n.title,
      editHref: "/admin/news",
      hasTitle: Boolean(n.seoTitle),
      hasDescription: Boolean(n.seoDescription),
    }));
  } catch (error) {
    console.error("[admin/seo] overview load failed:", error);
  }

  const base = siteUrl();
  const previewTitle = settings.defaultSeoTitle || "Kazanım Gayrimenkul";
  const previewDescription = settings.defaultSeoDescription || "";

  return (
    <div>
      <PageHeader
        title="SEO ve Analitik Ayarları"
        description="Varsayılan meta bilgilerini, analitik kimliklerini ve içerik SEO durumunu yönetin."
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <AdminCard title="Google Arama Önizlemesi" description="Varsayılan başlık ve açıklamanın arama sonucunda görünümü.">
          <div className="border border-warm-border bg-white p-4">
            <p className="truncate text-[13px] text-[#1a0dab]">{previewTitle}</p>
            <p className="mt-0.5 truncate text-[12px] text-[#006621]">{base.replace(/^https?:\/\//, "")}</p>
            <p className="mt-1 text-[13px] leading-snug text-[#4d5156]">
              {previewDescription ? truncate(previewDescription, 160) : "Meta açıklaması tanımlanmamış."}
            </p>
          </div>
        </AdminCard>

        <AdminCard title="Teknik SEO" description="Sitemap ve robots dosyaları otomatik olarak üretilir.">
          <ul className="space-y-3">
            <li className="flex items-center justify-between gap-3 border border-warm-border bg-admin-bg px-4 py-3">
              <div className="flex items-center gap-3">
                <Icon name="globe" className="h-5 w-5 text-forest-emerald" />
                <span className="text-body-sm font-medium text-charcoal">Site Haritası (sitemap.xml)</span>
              </div>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-body-sm font-semibold text-forest-emerald hover:underline">
                Görüntüle
              </a>
            </li>
            <li className="flex items-center justify-between gap-3 border border-warm-border bg-admin-bg px-4 py-3">
              <div className="flex items-center gap-3">
                <Icon name="shield" className="h-5 w-5 text-forest-emerald" />
                <span className="text-body-sm font-medium text-charcoal">Robots (robots.txt)</span>
              </div>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-body-sm font-semibold text-forest-emerald hover:underline">
                Görüntüle
              </a>
            </li>
          </ul>
          <p className="mt-3 text-[12px] text-slate">
            /admin ve /api yolları arama motorlarından otomatik olarak engellenir.
          </p>
        </AdminCard>
      </div>

      <AdminCard title="Varsayılan SEO ve Analitik" className="mb-6">
        <SettingsForm groups={[seoGroup]} settings={settings} labels={SETTING_LABELS} />
      </AdminCard>

      <div className="grid gap-6">
        <AdminCard title="Sayfa SEO Durumu" padded={false}>
          <OverviewTable rows={pages} />
        </AdminCard>
        <AdminCard title="Proje SEO Durumu" padded={false}>
          <OverviewTable rows={projects} />
        </AdminCard>
        <AdminCard title="Haber SEO Durumu" padded={false}>
          <OverviewTable rows={news} />
        </AdminCard>
      </div>
    </div>
  );
}
