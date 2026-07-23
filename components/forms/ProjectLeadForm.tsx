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

export type ProjectOption = { id: string; title: string; slug: string };

export function ProjectLeadForm({
  projects,
  currentProject,
  tone = "light",
  formLocation = "project_detail_sidebar",
}: {
  projects: ProjectOption[];
  /** When rendered on a project detail page, that project is preselected. */
  currentProject?: ProjectOption;
  tone?: "light" | "dark";
  formLocation?: string;
}) {
  const { state, handleSubmit, handleStart } = useFormSubmit({
    kind: "project",
    endpoint: "/api/leads",
    trackingContext: {
      form_location: formLocation,
      lead_type: "project_info",
      ...(currentProject
        ? {
            project_id: currentProject.id,
            project_slug: currentProject.slug,
            project_name: currentProject.title,
          }
        : {}),
    },
  });

  const { errors, status } = state;

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
      <Honeypot />
      <input type="hidden" name="formType" value="PROJECT_INFO" />
      {currentProject ? (
        <input type="hidden" name="projectSlug" value={currentProject.slug} />
      ) : null}

      {status !== "idle" && state.message ? (
        <FormStatusAlert
          status={status === "success" ? "success" : "error"}
          message={state.message}
        />
      ) : null}

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
        label="İlgilendiğiniz Proje"
        name="projectId"
        tone={tone}
        placeholder="Proje seçiniz"
        defaultValue={currentProject?.id}
        options={projects.map((project) => ({ value: project.id, label: project.title }))}
        error={errors.projectId}
        onFocus={handleStart}
      />

      <TextAreaField
        label="Mesajınız"
        name="message"
        tone={tone}
        rows={4}
        placeholder="Proje hakkında öğrenmek istedikleriniz"
        error={errors.message}
        onFocus={handleStart}
      />

      <KvkkCheckbox tone={tone} error={errors.kvkk} />

      <SubmitButton
        pending={status === "pending"}
        label="Bilgi Talep Et"
        tone={tone}
      />
    </form>
  );
}
