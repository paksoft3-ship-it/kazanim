"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Icon } from "@/components/public/Icon";
import type { ActionState } from "@/app/admin/_actions/shared";

const IDLE: ActionState = { status: "idle", message: "" };

type DeleteAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

function ConfirmSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 border border-error-red bg-error-red px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? (
        <Icon name="refresh" className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Icon name="trash" className="h-3.5 w-3.5" />
      )}
      {pending ? "Siliniyor…" : "Evet, Sil"}
    </button>
  );
}

/**
 * Two-step delete. First click reveals a confirm/cancel pair; never deletes on a
 * single unconfirmed click. Submits `id` through the given server action.
 */
export function DeleteButton({
  id,
  action,
  label = "Sil",
  confirmText = "Emin misiniz?",
  onDeleted,
}: {
  id: string;
  action: DeleteAction;
  label?: string;
  confirmText?: string;
  onDeleted?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction] = useActionState(action, IDLE);

  useEffect(() => {
    if (state.status === "success") {
      setConfirming(false);
      onDeleted?.();
    }
  }, [state.status, onDeleted]);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={label}
        className="inline-flex items-center gap-1.5 border border-warm-border bg-white px-3 py-1.5 text-[13px] font-semibold text-slate transition-colors hover:border-error-red hover:text-error-red"
      >
        <Icon name="trash" className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[13px] font-medium text-error-red">{confirmText}</span>
      <form action={formAction} className="inline-flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <ConfirmSubmit label={label} />
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex items-center border border-warm-border bg-white px-3 py-1.5 text-[13px] font-semibold text-slate transition-colors hover:border-forest-emerald hover:text-forest-emerald"
        >
          Vazgeç
        </button>
      </form>
      {state.status === "error" ? (
        <span role="alert" className="text-[12px] font-medium text-error-red">
          {state.message}
        </span>
      ) : null}
    </div>
  );
}

/** Shared submit button for admin forms; shows a spinner while pending. */
export function SubmitButton({
  children = "Kaydet",
  savingLabel = "Kaydediliyor…",
  icon = "save",
}: {
  children?: React.ReactNode;
  savingLabel?: string;
  icon?: "save" | "plus";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 border border-forest-emerald bg-forest-emerald px-6 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-midnight-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Icon name="refresh" className="h-4 w-4 animate-spin" />
          {savingLabel}
        </>
      ) : (
        <>
          <Icon name={icon} className="h-4 w-4" />
          {children}
        </>
      )}
    </button>
  );
}
