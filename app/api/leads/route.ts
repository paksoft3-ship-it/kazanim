import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { sendFormNotification } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactFormSchema, fieldErrors, projectLeadFormSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public lead capture for the contact and project-information forms.
 *
 * Protections: Zod validation, honeypot field, per-IP rate limit.
 * The response deliberately returns only an opaque `leadId` — the client
 * pushes that to the dataLayer, so no PII ever reaches GTM/GA4/Ads.
 */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`leads:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "Çok fazla deneme yaptınız. Lütfen kısa bir süre sonra tekrar deneyin.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let raw: Record<string, unknown>;
  try {
    const formData = await request.formData();
    raw = Object.fromEntries(formData.entries());
  } catch {
    return NextResponse.json(
      { ok: false, message: "Geçersiz istek." },
      { status: 400 },
    );
  }

  // Checkbox arrives as "on" when ticked and is absent otherwise.
  const normalised = { ...raw, kvkk: raw.kvkk === "on" || raw.kvkk === "true" };
  const isProjectForm = raw.formType === "PROJECT_INFO";

  const schema = isProjectForm ? projectLeadFormSchema : contactFormSchema;
  const parsed = schema.safeParse(normalised);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Lütfen formdaki eksik veya hatalı alanları kontrol edin.",
        errors: fieldErrors(parsed.error as z.ZodError),
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot tripped — accept silently so bots do not learn they were caught.
  if (data.website) {
    return NextResponse.json({ ok: true, leadId: "ignored" });
  }

  try {
    // Only link a project that actually exists and is published.
    let projectId: string | null = null;
    if (isProjectForm) {
      const candidate =
        ("projectId" in data && data.projectId) ||
        null;
      const slug = ("projectSlug" in data && data.projectSlug) || null;

      const project = candidate
        ? await prisma.project.findUnique({ where: { id: String(candidate) }, select: { id: true } })
        : slug
          ? await prisma.project.findUnique({ where: { slug: String(slug) }, select: { id: true } })
          : null;
      projectId = project?.id ?? null;
    }

    const lead = await prisma.lead.create({
      data: {
        type: isProjectForm ? "PROJECT_INFO" : "CONTACT",
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        subject: "subject" in data ? data.subject || null : null,
        message: data.message || null,
        projectId,
        sourcePage: data.sourcePage || null,
        landingPage: data.landingPage || null,
        referrer: data.referrer || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmTerm: data.utmTerm || null,
        utmContent: data.utmContent || null,
        gclid: data.gclid || null,
        gbraid: data.gbraid || null,
        wbraid: data.wbraid || null,
        fbclid: data.fbclid || null,
        msclkid: data.msclkid || null,
      },
      select: { id: true },
    });

    // Fire-and-forget notification; never blocks or fails the submission.
    void sendFormNotification({
      subject: isProjectForm
        ? "Yeni Proje Bilgi Talebi — Kazanım Gayrimenkul"
        : "Yeni İletişim Formu Mesajı — Kazanım Gayrimenkul",
      lines: [
        ["Ad Soyad", data.name],
        ["Telefon", data.phone],
        ["E-posta", data.email || "—"],
        ["Mesaj", data.message || "—"],
        ["Kaynak Sayfa", data.sourcePage || "—"],
        ["Kampanya", data.utmCampaign || "—"],
      ],
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      message:
        "Talebiniz başarıyla iletildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.",
    });
  } catch (error) {
    console.error("[api/leads] failed to persist lead:", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Talebiniz kaydedilemedi. Lütfen daha sonra tekrar deneyin veya bizi telefonla arayın.",
      },
      { status: 500 },
    );
  }
}
