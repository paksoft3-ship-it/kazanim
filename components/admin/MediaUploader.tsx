"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteMediaAction, updateMediaAction } from "@/app/admin/_actions/content";
import { EmptyState, FormStatusAlert } from "@/components/admin/AdminUI";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { Icon } from "@/components/public/Icon";
import { cn } from "@/lib/utils";

type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const IDLE: ActionState = { status: "idle", message: "" };

export type MediaItem = {
  id: string;
  url: string;
  fileName: string;
  title: string | null;
  altText: string | null;
  description: string | null;
  category: string;
  mimeType: string | null;
  sortOrder: number;
  linkedProjectId: string | null;
  linkedProjectTitle: string | null;
  createdAt: string;
};

type ProjectOption = { id: string; title: string };

const inputClass =
  "w-full border border-warm-border bg-white px-3 py-2 text-body-sm text-charcoal outline-none focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald";

function isImage(mime: string | null) {
  return !mime || mime.startsWith("image/");
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 border border-forest-emerald bg-forest-emerald px-4 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-midnight-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon name={pending ? "refresh" : "save"} className={cn("h-4 w-4", pending && "animate-spin")} />
      {pending ? "Kaydediliyor…" : "Bilgileri Kaydet"}
    </button>
  );
}

function EditPanel({
  item,
  projects,
  onClose,
}: {
  item: MediaItem;
  projects: ProjectOption[];
  onClose: () => void;
}) {
  const [state, formAction] = useActionState(updateMediaAction, IDLE);
  const err = (f: string) => state.errors?.[f];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-navy/50 p-4" role="dialog" aria-modal="true" aria-label="Görsel düzenle">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-warm-border bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-warm-border px-6 py-4">
          <h2 className="font-semibold text-charcoal">Görsel Bilgileri</h2>
          <button type="button" onClick={onClose} aria-label="Kapat" className="p-1 text-slate hover:text-charcoal">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
          <div className="relative aspect-square overflow-hidden border border-warm-border bg-admin-bg">
            {isImage(item.mimeType) ? (
              <Image src={item.url} alt={item.altText ?? item.fileName} fill sizes="200px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate">
                <Icon name="file-text" className="h-10 w-10" />
              </div>
            )}
          </div>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="id" value={item.id} />

            {state.status !== "idle" ? (
              <FormStatusAlert
                status={state.status === "success" ? "success" : "error"}
                message={state.message}
              />
            ) : null}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="media-title" className="text-[13px] font-semibold text-charcoal">Başlık</label>
              <input id="media-title" name="title" defaultValue={item.title ?? ""} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="media-alt" className="text-[13px] font-semibold text-charcoal">
                Alternatif Metin (Alt)
              </label>
              <input
                id="media-alt"
                name="altText"
                defaultValue={item.altText ?? ""}
                aria-invalid={err("altText") ? true : undefined}
                className={inputClass}
              />
              <p className="text-[12px] text-slate">SEO ve erişilebilirlik için görseli tanımlayın.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="media-desc" className="text-[13px] font-semibold text-charcoal">Açıklama</label>
              <textarea id="media-desc" name="description" rows={2} defaultValue={item.description ?? ""} className={inputClass} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="media-category" className="text-[13px] font-semibold text-charcoal">Kategori</label>
                <input id="media-category" name="category" defaultValue={item.category} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="media-sort" className="text-[13px] font-semibold text-charcoal">Sıralama</label>
                <input id="media-sort" name="sortOrder" type="number" defaultValue={item.sortOrder} className={inputClass} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="media-project" className="text-[13px] font-semibold text-charcoal">Bağlı Proje</label>
              <select id="media-project" name="linkedProjectId" defaultValue={item.linkedProjectId ?? ""} className={inputClass}>
                <option value="">— Yok —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-warm-border pt-4">
              <ConfirmDelete action={deleteMediaAction} id={item.id} label="Görseli Sil" onDeleted={onClose} />
              <SaveButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function MediaUploader({
  media,
  projects,
}: {
  media: MediaItem[];
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    setUploadError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          setUploadError(data.message ?? "Dosya yüklenemedi.");
          break;
        }
      }
      router.refresh();
    } catch {
      setUploadError("Yükleme sırasında bir hata oluştu.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center border-2 border-dashed bg-white px-6 py-10 text-center transition-colors",
          dragOver ? "border-forest-emerald bg-forest-emerald/5" : "border-warm-border",
        )}
      >
        <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-forest-emerald/5 text-forest-emerald">
          <Icon name={uploading ? "refresh" : "upload"} className={cn("h-7 w-7", uploading && "animate-spin")} />
        </span>
        <p className="font-semibold text-charcoal">
          {uploading ? "Yükleniyor…" : "Medya dosyalarını buraya sürükleyin"}
        </p>
        <p className="mt-1 text-[12px] text-slate">PNG, JPG, WebP veya SVG</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-4 inline-flex items-center gap-2 border border-forest-emerald bg-forest-emerald px-4 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-midnight-navy disabled:opacity-60"
        >
          <Icon name="plus" className="h-4 w-4" />
          Dosya Seç
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
          }}
        />
        {uploadError ? (
          <p role="alert" className="mt-3 text-[13px] text-error-red">{uploadError}</p>
        ) : null}
      </div>

      {media.length === 0 ? (
        <EmptyState
          icon="image"
          title="Henüz medya yok"
          description="İlk görselinizi yükleyerek galeri kütüphanesini oluşturun."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group flex flex-col overflow-hidden border border-warm-border bg-white text-left transition-colors hover:border-forest-emerald"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-admin-bg">
                {isImage(item.mimeType) ? (
                  <Image
                    src={item.url}
                    alt={item.altText ?? item.fileName}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate">
                    <Icon name="file-text" className="h-8 w-8" />
                  </div>
                )}
                {!item.altText ? (
                  <span
                    title="Alt metin eksik"
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-warning-orange text-white"
                  >
                    <Icon name="alert-triangle" className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </div>
              <div className="p-3">
                <p className="truncate text-[13px] font-medium text-charcoal">
                  {item.title || item.fileName}
                </p>
                <p className="truncate text-[11px] text-slate">
                  {item.category}
                  {item.linkedProjectTitle ? ` · ${item.linkedProjectTitle}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected ? (
        <EditPanel item={selected} projects={projects} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
