"use client";

import { useRef, useState } from "react";

import { Icon } from "@/components/public/Icon";
import { cn } from "@/lib/utils";

type UploadResponse = {
  ok: boolean;
  media?: { id: string; url: string; fileName: string };
  message?: string;
};

/**
 * Image field for admin forms. Uploads a file to /api/admin/upload, then keeps
 * the returned URL in a hidden input so it submits with the surrounding form.
 * A manual URL field is also offered as a fallback.
 */
export function ImageUpload({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("uploading");
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("category", "medya");
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as UploadResponse;
      if (!res.ok || !data.ok || !data.media) {
        throw new Error(data.message ?? "Dosya yüklenemedi.");
      }
      setUrl(data.media.url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Dosya yüklenemedi.");
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-semibold text-charcoal">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden border border-warm-border bg-admin-bg">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Önizleme" className="h-full w-full object-cover" />
          ) : (
            <Icon name="image" className="h-8 w-8 text-slate/50" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={status === "uploading"}
              className="inline-flex items-center gap-2 border border-warm-border bg-white px-4 py-2 text-body-sm font-semibold text-charcoal transition-colors hover:border-forest-emerald disabled:opacity-60"
            >
              {status === "uploading" ? (
                <>
                  <Icon name="refresh" className="h-4 w-4 animate-spin" />
                  Yükleniyor…
                </>
              ) : (
                <>
                  <Icon name="upload" className="h-4 w-4" />
                  Görsel Yükle
                </>
              )}
            </button>
            {url ? (
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setError(null);
                  setStatus("idle");
                }}
                className="inline-flex items-center gap-2 border border-transparent px-3 py-2 text-body-sm font-semibold text-slate transition-colors hover:text-error-red"
              >
                <Icon name="trash" className="h-4 w-4" />
                Kaldır
              </button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="veya görsel URL'si yapıştırın"
            className={cn(
              "w-full border border-warm-border bg-admin-bg px-3 py-2 text-body-sm outline-none transition-all focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald",
            )}
          />

          {hint ? <p className="text-[12px] text-slate">{hint}</p> : null}
          {error ? (
            <p role="alert" className="text-[12px] font-medium text-error-red">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
