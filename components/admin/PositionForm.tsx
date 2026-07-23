"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveJobPositionAction } from "@/app/admin/_actions/content";
import { FormStatusAlert } from "@/components/admin/AdminUI";
import { Icon } from "@/components/public/Icon";
import { CONTENT_STATUS_LABELS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const IDLE: ActionState = { status: "idle", message: "" };

export type EditablePosition = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  status: string;
  sortOrder: number;
};

const inputClass =
  "border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald";

function SaveButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 border border-forest-emerald bg-forest-emerald px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-midnight-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon name={pending ? "refresh" : "save"} className={cn("h-4 w-4", pending && "animate-spin")} />
      {pending ? "Kaydediliyor…" : isEdit ? "Pozisyonu Güncelle" : "Pozisyon Oluştur"}
    </button>
  );
}

function Field({
  name,
  label,
  defaultValue,
  error,
  required,
  textarea,
  colSpan,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  textarea?: boolean;
  colSpan?: boolean;
}) {
  const id = `pos-${name}`;
  return (
    <div className={cn("flex flex-col gap-1.5", colSpan && "sm:col-span-2")}>
      <label htmlFor={id} className="text-[13px] font-semibold text-charcoal">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          defaultValue={defaultValue}
          rows={3}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          name={name}
          defaultValue={defaultValue}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClass}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-[12px] text-error-red">{error}</p>
      ) : null}
    </div>
  );
}

export function PositionForm({ position }: { position?: EditablePosition }) {
  const [state, formAction] = useActionState(saveJobPositionAction, IDLE);
  const isEdit = Boolean(position);
  const err = (f: string) => state.errors?.[f];

  return (
    <form action={formAction} className="space-y-5" key={position?.id ?? "new"}>
      {position ? <input type="hidden" name="id" value={position.id} /> : null}

      {state.status !== "idle" ? (
        <FormStatusAlert
          status={state.status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="title" label="Pozisyon Başlığı" defaultValue={position?.title} error={err("title")} required />
        <Field name="slug" label="URL Slug" defaultValue={position?.slug} error={err("slug")} required />
        <Field name="department" label="Departman" defaultValue={position?.department ?? ""} error={err("department")} />
        <Field name="location" label="Lokasyon" defaultValue={position?.location ?? ""} error={err("location")} />
        <Field name="type" label="Çalışma Türü" defaultValue={position?.type ?? ""} error={err("type")} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="pos-status" className="text-[13px] font-semibold text-charcoal">
            Durum
          </label>
          <select
            id="pos-status"
            name="status"
            defaultValue={position?.status ?? "PUBLISHED"}
            className={inputClass}
          >
            {Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <Field name="description" label="Açıklama" defaultValue={position?.description ?? ""} error={err("description")} textarea colSpan />
        <Field name="requirements" label="Aranan Nitelikler" defaultValue={position?.requirements ?? ""} error={err("requirements")} textarea colSpan />
        <Field name="responsibilities" label="Sorumluluklar" defaultValue={position?.responsibilities ?? ""} error={err("responsibilities")} textarea colSpan />
        <Field name="sortOrder" label="Sıralama" defaultValue={String(position?.sortOrder ?? 0)} error={err("sortOrder")} />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-warm-border pt-5">
        {isEdit ? (
          <Link
            href="/admin/hr?tab=positions"
            className="text-body-sm font-medium text-slate hover:text-charcoal"
          >
            Yeni pozisyona geç
          </Link>
        ) : null}
        <SaveButton isEdit={isEdit} />
      </div>
    </form>
  );
}
