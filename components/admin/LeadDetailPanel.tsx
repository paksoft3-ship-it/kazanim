"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { deleteLeadAction, updateLeadAction } from "@/app/admin/_actions/operations";
import { FormStatusAlert, StatusBadge } from "@/components/admin/AdminUI";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Icon } from "@/components/public/Icon";
import { LEAD_STATUS_LABELS, LEAD_TYPE_LABELS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const IDLE: ActionState = { status: "idle", message: "" };

export type LeadDetail = {
  id: string;
  type: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string | null;
  sourcePage: string | null;
  status: string;
  internalNotes: string | null;
  createdAt: string;
  projectTitle: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  fbclid: string | null;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 border border-forest-emerald bg-forest-emerald px-4 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-midnight-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon name={pending ? "refresh" : "save"} className={cn("h-4 w-4", pending && "animate-spin")} />
      {pending ? "Kaydediliyor…" : "Güncelle"}
    </button>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-warm-border/60 py-2 last:border-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate">{label}</dt>
      <dd className="break-words text-body-sm text-charcoal">{value}</dd>
    </div>
  );
}

export function LeadDetailPanel({ lead }: { lead: LeadDetail }) {
  const [state, formAction] = useActionState(updateLeadAction, IDLE);

  const hasAttribution =
    lead.utmSource || lead.utmMedium || lead.utmCampaign || lead.utmTerm ||
    lead.utmContent || lead.gclid || lead.fbclid;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <StatusBadge status={lead.status} label={LEAD_STATUS_LABELS[lead.status] ?? lead.status} />
            <span className="text-[12px] text-slate">
              {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
            </span>
          </div>
          <h3 className="text-lg font-bold text-charcoal">{lead.name}</h3>
          <p className="text-[12px] text-slate">{lead.createdAt}</p>
        </div>
      </div>

      <dl className="text-body-sm">
        <Row
          label="Telefon"
          value={
            <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="text-forest-emerald hover:underline">
              {lead.phone}
            </a>
          }
        />
        <Row
          label="E-posta"
          value={
            lead.email ? (
              <a href={`mailto:${lead.email}`} className="text-forest-emerald hover:underline">
                {lead.email}
              </a>
            ) : null
          }
        />
        <Row label="Konu" value={lead.subject} />
        <Row label="İlgili Proje" value={lead.projectTitle} />
        <Row label="Mesaj" value={lead.message ? <span className="whitespace-pre-wrap">{lead.message}</span> : null} />
        <Row label="Kaynak Sayfa" value={lead.sourcePage} />
      </dl>

      {hasAttribution ? (
        <div className="border border-warm-border bg-admin-bg p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate">
            Kampanya Bilgileri
          </p>
          <dl className="grid grid-cols-2 gap-x-4 text-[12px]">
            {[
              ["utm_source", lead.utmSource],
              ["utm_medium", lead.utmMedium],
              ["utm_campaign", lead.utmCampaign],
              ["utm_term", lead.utmTerm],
              ["utm_content", lead.utmContent],
              ["gclid", lead.gclid],
              ["fbclid", lead.fbclid],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k as string} className="flex flex-col py-1">
                  <dt className="text-slate">{k}</dt>
                  <dd className="break-all font-medium text-charcoal">{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      ) : null}

      <form action={formAction} className="space-y-4 border-t border-warm-border pt-5">
        <input type="hidden" name="id" value={lead.id} />

        {state.status !== "idle" ? (
          <FormStatusAlert
            status={state.status === "success" ? "success" : "error"}
            message={state.message}
          />
        ) : null}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-status" className="text-[13px] font-semibold text-charcoal">
            Durum
          </label>
          <select
            id="lead-status"
            name="status"
            defaultValue={lead.status}
            className="border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
          >
            {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lead-notes" className="text-[13px] font-semibold text-charcoal">
            İç Notlar
          </label>
          <textarea
            id="lead-notes"
            name="internalNotes"
            rows={4}
            defaultValue={lead.internalNotes ?? ""}
            className="border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <ConfirmDelete action={deleteLeadAction} id={lead.id} label="Talebi Sil" />
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
