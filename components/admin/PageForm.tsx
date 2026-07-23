"use client";

import Link from "next/link";
import { useActionState } from "react";

import { savePageAction } from "@/app/admin/_actions/content";
import type { ActionState } from "@/app/admin/_actions/shared";
import { FormStatusAlert } from "@/components/admin/AdminUI";
import { SubmitButton } from "@/components/admin/DeleteButton";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SEOFields } from "@/components/admin/SEOFields";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";

const IDLE: ActionState = { status: "idle", message: "" };

export type PageFormValues = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  status?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: string | null;
  content?: string | null;
  showInMenu?: boolean;
  showInFooter?: boolean;
  sortOrder?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
};

const STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "Yayında" },
  { value: "DRAFT", label: "Taslak" },
  { value: "HIDDEN", label: "Gizli" },
];

export function PageForm({ page }: { page?: PageFormValues }) {
  const [state, formAction] = useActionState(savePageAction, IDLE);
  const isEdit = Boolean(page?.id);
  const errors = state.errors;

  return (
    <form action={formAction} className="space-y-6">
      {page?.id ? <input type="hidden" name="id" value={page.id} /> : null}

      {state.status !== "idle" && state.message ? (
        <FormStatusAlert
          status={state.status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">Genel Bilgiler</h2>
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <TextField
                  name="title"
                  label="Sayfa Başlığı"
                  required
                  defaultValue={page?.title}
                  errors={errors}
                />
                <TextField
                  name="slug"
                  label="URL Slug"
                  required
                  defaultValue={page?.slug}
                  errors={errors}
                  hint="Örn: kurumsal/hakkimizda"
                />
              </div>
            </div>
          </div>

          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">Hero Bölümü</h2>
            <div className="space-y-5">
              <TextField
                name="heroTitle"
                label="Hero Başlığı"
                defaultValue={page?.heroTitle}
                errors={errors}
              />
              <TextAreaField
                name="heroSubtitle"
                label="Hero Alt Başlığı"
                defaultValue={page?.heroSubtitle}
                errors={errors}
                rows={2}
                className="font-sans"
              />
              <ImageUpload name="heroImage" label="Hero Görseli" defaultValue={page?.heroImage} />
            </div>
          </div>

          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-2 font-semibold text-charcoal">İçerik Blokları (JSON)</h2>
            <p className="mb-4 text-[12px] text-slate">
              Sayfa bölümleri JSON olarak düzenlenir. Geçerli bir JSON girin veya boş bırakın.
            </p>
            <TextAreaField
              name="content"
              label="İçerik (JSON)"
              defaultValue={page?.content}
              errors={errors}
              rows={12}
            />
          </div>

          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">SEO Ayarları</h2>
            <SEOFields values={page} errors={errors} showKeywords />
          </div>
        </div>

        <div className="space-y-5">
          <div className="border border-warm-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-charcoal">Yayın ve Görünürlük</h2>
            <div className="space-y-5">
              <SelectField
                name="status"
                label="Durum"
                options={STATUS_OPTIONS}
                defaultValue={page?.status ?? "PUBLISHED"}
                errors={errors}
              />
              <TextField
                name="sortOrder"
                label="Sıralama"
                type="number"
                defaultValue={page?.sortOrder ?? 0}
                errors={errors}
              />
              <CheckboxField
                name="showInMenu"
                label="Menüde göster"
                defaultChecked={page?.showInMenu}
              />
              <CheckboxField
                name="showInFooter"
                label="Footer'da göster"
                defaultChecked={page?.showInFooter}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-warm-border pt-6">
        <SubmitButton icon={isEdit ? "save" : "plus"}>
          {isEdit ? "Değişiklikleri Kaydet" : "Sayfayı Oluştur"}
        </SubmitButton>
        <Link
          href="/admin/pages"
          className="inline-flex items-center border border-warm-border bg-white px-5 py-2.5 text-body-sm font-semibold text-slate transition-colors hover:border-forest-emerald hover:text-forest-emerald"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
