import Link from "next/link";

import { deleteJobPositionAction } from "@/app/admin/_actions/content";
import {
  AdminCard,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { ApplicationCard, type ApplicationItem } from "@/components/admin/ApplicationCard";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { PositionForm, type EditablePosition } from "@/components/admin/PositionForm";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";
import { APPLICATION_STATUS_LABELS, CONTENT_STATUS_LABELS } from "@/lib/navigation";
import { cn, formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function AdminHrPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const tab = sp.tab === "positions" ? "positions" : "applications";
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  let applications: ApplicationItem[] = [];
  let positions: EditablePosition[] = [];
  let editing: EditablePosition | undefined;
  let newCount = 0;

  try {
    const [appRows, posRows] = await Promise.all([
      prisma.jobApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { position: { select: { title: true } } },
      }),
      prisma.jobPosition.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    ]);

    applications = appRows.map((a) => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      email: a.email,
      message: a.message,
      cvUrl: a.cvUrl,
      status: a.status,
      internalNotes: a.internalNotes,
      createdAt: formatDateShortTR(a.createdAt),
      positionTitle: a.position?.title ?? null,
    }));
    newCount = appRows.filter((a) => a.status === "NEW").length;

    positions = posRows.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      department: p.department,
      location: p.location,
      type: p.type,
      description: p.description,
      requirements: p.requirements,
      responsibilities: p.responsibilities,
      status: p.status,
      sortOrder: p.sortOrder,
    }));
    editing = positions.find((p) => p.id === editId);
  } catch (error) {
    console.error("[admin/hr] load failed:", error);
  }

  const openPositions = positions.filter((p) => p.status === "PUBLISHED").length;

  return (
    <div>
      <PageHeader
        title="İnsan Kaynakları"
        description="İş başvurularını değerlendirin ve açık pozisyonları yönetin."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Toplam Başvuru" value={applications.length} icon="users" tone="navy" />
        <StatCard label="Yeni Başvuru" value={newCount} icon="star" tone="cyan" />
        <StatCard label="Açık Pozisyon" value={openPositions} icon="briefcase" tone="gold" />
        <StatCard label="Toplam Pozisyon" value={positions.length} icon="badge" tone="green" />
      </div>

      <div className="mb-6 flex gap-1 border-b border-warm-border">
        <TabLink href="/admin/hr" active={tab === "applications"} label="Başvurular" />
        <TabLink href="/admin/hr?tab=positions" active={tab === "positions"} label="Açık Pozisyonlar" />
      </div>

      {tab === "applications" ? (
        applications.length === 0 ? (
          <AdminCard>
            <EmptyState icon="users" title="Başvuru yok" description="Henüz iş başvurusu alınmadı." />
          </AdminCard>
        ) : (
          <div className="space-y-3">
            {applications.map((a) => (
              <ApplicationCard key={a.id} application={a} />
            ))}
          </div>
        )
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <AdminCard title="Pozisyonlar" padded={false}>
            {positions.length === 0 ? (
              <div className="p-6">
                <EmptyState icon="briefcase" title="Pozisyon yok" description="Sağdaki formu kullanarak ilk pozisyonu ekleyin." />
              </div>
            ) : (
              <ul className="divide-y divide-warm-border">
                {positions.map((p) => (
                  <li key={p.id} className={cn("flex items-center justify-between gap-4 px-5 py-4", p.id === editId && "bg-forest-emerald/5")}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-charcoal">{p.title}</p>
                        <StatusBadge status={p.status} label={CONTENT_STATUS_LABELS[p.status] ?? p.status} />
                      </div>
                      <p className="truncate text-[12px] text-slate">
                        {[p.department, p.location, p.type].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Link
                        href={`/admin/hr?tab=positions&edit=${p.id}`}
                        className="inline-flex items-center gap-1 text-body-sm font-semibold text-forest-emerald hover:underline"
                      >
                        <Icon name="edit" className="h-4 w-4" />
                        Düzenle
                      </Link>
                      <ConfirmDelete action={deleteJobPositionAction} id={p.id} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          <AdminCard title={editing ? "Pozisyonu Düzenle" : "Yeni Pozisyon"}>
            <PositionForm position={editing} />
          </AdminCard>
        </div>
      )}
    </div>
  );
}

function TabLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 px-4 py-2.5 text-body-sm font-semibold transition-colors",
        active
          ? "border-forest-emerald text-forest-emerald"
          : "border-transparent text-slate hover:text-charcoal",
      )}
    >
      {label}
    </Link>
  );
}
