"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { deleteNewsAction, saveNewsAction } from "@/app/admin/_actions/content";
import type { ActionState } from "@/app/admin/_actions/shared";
import { FormStatusAlert } from "@/components/admin/AdminUI";
import { DeleteButton, SubmitButton } from "@/components/admin/DeleteButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SEOFields } from "@/components/admin/SEOFields";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";
import { slugify } from "@/lib/utils";

const IDLE: ActionState = { status: "idle", message: "" };

export type NewsFormValues = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  category?: string | null;
  status?: string | null;
  isFeatured?: boolean;
  relatedProjectId?: string | null;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
};

const STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "Yayında" },
  { value: "DRAFT", label: "Taslak" },
  { value: "HIDDEN", label: "Gizli" },
];

export function NewsForm({
  news,
  projects,
}: {
  news?: NewsFormValues;
  projects: Array<{ id: string; title: string }>;
}) {
  const [state, formAction] = useActionState(saveNewsAction, IDLE);
  const isEdit = Boolean(news?.id);
  const [slug, setSlug] = useState(news?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(news?.slug));
  const errors = state.errors;

  const projectOptions = [
    { value: "", label: "İlişkili proje yok" },
    ...projects.map((p) => ({ value: p.id, label: p.title })),
  ];

  return (
    <form action={formAction} className="space-y-6">
      {news?.id ? <input type="hidden" name="id" value={news.id} /> : null}

      {state.status !== "idle" && state.message ? (
        <FormStatusAlert
          status={state.status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">İçerik</h2>
            <div className="space-y-5">
              <TextField
                name="title"
                label="Başlık"
                required
                defaultValue={news?.title}
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
              />
              <TextAreaField
                name="excerpt"
                label="Özet"
                defaultValue={news?.excerpt}
                errors={errors}
                rows={3}
                className="font-sans"
                hint="Haber kartlarında görünen kısa açıklama."
              />
              <TextAreaField
                name="content"
                label="İçerik"
                defaultValue={news?.content}
                errors={errors}
                rows={12}
                className="font-sans"
                hint="Haberin tam metni."
              />
            </div>
          </div>

          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">SEO Ayarları</h2>
            <SEOFields values={news} errors={errors} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">Yayın</h2>
            <div className="space-y-5">
              <SelectField
                name="status"
                label="Durum"
                options={STATUS_OPTIONS}
                defaultValue={news?.status ?? "DRAFT"}
                errors={errors}
              />
              <TextField
                name="publishedAt"
                label="Yayın Tarihi"
                type="date"
                defaultValue={news?.publishedAt}
                errors={errors}
                hint="Boş bırakılırsa yayına alındığında bugünün tarihi kullanılır."
              />
              <CheckboxField
                name="isFeatured"
                label="Öne çıkan haber"
                defaultChecked={news?.isFeatured}
              />
            </div>
          </div>

          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">Sınıflandırma</h2>
            <div className="space-y-5">
              <TextField
                name="category"
                label="Kategori"
                defaultValue={news?.category ?? "Kurumsal"}
                errors={errors}
                hint="Örn: Duyurular, Şantiye Günlüğü, Basında Biz"
              />
              <SelectField
                name="relatedProjectId"
                label="İlişkili Proje"
                options={projectOptions}
                defaultValue={news?.relatedProjectId ?? ""}
                errors={errors}
              />
            </div>
          </div>

          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">Kapak Görseli</h2>
            <ImageUpload name="coverImage" label="Görsel" defaultValue={news?.coverImage} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-border pt-6">
        <div className="flex items-center gap-3">
          <SubmitButton icon={isEdit ? "save" : "plus"}>
            {isEdit ? "Değişiklikleri Kaydet" : "Haberi Oluştur"}
          </SubmitButton>
          <Link
            href="/admin/news"
            className="inline-flex items-center border border-warm-border bg-white px-5 py-2.5 text-body-sm font-semibold text-slate transition-colors hover:border-forest-emerald hover:text-forest-emerald"
          >
            İptal
          </Link>
        </div>
        {isEdit && news?.id ? (
          <DeleteButton id={news.id} action={deleteNewsAction} label="Haberi Sil" />
        ) : null}
      </div>
    </form>
  );
}
