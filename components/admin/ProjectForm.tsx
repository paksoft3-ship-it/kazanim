"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { saveProjectAction } from "@/app/admin/_actions/content";
import type { ActionState } from "@/app/admin/_actions/shared";
import { DeleteButton, SubmitButton } from "@/components/admin/DeleteButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SEOFields } from "@/components/admin/SEOFields";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";
import { FormStatusAlert } from "@/components/admin/AdminUI";
import { deleteProjectAction } from "@/app/admin/_actions/content";
import { Icon } from "@/components/public/Icon";
import { cn, slugify } from "@/lib/utils";

const IDLE: ActionState = { status: "idle", message: "" };

export type ProjectFormValues = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  slogan?: string | null;
  status?: string | null;
  publishStatus?: string | null;
  type?: string | null;
  location?: string | null;
  mapsUrl?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  coverImage?: string | null;
  videoUrl?: string | null;
  gallery?: string[];
  progressOverall?: number | null;
  progressItems?: Array<{ label: string; value: number }>;
  features?: string[];
  technicalDetails?: Array<{ label: string; value: string }>;
  documents?: Array<{ label: string; url: string }>;
  startDate?: string | null;
  deliveryDate?: string | null;
  isFeatured?: boolean;
  sortOrder?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
};

const TABS = [
  { id: "general", label: "Genel Bilgiler", icon: "info" as const },
  { id: "media", label: "Görseller", icon: "image" as const },
  { id: "features", label: "Proje Özellikleri", icon: "layers" as const },
  { id: "progress", label: "İlerleme", icon: "bar-chart" as const },
  { id: "seo", label: "SEO", icon: "globe" as const },
];

const STATUS_OPTIONS = [
  { value: "ONGOING", label: "Devam Eden" },
  { value: "COMPLETED", label: "Tamamlanan" },
  { value: "UPCOMING", label: "Yakında" },
];

const PUBLISH_OPTIONS = [
  { value: "PUBLISHED", label: "Yayında" },
  { value: "DRAFT", label: "Taslak" },
  { value: "HIDDEN", label: "Gizli" },
];

export function ProjectForm({ project }: { project?: ProjectFormValues }) {
  const [state, formAction] = useActionState(saveProjectAction, IDLE);
  const [activeTab, setActiveTab] = useState("general");
  const isEdit = Boolean(project?.id);

  // Auto-fill slug from the title until the user touches the slug field.
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project?.slug));

  const errors = state.errors;

  const galleryText = (project?.gallery ?? []).join("\n");
  const progressItemsText = (project?.progressItems ?? [])
    .map((p) => `${p.label}: ${p.value}`)
    .join("\n");
  const featuresText = (project?.features ?? []).join("\n");
  const technicalDetailsText = (project?.technicalDetails ?? [])
    .map((t) => `${t.label}: ${t.value}`)
    .join("\n");
  const documentsText = (project?.documents ?? [])
    .map((d) => `${d.label}: ${d.url}`)
    .join("\n");

  return (
    <form action={formAction} className="space-y-6">
      {project?.id ? <input type="hidden" name="id" value={project.id} /> : null}

      {state.status !== "idle" && state.message ? (
        <FormStatusAlert
          status={state.status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

      {/* Tabs */}
      <div className="border-b border-warm-border">
        <nav className="-mb-px flex flex-wrap gap-1" aria-label="Proje sekmeleri">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-body-sm font-semibold transition-colors",
                activeTab === tab.id
                  ? "border-forest-emerald text-forest-emerald"
                  : "border-transparent text-slate hover:text-forest-emerald",
              )}
            >
              <Icon name={tab.icon} className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Genel Bilgiler */}
      <div hidden={activeTab !== "general"} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            name="title"
            label="Proje Adı"
            required
            defaultValue={project?.title}
            errors={errors}
            onChange={(v) => {
              if (!slugEdited) setSlug(slugify(v));
            }}
          />
          <TextField
            name="slug"
            label="URL Slug"
            required
            value={slug}
            onChange={(v) => {
              setSlug(v);
              setSlugEdited(true);
            }}
            errors={errors}
            hint="Örn: kazanim-yasam-evleri"
          />
        </div>
        <TextField name="slogan" label="Slogan" defaultValue={project?.slogan} errors={errors} />
        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            name="status"
            label="Proje Durumu"
            options={STATUS_OPTIONS}
            defaultValue={project?.status ?? "ONGOING"}
            errors={errors}
          />
          <SelectField
            name="publishStatus"
            label="Yayın Durumu"
            options={PUBLISH_OPTIONS}
            defaultValue={project?.publishStatus ?? "DRAFT"}
            errors={errors}
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            name="type"
            label="Proje Tipi"
            defaultValue={project?.type}
            errors={errors}
            hint="Örn: Konut, Ticari, Karma"
          />
          <TextField name="location" label="Konum" defaultValue={project?.location} errors={errors} />
        </div>
        <TextField
          name="mapsUrl"
          label="Google Maps Linki"
          defaultValue={project?.mapsUrl}
          errors={errors}
        />
        <TextAreaField
          name="shortDescription"
          label="Kısa Açıklama"
          defaultValue={project?.shortDescription}
          errors={errors}
          rows={2}
          className="font-sans"
          hint="Proje kartlarında görünen özet."
        />
        <TextAreaField
          name="description"
          label="Detaylı Açıklama"
          defaultValue={project?.description}
          errors={errors}
          rows={8}
          className="font-sans"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            name="startDate"
            label="Başlangıç Tarihi"
            type="date"
            defaultValue={project?.startDate}
            errors={errors}
          />
          <TextField
            name="deliveryDate"
            label="Teslim Tarihi"
            type="date"
            defaultValue={project?.deliveryDate}
            errors={errors}
          />
        </div>
        <div className="grid items-end gap-5 md:grid-cols-2">
          <TextField
            name="sortOrder"
            label="Sıralama"
            type="number"
            defaultValue={project?.sortOrder ?? 0}
            errors={errors}
            hint="Küçük değer önce gösterilir."
          />
          <CheckboxField
            name="isFeatured"
            label="Öne çıkan proje"
            defaultChecked={project?.isFeatured}
            hint="Ana sayfada vitrinde gösterilir."
          />
        </div>
      </div>

      {/* Görseller */}
      <div hidden={activeTab !== "media"} className="space-y-5">
        <ImageUpload
          name="coverImage"
          label="Kapak Görseli"
          defaultValue={project?.coverImage}
          hint="Proje kartı ve detay sayfasının üst görseli."
        />
        <TextAreaField
          name="galleryLines"
          label="Galeri Görselleri"
          defaultValue={galleryText}
          rows={6}
          hint="Her satıra bir görsel URL'si girin."
        />
        <TextField
          name="videoUrl"
          label="Video URL"
          defaultValue={project?.videoUrl}
          errors={errors}
          hint="YouTube veya Vimeo bağlantısı (opsiyonel)."
        />
      </div>

      {/* Proje Özellikleri */}
      <div hidden={activeTab !== "features"} className="space-y-5">
        <TextAreaField
          name="featuresText"
          label="Öne Çıkan Özellikler"
          defaultValue={featuresText}
          rows={6}
          hint="Her satıra bir özellik girin."
        />
        <TextAreaField
          name="technicalDetailsText"
          label="Teknik Detaylar"
          defaultValue={technicalDetailsText}
          rows={6}
          hint='Her satır "Etiket: Değer" biçiminde. Örn: Toplam Alan: 45.000 m²'
        />
        <TextAreaField
          name="documentsText"
          label="Dokümanlar"
          defaultValue={documentsText}
          rows={4}
          hint='Her satır "Belge Adı: /url/dosya.pdf" biçiminde.'
        />
      </div>

      {/* İlerleme */}
      <div hidden={activeTab !== "progress"} className="space-y-5">
        <TextField
          name="progressOverall"
          label="Genel İlerleme (%)"
          type="number"
          defaultValue={project?.progressOverall ?? 0}
          errors={errors}
          hint="0 ile 100 arası."
        />
        <TextAreaField
          name="progressItemsText"
          label="İlerleme Kalemleri"
          defaultValue={progressItemsText}
          rows={6}
          hint='Her satır "Etiket: 65" biçiminde. Örn: Kaba İnşaat: 90'
        />
      </div>

      {/* SEO */}
      <div hidden={activeTab !== "seo"}>
        <SEOFields values={project} errors={errors} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-border pt-6">
        <div className="flex items-center gap-3">
          <SubmitButton icon={isEdit ? "save" : "plus"}>
            {isEdit ? "Değişiklikleri Kaydet" : "Projeyi Oluştur"}
          </SubmitButton>
          <Link
            href="/admin/projects"
            className="inline-flex items-center border border-warm-border bg-white px-5 py-2.5 text-body-sm font-semibold text-slate transition-colors hover:border-forest-emerald hover:text-forest-emerald"
          >
            İptal
          </Link>
        </div>
        {isEdit && project?.id ? (
          <DeleteButton id={project.id} action={deleteProjectAction} label="Projeyi Sil" />
        ) : null}
      </div>
    </form>
  );
}
