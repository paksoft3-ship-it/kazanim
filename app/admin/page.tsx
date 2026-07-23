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
import {
  LEAD_STATUS_LABELS,
  LEAD_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
} from "@/lib/navigation";
import { formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Dashboard = {
  totalProjects: number;
  ongoing: number;
  completed: number;
  newLeads: number;
  applications: number;
  publishedNews: number;
  recentLeads: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    createdAt: Date;
  }>;
  recentProjects: Array<{
    id: string;
    title: string;
    status: string;
    updatedAt: Date;
  }>;
  failed: boolean;
};

async function loadDashboard(): Promise<Dashboard> {
  try {
    const [
      totalProjects,
      ongoing,
      completed,
      newLeads,
      applications,
      publishedNews,
      recentLeads,
      recentProjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "ONGOING" } }),
      prisma.project.count({ where: { status: "COMPLETED" } }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.jobApplication.count(),
      prisma.newsArticle.count({ where: { status: "PUBLISHED" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, type: true, status: true, createdAt: true },
      }),
      prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, status: true, updatedAt: true },
      }),
    ]);

    return {
      totalProjects,
      ongoing,
      completed,
      newLeads,
      applications,
      publishedNews,
      recentLeads,
      recentProjects,
      failed: false,
    };
  } catch (error) {
    console.error("[admin] dashboard load failed:", error);
    return {
      totalProjects: 0,
      ongoing: 0,
      completed: 0,
      newLeads: 0,
      applications: 0,
      publishedNews: 0,
      recentLeads: [],
      recentProjects: [],
      failed: true,
    };
  }
}

async function isDemoContentSeeded(): Promise<boolean> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: "demoContentSeeded" },
    });
    return row?.value === "true";
  } catch {
    return false;
  }
}

export default async function AdminDashboardPage() {
  const [data, demoSeeded] = await Promise.all([loadDashboard(), isDemoContentSeeded()]);

  return (
    <div>
      <PageHeader
        title="Genel Bakış"
        description="Kazanım Gayrimenkul web sitesi yönetim paneli"
      />

      {demoSeeded ? (
        <div className="mb-6 flex items-start gap-3 border border-warning-orange/40 bg-warning-orange/10 p-4 text-body-sm text-charcoal">
          <Icon name="alert-triangle" className="mt-0.5 h-5 w-5 shrink-0 text-warning-orange" />
          <p>
            <strong>Demo içerik yüklü.</strong> Projeler, haberler, galeri ve pozisyonlar
            örnek kayıtlardır. Yayına almadan önce gerçek içerikle değiştirin veya
            yayından kaldırın; ardından Site Ayarları içindeki{" "}
            <code className="font-mono text-[12px]">demoContentSeeded</code> değerini{" "}
            <code className="font-mono text-[12px]">false</code> yapın.
          </p>
        </div>
      ) : null}

      {data.failed ? (
        <div className="mb-6">
          <EmptyState
            icon="alert-triangle"
            title="Veriler yüklenemedi"
            description="Veritabanına bağlanılamadı. Veritabanı bağlantısını ve seed verilerini kontrol edin."
          />
        </div>
      ) : null}

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <AdminButton href="/admin/projects/new">
          <Icon name="plus" className="h-4 w-4" />
          Yeni Proje Ekle
        </AdminButton>
        <AdminButton href="/admin/news/new" variant="secondary">
          <Icon name="plus" className="h-4 w-4" />
          Yeni Haber Ekle
        </AdminButton>
        <AdminButton href="/admin/forms" variant="secondary">
          <Icon name="inbox" className="h-4 w-4" />
          Form Talepleri
        </AdminButton>
        <AdminButton href="/admin/site-settings" variant="secondary">
          <Icon name="settings" className="h-4 w-4" />
          Site Ayarları
        </AdminButton>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Toplam Proje" value={data.totalProjects} icon="building" href="/admin/projects" tone="navy" />
        <StatCard label="Devam Eden" value={data.ongoing} icon="layers" href="/admin/projects" tone="cyan" />
        <StatCard label="Tamamlanan" value={data.completed} icon="check-circle" href="/admin/projects" tone="green" />
        <StatCard label="Yeni Form Talebi" value={data.newLeads} icon="inbox" href="/admin/forms" tone="gold" />
        <StatCard label="İş Başvurusu" value={data.applications} icon="briefcase" href="/admin/hr" tone="navy" />
        <StatCard label="Yayındaki Haber" value={data.publishedNews} icon="newspaper" href="/admin/news" tone="cyan" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <AdminCard
          title="Son Form Talepleri"
          padded={false}
          action={
            <Link
              href="/admin/forms"
              className="text-body-sm font-semibold text-forest-emerald hover:text-forest-emerald"
            >
              Tümünü Gör
            </Link>
          }
        >
          {data.recentLeads.length === 0 ? (
            <div className="p-6">
              <EmptyState icon="inbox" title="Henüz form talebi yok" />
            </div>
          ) : (
            <AdminTable headers={["Ad Soyad", "Tür", "Tarih", "Durum"]}>
              {data.recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-admin-bg">
                  <td className="px-4 py-3 font-medium text-charcoal">{lead.name}</td>
                  <td className="px-4 py-3 text-slate">
                    {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
                  </td>
                  <td className="px-4 py-3 text-slate">{formatDateShortTR(lead.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={lead.status}
                      label={LEAD_STATUS_LABELS[lead.status] ?? lead.status}
                    />
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>

        {/* Recent projects */}
        <AdminCard
          title="Son Güncellenen Projeler"
          padded={false}
          action={
            <Link
              href="/admin/projects"
              className="text-body-sm font-semibold text-forest-emerald hover:text-forest-emerald"
            >
              Tümünü Gör
            </Link>
          }
        >
          {data.recentProjects.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="building"
                title="Henüz proje yok"
                action={<AdminButton href="/admin/projects/new">Yeni Proje Ekle</AdminButton>}
              />
            </div>
          ) : (
            <AdminTable headers={["Proje", "Durum", "Güncelleme", ""]}>
              {data.recentProjects.map((project) => (
                <tr key={project.id} className="hover:bg-admin-bg">
                  <td className="px-4 py-3 font-medium text-charcoal">{project.title}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={project.status}
                      label={PROJECT_STATUS_LABELS[project.status] ?? project.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {formatDateShortTR(project.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      aria-label={`${project.title} düzenle`}
                      className="inline-flex text-slate hover:text-forest-emerald"
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
