"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { Icon } from "@/components/public/Icon";
import { cn } from "@/lib/utils";

/** Local mirror of the server ActionState shape (server-only module can't be imported here). */
type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const IDLE: ActionState = { status: "idle", message: "" };

type ServerAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

function DeleteButton({
  confirming,
  label,
  size,
}: {
  confirming: boolean;
  label: string;
  size: "sm" | "md";
}) {
  const { pending } = useFormStatus();
  const sizes = { sm: "px-3 py-1.5 text-[13px]", md: "px-5 py-2.5 text-body-sm" };
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        sizes[size],
        confirming
          ? "border-error-red bg-error-red text-white hover:opacity-90"
          : "border-warm-border bg-white text-error-red hover:border-error-red",
      )}
    >
      <Icon name="trash" className="h-4 w-4" />
      {pending ? "Siliniyor…" : confirming ? "Onayla" : label}
    </button>
  );
}

/**
 * Two-step delete: the first click arms the button, the second submits.
 * Never deletes on a single unconfirmed click.
 */
export function ConfirmDelete({
  action,
  id,
  label = "Sil",
  hint = "Emin misiniz? Bu işlem geri alınamaz.",
  size = "sm",
  onDeleted,
  extraFields,
}: {
  action: ServerAction;
  id: string;
  label?: string;
  hint?: string;
  size?: "sm" | "md";
  onDeleted?: () => void;
  extraFields?: Record<string, string>;
}) {
  const [state, formAction] = useActionState(action, IDLE);
  const [confirming, setConfirming] = useState(false);
  const wasSuccess = useRef(false);

  useEffect(() => {
    if (state.status === "success" && !wasSuccess.current) {
      wasSuccess.current = true;
      onDeleted?.();
    }
  }, [state.status, onDeleted]);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-[13px] font-medium text-slate hover:text-charcoal"
          >
            Vazgeç
          </button>
        ) : null}
        <form
          action={formAction}
          onSubmit={(e) => {
            if (!confirming) {
              e.preventDefault();
              setConfirming(true);
            }
          }}
        >
          <input type="hidden" name="id" value={id} />
          {extraFields
            ? Object.entries(extraFields).map(([k, v]) => (
                <input key={k} type="hidden" name={k} value={v} />
              ))
            : null}
          <DeleteButton confirming={confirming} label={label} size={size} />
        </form>
      </div>
      {confirming && state.status !== "error" ? (
        <p className="text-[12px] text-error-red">{hint}</p>
      ) : null}
      {state.status === "error" ? (
        <p role="alert" className="max-w-[240px] text-right text-[12px] text-error-red">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
