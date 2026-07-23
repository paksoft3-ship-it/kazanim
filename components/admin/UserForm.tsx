"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveUserAction } from "@/app/admin/_actions/operations";
import { FormStatusAlert } from "@/components/admin/AdminUI";
import { Icon } from "@/components/public/Icon";
import { USER_ROLE_LABELS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const IDLE: ActionState = { status: "idle", message: "" };

export type EditableUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

function SaveButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 border border-forest-emerald bg-forest-emerald px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-midnight-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon name={pending ? "refresh" : "save"} className={cn("h-4 w-4", pending && "animate-spin")} />
      {pending ? "Kaydediliyor…" : isEdit ? "Kullanıcıyı Güncelle" : "Kullanıcı Oluştur"}
    </button>
  );
}

const inputClass =
  "border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald";

export function UserForm({ user }: { user?: EditableUser }) {
  const [state, formAction] = useActionState(saveUserAction, IDLE);
  const isEdit = Boolean(user);
  const err = (f: string) => state.errors?.[f];

  return (
    <form action={formAction} className="space-y-5" key={user?.id ?? "new"}>
      {user ? <input type="hidden" name="id" value={user.id} /> : null}

      {state.status !== "idle" ? (
        <FormStatusAlert
          status={state.status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-name" className="text-[13px] font-semibold text-charcoal">
            Ad Soyad
          </label>
          <input
            id="user-name"
            name="name"
            defaultValue={user?.name ?? ""}
            required
            aria-invalid={err("name") ? true : undefined}
            aria-describedby={err("name") ? "user-name-error" : undefined}
            className={inputClass}
          />
          {err("name") ? (
            <p id="user-name-error" className="text-[12px] text-error-red">{err("name")}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-email" className="text-[13px] font-semibold text-charcoal">
            E-posta
          </label>
          <input
            id="user-email"
            name="email"
            type="email"
            defaultValue={user?.email ?? ""}
            required
            aria-invalid={err("email") ? true : undefined}
            aria-describedby={err("email") ? "user-email-error" : undefined}
            className={inputClass}
          />
          {err("email") ? (
            <p id="user-email-error" className="text-[12px] text-error-red">{err("email")}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-password" className="text-[13px] font-semibold text-charcoal">
            Şifre {isEdit ? "(boş bırakılırsa değişmez)" : ""}
          </label>
          <input
            id="user-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={isEdit ? "••••••••" : "En az 8 karakter"}
            aria-invalid={err("password") ? true : undefined}
            aria-describedby={err("password") ? "user-password-error" : undefined}
            className={inputClass}
          />
          {err("password") ? (
            <p id="user-password-error" className="text-[12px] text-error-red">{err("password")}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-role" className="text-[13px] font-semibold text-charcoal">
            Rol
          </label>
          <select
            id="user-role"
            name="role"
            defaultValue={user?.role ?? "EDITOR"}
            aria-invalid={err("role") ? true : undefined}
            className={inputClass}
          >
            {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {err("role") ? (
            <p className="text-[12px] text-error-red">{err("role")}</p>
          ) : null}
        </div>
      </div>

      <label className="flex items-center gap-3 border border-warm-border bg-admin-bg px-4 py-3">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={user ? user.isActive : true}
          className="h-4 w-4 accent-forest-emerald"
        />
        <span className="text-body-sm font-medium text-charcoal">Aktif kullanıcı</span>
      </label>

      <div className="flex items-center justify-end gap-3 border-t border-warm-border pt-5">
        {isEdit ? (
          <Link
            href="/admin/users"
            className="text-body-sm font-medium text-slate hover:text-charcoal"
          >
            Yeni kullanıcıya geç
          </Link>
        ) : null}
        <SaveButton isEdit={isEdit} />
      </div>
    </form>
  );
}
