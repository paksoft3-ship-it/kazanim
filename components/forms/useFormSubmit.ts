"use client";

import { useCallback, useRef, useState } from "react";

import { getAttribution } from "@/lib/tracking";
import {
  trackFormError,
  trackFormStart,
  trackFormSubmit,
  type EventPayload,
  type FormKind,
} from "@/lib/tracking";

type SubmitState = {
  status: "idle" | "pending" | "success" | "error";
  message: string;
  errors: Record<string, string>;
};

const INITIAL: SubmitState = { status: "idle", message: "", errors: {} };

type Options = {
  kind: FormKind;
  endpoint: string;
  /** Extra dataLayer context (project slug, form location, …). Never PII. */
  trackingContext?: EventPayload;
  successMessage?: string;
};

/**
 * Shared submit handler for the three public forms.
 *
 * Responsibilities:
 *  - fire `*_form_start` once, on first interaction
 *  - attach first-touch UTM/gclid attribution to the payload
 *  - POST as FormData (so the career form's CV upload works unchanged)
 *  - fire `*_form_submit` + `lead_form_submit` with the server's lead_id
 *  - surface Zod field errors back onto the inputs
 */
export function useFormSubmit({
  kind,
  endpoint,
  trackingContext = {},
  successMessage = "Talebiniz başarıyla iletildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
}: Options) {
  const [state, setState] = useState<SubmitState>(INITIAL);
  const startedRef = useRef(false);

  const handleStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackFormStart(kind, trackingContext);
  }, [kind, trackingContext]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      setState({ status: "pending", message: "", errors: {} });

      try {
        const formData = new FormData(form);

        // Attach first-touch campaign attribution + source page (no PII).
        // Keys are mapped to the camelCase field names the API schema expects.
        const attribution = getAttribution();
        const fieldByAttribution: Record<string, string> = {
          utm_source: "utmSource",
          utm_medium: "utmMedium",
          utm_campaign: "utmCampaign",
          utm_term: "utmTerm",
          utm_content: "utmContent",
          gclid: "gclid",
          gbraid: "gbraid",
          wbraid: "wbraid",
          fbclid: "fbclid",
          msclkid: "msclkid",
          landing_page: "landingPage",
          referrer: "referrer",
        };
        for (const [key, value] of Object.entries(attribution)) {
          const field = fieldByAttribution[key];
          if (field && value) formData.set(field, value);
        }
        formData.set("sourcePage", window.location.pathname);

        const response = await fetch(endpoint, { method: "POST", body: formData });
        const result = (await response.json()) as {
          ok: boolean;
          leadId?: string;
          message?: string;
          errors?: Record<string, string>;
        };

        if (!response.ok || !result.ok) {
          const message = result.message ?? "Gönderim sırasında bir hata oluştu.";
          setState({
            status: "error",
            message,
            errors: result.errors ?? {},
          });
          trackFormError(kind, result.errors ? "validation" : "server", trackingContext);
          return;
        }

        // Success: push the conversion events, then reset the form.
        trackFormSubmit(kind, result.leadId ?? "unknown", trackingContext);
        setState({ status: "success", message: result.message ?? successMessage, errors: {} });
        form.reset();
        startedRef.current = false;
      } catch {
        setState({
          status: "error",
          message: "Bağlantı hatası. Lütfen daha sonra tekrar deneyin.",
          errors: {},
        });
        trackFormError(kind, "network", trackingContext);
      }
    },
    [endpoint, kind, successMessage, trackingContext],
  );

  return { state, handleSubmit, handleStart };
}
