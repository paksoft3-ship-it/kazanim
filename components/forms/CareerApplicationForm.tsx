"use client";

import {
  FileField,
  FormStatusAlert,
  Honeypot,
  KvkkCheckbox,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from "@/components/forms/Fields";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

export type PositionOption = { id: string; title: string };

export function CareerApplicationForm({
  positions,
  tone = "light",
}: {
  positions: PositionOption[];
  tone?: "light" | "dark";
}) {
  const { state, handleSubmit, handleStart } = useFormSubmit({
    kind: "career",
    endpoint: "/api/applications",
    trackingContext: { form_location: "career_page", lead_type: "career" },
    successMessage:
      "Başvurunuz alınmıştır. İnsan kaynakları ekibimiz başvurunuzu değerlendirdikten sonra sizinle iletişime geçecektir.",
  });

  const { errors, status } = state;

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
      <Honeypot />

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
          label="Başvurulan Pozisyon"
          name="positionId"
          tone={tone}
          placeholder="Pozisyon seçiniz"
          options={[
            ...positions.map((position) => ({ value: position.id, label: position.title })),
            { value: "", label: "Genel Başvuru" },
          ]}
          error={errors.positionId}
          onFocus={handleStart}
        />
      </div>

      <TextAreaField
        label="Ön Yazı / Mesaj"
        name="message"
        tone={tone}
        rows={5}
        placeholder="Kendinizden ve deneyimlerinizden kısaca bahsedin"
        error={errors.message}
        onFocus={handleStart}
      />

      <FileField
        label="CV (Opsiyonel)"
        name="cv"
        tone={tone}
        accept="application/pdf"
        hint="Yalnızca PDF, en fazla 10 MB."
        error={errors.cv}
      />

      <KvkkCheckbox tone={tone} error={errors.kvkk} />

      <SubmitButton
        pending={status === "pending"}
        label="Başvuruyu Gönder"
        tone={tone}
      />
    </form>
  );
}
