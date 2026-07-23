import Link from "next/link";

import {
  AdminCard,
  AdminTable,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { LeadDetailPanel, type LeadDetail } from "@/components/admin/LeadDetailPanel";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";
import { LEAD_STATUS_LABELS, LEAD_TYPE_LABELS } from "@/lib/navigation";
import { cn, formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const LEAD_STATUSES = ["NEW", "READ", "IN_PROGRESS", "DONE", "ARCHIVED"] as const;
const LEAD_TYPES = ["CONTACT", "PROJECT_INFO", "APPOINTMENT", "PHONE", "WHATSAPP", "CAREER", "OTHER"] as const;

type SearchParams = { [key: string]: string | string[] | undefined };

function buildQuery(base: SearchParams, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...base, ...patch })) {
    if (typeof v === "string" && v) params.set(k, v);
  }
  const q = params.toString();
  return q ? `?${q}` : "";
}

export default async function AdminFormsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const typeFilter = typeof sp.type === "string" ? sp.type : "";
  const statusFilter = typeof sp.status === "string" ? sp.status : "";
  const selectedId = typeof sp.lead === "string" ? sp.lead : "";

  const where = {
    ...(LEAD_TYPES.includes(typeFilter as (typeof LEAD_TYPES)[number]) ? { type: typeFilter as never } : {}),
    ...(LEAD_STATUSES.includes(statusFilter as (typeof LEAD_STATUSES)[number]) ? { status: statusFilter as never } : {}),
  };

  let leads: Array<{
    id: string;
    type: string;
    name: string;
    phone: string;
    email: string | null;
    subject: string | null;
    status: string;
    createdAt: Date;
    projectTitle: string | null;
    sourcePage: string | null;
  }> = [];
  const counts: Record<string, number> = { total: 0, NEW: 0, IN_PROGRESS: 0, DONE: 0 };
  let selected: LeadDetail | null = null;
  let loadError = false;

  try {
    const [rows, grouped, total, selectedRow] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { project: { select: { title: true } } },
      }),
      prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.lead.count(),
      selectedId
        ? prisma.lead.findUnique({
            where: { id: selectedId },
            include: { project: { select: { title: true } } },
          })
        : Promise.resolve(null),
    ]);

    leads = rows.map((l) => ({
      id: l.id,
      type: l.type,
      name: l.name,
      phone: l.phone,
      email: l.email,
      subject: l.subject,
      status: l.status,
      createdAt: l.createdAt,
      projectTitle: l.project?.title ?? null,
      sourcePage: l.sourcePage,
    }));

    counts.total = total;
    for (const g of grouped) counts[g.status] = g._count._all;

    if (selectedRow) {
      selected = {
        id: selectedRow.id,
        type: selectedRow.type,
        name: selectedRow.name,
        phone: selectedRow.phone,
        email: selectedRow.email,
        subject: selectedRow.subject,
        message: selectedRow.message,
        sourcePage: selectedRow.sourcePage,
        status: selectedRow.status,
        internalNotes: selectedRow.internalNotes,
        createdAt: formatDateShortTR(selectedRow.createdAt),
        projectTitle: selectedRow.project?.title ?? null,
        utmSource: selectedRow.utmSource,
        utmMedium: selectedRow.utmMedium,
        utmCampaign: selectedRow.utmCampaign,
        utmTerm: selectedRow.utmTerm,
        utmContent: selectedRow.utmContent,
        gclid: selectedRow.gclid,
        fbclid: selectedRow.fbclid,
      };
    }
  } catch (error) {
    console.error("[admin/forms] load failed:", error);
    loadError = true;
  }

  return (
    <div>
      <PageHeader
        title="Form Talepleri"
        description="Web sitesinden gelen iletişim ve proje bilgi taleplerini yönetin."
      />

      <div
        role="note"
        className="mb-6 flex items-start gap-3 border border-champagne-gold/40 bg-soft-gold/20 p-4 text-body-sm text-charcoal"
      >
        <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-champagne-gold" />
        <p>
          <strong>KVKK Uyarısı:</strong> Bu ekrandaki ad, telefon, e-posta ve mesaj
          bilgileri kişisel veridir. Yalnızca talebin değerlendirilmesi amacıyla,
          yetkili personel tarafından ve gizlilik ilkelerine uygun şekilde işleyin.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Toplam Talep" value={counts.total} icon="inbox" tone="navy" />
        <StatCard label="Yeni" value={counts.NEW ?? 0} icon="star" tone="cyan" />
        <StatCard label="İşlemde" value={counts.IN_PROGRESS ?? 0} icon="clock" tone="gold" />
        <StatCard label="Tamamlandı" value={counts.DONE ?? 0} icon="check-circle" tone="green" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <AdminCard
          title="Talep Listesi"
          padded={false}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label="Tür"
                param="type"
                value={typeFilter}
                sp={sp}
                options={LEAD_TYPES.map((t) => [t, LEAD_TYPE_LABELS[t]])}
              />
              <FilterSelect
                label="Durum"
                param="status"
                value={statusFilter}
                sp={sp}
                options={LEAD_STATUSES.map((s) => [s, LEAD_STATUS_LABELS[s]])}
              />
            </div>
          }
        >
          {loadError ? (
            <div className="p-6">
              <EmptyState icon="alert-triangle" title="Veriler yüklenemedi" description="Veritabanı bağlantısını kontrol edin." />
            </div>
          ) : leads.length === 0 ? (
            <div className="p-6">
              <EmptyState icon="inbox" title="Talep bulunamadı" description="Seçilen filtrelere uygun form talebi yok." />
            </div>
          ) : (
            <AdminTable headers={["Tarih", "Ad Soyad", "Tür", "Durum", ""]}>
              {leads.map((l) => (
                <tr key={l.id} className={cn(l.id === selectedId && "bg-forest-emerald/5")}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate">{formatDateShortTR(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{l.name}</p>
                    <p className="text-[12px] text-slate">{l.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate">{LEAD_TYPE_LABELS[l.type] ?? l.type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} label={LEAD_STATUS_LABELS[l.status] ?? l.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={buildQuery(sp, { lead: l.id })}
                      scroll={false}
                      className="inline-flex items-center gap-1 text-body-sm font-semibold text-forest-emerald hover:underline"
                    >
                      Detay
                      <Icon name="chevron-right" className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>

        <AdminCard title="Talep Detayı">
          {selected ? (
            <LeadDetailPanel lead={selected} />
          ) : (
            <EmptyState
              icon="inbox"
              title="Talep seçilmedi"
              description="Detayları görüntülemek için listeden bir talep seçin."
            />
          )}
        </AdminCard>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  param,
  value,
  sp,
  options,
}: {
  label: string;
  param: string;
  value: string;
  sp: SearchParams;
  options: Array<[string, string]>;
}) {
  // Rendered as a list of links to keep the page a pure Server Component.
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[12px] font-semibold uppercase tracking-wider text-slate">{label}:</span>
      <div className="flex flex-wrap gap-1">
        <Link
          href={buildQuery(sp, { [param]: undefined, lead: undefined })}
          className={cn(
            "border px-2 py-1 text-[12px] font-medium transition-colors",
            !value
              ? "border-forest-emerald bg-forest-emerald text-white"
              : "border-warm-border bg-white text-slate hover:border-forest-emerald",
          )}
        >
          Tümü
        </Link>
        {options.map(([val, lbl]) => (
          <Link
            key={val}
            href={buildQuery(sp, { [param]: val, lead: undefined })}
            className={cn(
              "border px-2 py-1 text-[12px] font-medium transition-colors",
              value === val
                ? "border-forest-emerald bg-forest-emerald text-white"
                : "border-warm-border bg-white text-slate hover:border-forest-emerald",
            )}
          >
            {lbl}
          </Link>
        ))}
      </div>
    </div>
  );
}
