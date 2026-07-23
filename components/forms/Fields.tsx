"use client";

import Link from "next/link";
import { useId } from "react";

import { Icon } from "@/components/public/Icon";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  /** Dark forms sit on navy CTA sections; light forms sit on white cards. */
  tone?: "light" | "dark";
};

function FieldShell({
  label,
  error,
  required,
  hint,
  htmlFor,
  children,
  className,
  tone = "light",
}: BaseProps & { htmlFor: string; children: React.ReactNode }) {
  const dark = tone === "dark";
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "block font-label-caps uppercase tracking-[0.08em]",
          dark ? "text-white/70" : "text-slate",
        )}
      >
        {label}
        {required ? <span className="ml-1 text-error-red">*</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className={cn("text-[12px]", dark ? "text-white/50" : "text-slate")}>{hint}</p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-[12px] font-medium text-error-red"
        >
          <Icon name="alert-triangle" className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputBase =
  "w-full border p-4 font-body-md outline-none transition-all focus:ring-1";
const inputLight =
  "border-warm-border bg-surface-container-low text-on-surface placeholder:text-slate/70 focus:border-forest-emerald focus:ring-forest-emerald";
const inputDark =
  "border-white/20 bg-white/5 text-white placeholder:text-white/40 focus:border-forest-emerald focus:ring-forest-emerald";

export function TextField({
  type = "text",
  placeholder,
  autoComplete,
  defaultValue,
  onFocus,
  ...props
}: BaseProps & {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  onFocus?: () => void;
}) {
  const id = useId();
  const fieldId = `${props.name}-${id}`;
  return (
    <FieldShell {...props} htmlFor={fieldId}>
      <input
        id={fieldId}
        name={props.name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required={props.required}
        onFocus={onFocus}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${fieldId}-error` : undefined}
        className={cn(inputBase, props.tone === "dark" ? inputDark : inputLight)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  placeholder,
  rows = 4,
  defaultValue,
  onFocus,
  ...props
}: BaseProps & {
  placeholder?: string;
  rows?: number;
  defaultValue?: string;
  onFocus?: () => void;
}) {
  const id = useId();
  const fieldId = `${props.name}-${id}`;
  return (
    <FieldShell {...props} htmlFor={fieldId}>
      <textarea
        id={fieldId}
        name={props.name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={props.required}
        onFocus={onFocus}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${fieldId}-error` : undefined}
        className={cn(inputBase, "resize-y", props.tone === "dark" ? inputDark : inputLight)}
      />
    </FieldShell>
  );
}

export function SelectField({
  options,
  defaultValue,
  placeholder,
  onFocus,
  ...props
}: BaseProps & {
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  placeholder?: string;
  onFocus?: () => void;
}) {
  const id = useId();
  const fieldId = `${props.name}-${id}`;
  return (
    <FieldShell {...props} htmlFor={fieldId}>
      <select
        id={fieldId}
        name={props.name}
        defaultValue={defaultValue ?? ""}
        required={props.required}
        onFocus={onFocus}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={props.error ? `${fieldId}-error` : undefined}
        className={cn(inputBase, props.tone === "dark" ? inputDark : inputLight)}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function FileField({
  accept,
  hint,
  ...props
}: BaseProps & { accept?: string }) {
  const id = useId();
  const fieldId = `${props.name}-${id}`;
  const dark = props.tone === "dark";
  return (
    <FieldShell {...props} hint={hint} htmlFor={fieldId}>
      <input
        id={fieldId}
        name={props.name}
        type="file"
        accept={accept}
        aria-describedby={props.error ? `${fieldId}-error` : undefined}
        className={cn(
          "w-full border p-3 font-body-sm outline-none transition-all file:mr-4 file:border-0 file:px-4 file:py-2 file:font-button-text file:uppercase file:tracking-wider focus:ring-1 focus:ring-forest-emerald",
          dark
            ? "border-white/20 bg-white/5 text-white/70 file:bg-white/10 file:text-white"
            : "border-warm-border bg-surface-container-low text-slate file:bg-midnight-navy file:text-white",
        )}
      />
    </FieldShell>
  );
}

export function KvkkCheckbox({
  error,
  tone = "light",
  name = "kvkk",
}: {
  error?: string;
  tone?: "light" | "dark";
  name?: string;
}) {
  const id = useId();
  const fieldId = `${name}-${id}`;
  const dark = tone === "dark";
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <input
          id={fieldId}
          name={name}
          type="checkbox"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 accent-forest-emerald"
        />
        <label
          htmlFor={fieldId}
          className={cn(
            "cursor-pointer text-[12px] leading-relaxed",
            dark ? "text-white/60" : "text-slate",
          )}
        >
          <Link
            href="/kvkk"
            target="_blank"
            className="underline underline-offset-2 hover:text-forest-emerald"
          >
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni okudum, kişisel verilerimin belirtilen amaçlarla işlenmesini kabul ediyorum.
        </label>
      </div>
      {error ? (
        <p
          id={`${fieldId}-error`}
          role="alert"
          className="flex items-center gap-1.5 text-[12px] font-medium text-error-red"
        >
          <Icon name="alert-triangle" className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Hidden honeypot. Real users never see or fill it; bots usually do. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="website-field">Web sitesi (doldurmayınız)</label>
      <input id="website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function FormStatusAlert({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) {
  const success = status === "success";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 border p-4 text-body-sm",
        success
          ? "border-success-green/40 bg-success-green/10 text-success-green"
          : "border-error-red/40 bg-error-red/10 text-error-red",
      )}
    >
      <Icon
        name={success ? "check-circle" : "alert-triangle"}
        className="mt-0.5 h-5 w-5 shrink-0"
      />
      <p className="font-medium leading-relaxed">{message}</p>
    </div>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel = "Gönderiliyor…",
  tone = "light",
  className,
}: {
  pending: boolean;
  label: string;
  pendingLabel?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex w-full items-center justify-center gap-2 px-8 py-4 font-button-text uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        tone === "dark"
          ? "bg-forest-emerald text-midnight-navy hover:bg-soft-gold"
          : "bg-forest-emerald text-white hover:bg-midnight-navy",
        className,
      )}
    >
      {pending ? (
        <>
          <Icon name="refresh" className="h-4 w-4 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
