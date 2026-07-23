"use client";

import {
  FormStatusAlert,
  Honeypot,
  KvkkCheckbox,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/forms/Fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

const SUBJECT_OPTIONS = [
  { value: "Proje Bilgi Talebi", label: "Proje Bilgi Talebi" },
  { value: "Satış ve Yatırım", label: "Satış ve Yatırım" },
  { value: "Randevu Talebi", label: "Randevu Talebi" },
  { value: "Kurumsal İş Birliği", label: "Kurumsal İş Birliği" },
  { value: "Tedarikçi Başvurusu", label: "Tedarikçi Başvurusu" },
  { value: "Diğer", label: "Diğer" },
];

export function ContactForm({
  tone = "light",
  formLocation = "contact_page",
  compact = false,
  submitLabel = "Gönder",
}: {
  tone?: "light" | "dark";
  formLocation?: string;
  compact?: boolean;
  submitLabel?: string;
}) {
  const { state, handleSubmit, handleStart } = useFormSubmit({
    kind: "contact",
    endpoint: "/api/leads",
    trackingContext: { form_location: formLocation, lead_type: "contact" },
  });

  const { errors, status } = state;

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
      <Honeypot />
      <input type="hidden" name="formType" value="CONTACT" />

      {status !== "idle" && state.message ? (
        <FormStatusAlert
          status={status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="Ad Soyad"
          name="name"
          required
          tone={tone}
          autoComplete="name"
          placeholder="Adınız ve soyadınız"
          error={errors.name}
          onFocus={handleStart}
        />
        <TextField
          label="Telefon"
          name="phone"
          type="tel"
          required
          tone={tone}
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          error={errors.phone}
          onFocus={handleStart}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="E-posta"
          name="email"
          type="email"
          tone={tone}
          autoComplete="email"
          placeholder="ornek@eposta.com"
          error={errors.email}
          onFocus={handleStart}
        />
        <SelectField
          label="Talep Türü"
          name="subject"
          tone={tone}
          placeholder="Seçiniz"
          options={SUBJECT_OPTIONS}
          error={errors.subject}
          onFocus={handleStart}
        />
      </div>

      <TextAreaField
        label="Mesajınız"
        name="message"
        tone={tone}
        rows={compact ? 3 : 5}
        placeholder="Size nasıl yardımcı olabiliriz?"
        error={errors.message}
        onFocus={handleStart}
      />

      <KvkkCheckbox tone={tone} error={errors.kvkk} />

      <SubmitButton
        pending={status === "pending"}
        label={submitLabel}
        tone={tone}
      />
    </form>
  );
}
