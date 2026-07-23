"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { TextAreaField, TextField } from "@/components/admin/form-fields";

type SeoValues = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
};

/**
 * Shared SEO field block for projects, news and pages.
 * `showKeywords` toggles the keywords field (pages only).
 */
export function SEOFields({
  values,
  errors,
  showKeywords = false,
}: {
  values?: SeoValues;
  errors?: Record<string, string>;
  showKeywords?: boolean;
}) {
  return (
    <div className="space-y-5">
      <TextField
        name="seoTitle"
        label="SEO Başlığı"
        defaultValue={values?.seoTitle}
        errors={errors}
        hint="Boş bırakılırsa sayfa başlığı kullanılır."
      />
      <TextAreaField
        name="seoDescription"
        label="Meta Açıklaması"
        defaultValue={values?.seoDescription}
        errors={errors}
        rows={3}
        className="font-sans"
        hint="Önerilen uzunluk: 150–160 karakter."
      />
      {showKeywords ? (
        <TextField
          name="seoKeywords"
          label="Anahtar Kelimeler"
          defaultValue={values?.seoKeywords}
          errors={errors}
          hint="Virgülle ayırın."
        />
      ) : null}
      <ImageUpload
        name="ogImage"
        label="Paylaşım Görseli (OG Image)"
        defaultValue={values?.ogImage}
        hint="Sosyal medyada paylaşımlarda görünür (önerilen 1200×630)."
      />
      <TextField
        name="canonicalUrl"
        label="Canonical URL"
        defaultValue={values?.canonicalUrl}
        errors={errors}
        hint="Boş bırakılabilir; otomatik oluşturulur."
      />
      <TextField
        name="robots"
        label="Robots"
        defaultValue={values?.robots ?? "index, follow"}
        errors={errors}
        hint="Örn: index, follow — indekslememek için: noindex, nofollow"
      />
    </div>
  );
}
