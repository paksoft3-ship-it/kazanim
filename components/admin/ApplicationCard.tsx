"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  deleteApplicationAction,
  updateApplicationAction,
} from "@/app/admin/_actions/operations";
import { FormStatusAlert, StatusBadge } from "@/components/admin/AdminUI";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Icon } from "@/components/public/Icon";
import { APPLICATION_STATUS_LABELS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const IDLE: ActionState = { status: "idle", message: "" };

export type ApplicationItem = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  cvUrl: string | null;
  status: string;
  internalNotes: string | null;
  createdAt: string;
  positionTitle: string | null;
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

export function ApplicationCard({ application }: { application: ApplicationItem }) {
  const [state, formAction] = useActionState(updateApplicationAction, IDLE);
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-warm-border bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <p className="truncate font-semibold text-charcoal">{application.name}</p>
          <p className="truncate text-[12px] text-slate">
            {application.positionTitle ?? "Genel Başvuru"} · {application.createdAt}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StatusBadge
            status={application.status}
            label={APPLICATION_STATUS_LABELS[application.status] ?? application.status}
          />
          <Icon name={open ? "chevron-up" : "chevron-down"} className="h-5 w-5 text-slate" />
        </div>
      </button>

      {open ? (
        <div className="space-y-5 border-t border-warm-border p-5">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate">Telefon</dt>
              <dd className="text-body-sm text-charcoal">
                <a href={`tel:${application.phone.replace(/[^\d+]/g, "")}`} className="text-forest-emerald hover:underline">
                  {application.phone}
                </a>
              </dd>
            </div>
            {application.email ? (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate">E-posta</dt>
                <dd className="text-body-sm text-charcoal">
                  <a href={`mailto:${application.email}`} className="text-forest-emerald hover:underline">
                    {application.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {application.cvUrl ? (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate">CV</dt>
                <dd className="text-body-sm">
                  <a
                    href={application.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-forest-emerald hover:underline"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    CV&apos;yi İndir
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>

          {application.message ? (
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate">Mesaj</p>
              <p className="whitespace-pre-wrap text-body-sm text-charcoal">{application.message}</p>
            </div>
          ) : null}

          <form action={formAction} className="space-y-4 border-t border-warm-border pt-4">
            <input type="hidden" name="id" value={application.id} />

            {state.status !== "idle" ? (
              <FormStatusAlert
                status={state.status === "success" ? "success" : "error"}
                message={state.message}
              />
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`app-status-${application.id}`} className="text-[13px] font-semibold text-charcoal">
                  Durum
                </label>
                <select
                  id={`app-status-${application.id}`}
                  name="status"
                  defaultValue={application.status}
                  className="border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
                >
                  {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`app-notes-${application.id}`} className="text-[13px] font-semibold text-charcoal">
                İç Notlar
              </label>
              <textarea
                id={`app-notes-${application.id}`}
                name="internalNotes"
                rows={3}
                defaultValue={application.internalNotes ?? ""}
                className="border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <ConfirmDelete action={deleteApplicationAction} id={application.id} label="Başvuruyu Sil" />
              <SaveButton />
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
