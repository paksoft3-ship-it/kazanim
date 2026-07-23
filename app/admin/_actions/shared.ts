import "server-only";

import type { z } from "zod";

import { requireSession, canManageUsers, canWrite } from "@/lib/auth";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

export const IDLE: ActionState = { status: "idle", message: "" };

export function ok(message: string): ActionState {
  return { status: "success", message };
}

export function fail(message: string, errors?: Record<string, string>): ActionState {
  return { status: "error", message, errors };
}

/**
 * Guard every admin mutation. Returns an ActionState on failure so the caller
 * can render it, rather than throwing an opaque error at the user.
 */
export async function guard(
  level: "write" | "users" = "write",
): Promise<{ ok: true; userId: string } | { ok: false; state: ActionState }> {
  try {
    const session = await requireSession();
    const allowed = level === "users" ? canManageUsers(session.role) : canWrite(session.role);
    if (!allowed) {
      return {
        ok: false,
        state: fail("Bu işlem için yetkiniz bulunmuyor."),
      };
    }
    return { ok: true, userId: session.id };
  } catch {
    return {
      ok: false,
      state: fail("Oturumunuz sona ermiş. Lütfen tekrar giriş yapın."),
    };
  }
}

/** Turn a ZodError into a `{ field: message }` map. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** FormData → plain object, dropping empty File entries. */
export function formToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    out[key] = value;
  }
  return out;
}

/** HTML checkboxes submit "on" when ticked and nothing when unticked. */
export function checkbox(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true";
}

/** Parse a repeated / JSON-encoded field into a typed array, tolerating junk. */
export function jsonField<T>(formData: FormData, name: string, fallback: T): T {
  const raw = formData.get(name);
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Split a textarea of newline-separated values into a clean string array. */
export function lines(formData: FormData, name: string): string[] {
  const raw = formData.get(name);
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Parse "label: value" lines into label/value pairs (features, tech details). */
export function labelValueLines(
  formData: FormData,
  name: string,
): Array<{ label: string; value: string }> {
  return lines(formData, name)
    .map((line) => {
      const index = line.indexOf(":");
      if (index === -1) return null;
      return {
        label: line.slice(0, index).trim(),
        value: line.slice(index + 1).trim(),
      };
    })
    .filter((entry): entry is { label: string; value: string } => Boolean(entry?.label));
}

/** Parse "label: 65" lines into progress items with numeric values. */
export function progressLines(
  formData: FormData,
  name: string,
): Array<{ label: string; value: number }> {
  return labelValueLines(formData, name).map((entry) => ({
    label: entry.label,
    value: Math.max(0, Math.min(100, Number(entry.value) || 0)),
  }));
}

/** Empty string → null, for optional DB columns. */
export function nullify(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/** Parse a date input ("" → null). */
export function toDate(value: unknown): Date | null {
  const str = nullify(value);
  if (!str) return null;
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
}
