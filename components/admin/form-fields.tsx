"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

/** Shared admin form field primitives. All wire up label + aria-invalid + error. */

type Errors = Record<string, string> | undefined;

const baseInput =
  "w-full border border-warm-border bg-admin-bg px-3.5 py-2.5 text-body-sm text-charcoal outline-none transition-all placeholder:text-slate/60 focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald disabled:opacity-60";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-[12px] font-medium text-error-red">
      {message}
    </p>
  );
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[13px] font-semibold text-charcoal"
    >
      {children}
      {required ? <span className="ml-0.5 text-error-red">*</span> : null}
    </label>
  );
}

export function TextField({
  name,
  label,
  errors,
  defaultValue,
  required,
  type = "text",
  placeholder,
  hint,
  onChange,
  value,
  id: idProp,
}: {
  name: string;
  label: string;
  errors?: Errors;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
  onChange?: (value: string) => void;
  value?: string;
  id?: string;
}) {
  const reactId = useId();
  const id = idProp ?? `f-${name}-${reactId}`;
  const error = errors?.[name];
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={value === undefined ? (defaultValue ?? undefined) : undefined}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={baseInput}
      />
      {hint ? <p className="mt-1 text-[12px] text-slate">{hint}</p> : null}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  errors,
  defaultValue,
  required,
  rows = 4,
  placeholder,
  hint,
  className,
}: {
  name: string;
  label: string;
  errors?: Errors;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  const reactId = useId();
  const id = `f-${name}-${reactId}`;
  const error = errors?.[name];
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(baseInput, "resize-y font-mono text-[13px] leading-relaxed", className)}
      />
      {hint ? <p className="mt-1 text-[12px] text-slate">{hint}</p> : null}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  errors,
  defaultValue,
  options,
  required,
  hint,
}: {
  name: string;
  label: string;
  errors?: Errors;
  defaultValue?: string | null;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  hint?: string;
}) {
  const reactId = useId();
  const id = `f-${name}-${reactId}`;
  const error = errors?.[name];
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={baseInput}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1 text-[12px] text-slate">{hint}</p> : null}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  const reactId = useId();
  const id = `f-${name}-${reactId}`;
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-forest-emerald"
      />
      <div>
        <label htmlFor={id} className="cursor-pointer text-body-sm font-medium text-charcoal">
          {label}
        </label>
        {hint ? <p className="text-[12px] text-slate">{hint}</p> : null}
      </div>
    </div>
  );
}
