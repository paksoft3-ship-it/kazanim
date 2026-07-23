"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveSettingsAction } from "@/app/admin/_actions/operations";
import { FormStatusAlert } from "@/components/admin/AdminUI";
import { Icon } from "@/components/public/Icon";
import { cn } from "@/lib/utils";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const IDLE: ActionState = { status: "idle", message: "" };

type Group = { id: string; label: string; keys: string[] };

/** Keys rendered as booleans (checkboxes) — resolved via the __booleans hidden field. */
const BOOLEAN_KEYS = new Set([
  "floatingWhatsappEnabled",
  "floatingPhoneEnabled",
  "floatingDirectionsEnabled",
  "floatingFormEnabled",
]);

/** Keys that benefit from a multi-line textarea. */
const TEXTAREA_KEYS = new Set([
  "footerDescription",
  "heroSubtitle",
  "defaultSeoDescription",
  "whatsappMessage",
]);

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 border border-forest-emerald bg-forest-emerald px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-midnight-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon name={pending ? "refresh" : "save"} className={cn("h-4 w-4", pending && "animate-spin")} />
      {pending ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
    </button>
  );
}

/**
 * Tabbed settings editor. Every tab lives inside ONE form and hidden tabs use
 * CSS visibility (not conditional rendering) so their inputs still submit.
 */
export function SettingsForm({
  groups,
  settings,
  labels,
}: {
  groups: Group[];
  settings: Record<string, string>;
  labels: Record<string, string>;
}) {
  const [state, formAction] = useActionState(saveSettingsAction, IDLE);
  const [active, setActive] = useState(groups[0]?.id ?? "");

  // Booleans present across the rendered groups — declared to the action.
  const declaredBooleans = groups
    .flatMap((g) => g.keys)
    .filter((k) => BOOLEAN_KEYS.has(k));

  return (
    <form action={formAction} className="space-y-6">
      {declaredBooleans.length > 0 ? (
        <input type="hidden" name="__booleans" value={declaredBooleans.join(",")} />
      ) : null}

      {state.status !== "idle" ? (
        <FormStatusAlert
          status={state.status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

      {groups.length > 1 ? (
        <div className="flex flex-wrap gap-1 border-b border-warm-border" role="tablist" aria-label="Ayar grupları">
          {groups.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={active === g.id}
              onClick={() => setActive(g.id)}
              className={cn(
                "border-b-2 px-4 py-2.5 text-body-sm font-semibold transition-colors",
                active === g.id
                  ? "border-forest-emerald text-forest-emerald"
                  : "border-transparent text-slate hover:text-charcoal",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      ) : null}

      {groups.map((g) => (
        <div
          key={g.id}
          role="tabpanel"
          hidden={groups.length > 1 && active !== g.id}
          className="grid gap-5 sm:grid-cols-2"
        >
          {g.keys.map((key) => {
            const label = labels[key] ?? key;
            const value = settings[key] ?? "";
            const fieldError = state.errors?.[key];

            if (BOOLEAN_KEYS.has(key)) {
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 border border-warm-border bg-admin-bg px-4 py-3 sm:col-span-2"
                >
                  <input
                    type="checkbox"
                    name={key}
                    defaultChecked={value === "true"}
                    className="h-4 w-4 accent-forest-emerald"
                  />
                  <span className="text-body-sm font-medium text-charcoal">{label}</span>
                </label>
              );
            }

            const isTextarea = TEXTAREA_KEYS.has(key);
            return (
              <div key={key} className={cn("flex flex-col gap-1.5", isTextarea && "sm:col-span-2")}>
                <label htmlFor={`setting-${key}`} className="text-[13px] font-semibold text-charcoal">
                  {label}
                </label>
                {isTextarea ? (
                  <textarea
                    id={`setting-${key}`}
                    name={key}
                    defaultValue={value}
                    rows={3}
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? `setting-${key}-error` : undefined}
                    className="border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
                  />
                ) : (
                  <input
                    id={`setting-${key}`}
                    name={key}
                    defaultValue={value}
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? `setting-${key}-error` : undefined}
                    className="border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
                  />
                )}
                {fieldError ? (
                  <p id={`setting-${key}-error`} className="text-[12px] text-error-red">
                    {fieldError}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}

      <div className="flex justify-end border-t border-warm-border pt-5">
        <SaveButton />
      </div>
    </form>
  );
}
