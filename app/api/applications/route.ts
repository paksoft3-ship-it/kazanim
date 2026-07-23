import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { sendFormNotification } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { storeFile, UploadError } from "@/lib/storage";
import { careerFormSchema, fieldErrors } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public career applications, including optional CV upload. */
export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`applications:${ip}`, 3);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "Çok fazla deneme yaptınız. Lütfen kısa bir süre sonra tekrar deneyin.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Geçersiz istek." }, { status: 400 });
  }

  const cvFile = formData.get("cv");
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => key !== "cv"),
  );
  const normalised = { ...raw, kvkk: raw.kvkk === "on" || raw.kvkk === "true" };

  const parsed = careerFormSchema.safeParse(normalised);
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

  if (data.website) {
    return NextResponse.json({ ok: true, leadId: "ignored" });
  }

  // Optional CV upload.
  let cvUrl: string | null = null;
  if (cvFile instanceof File && cvFile.size > 0) {
    try {
      const stored = await storeFile(cvFile, "document", "cv");
      cvUrl = stored.url;
    } catch (error) {
      if (error instanceof UploadError) {
        return NextResponse.json(
          { ok: false, message: error.message, errors: { cv: error.message } },
          { status: 422 },
        );
      }
      console.error("[api/applications] CV upload failed:", error);
      return NextResponse.json(
        { ok: false, message: "CV yüklenirken bir hata oluştu. Lütfen tekrar deneyin." },
        { status: 500 },
      );
    }
  }

  try {
    const position = data.positionId
      ? await prisma.jobPosition.findUnique({
          where: { id: data.positionId },
          select: { id: true, title: true },
        })
      : null;

    const application = await prisma.jobApplication.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message || null,
        cvUrl,
        positionId: position?.id ?? null,
        sourcePage: data.sourcePage || null,
      },
      select: { id: true },
    });

    void sendFormNotification({
      subject: "Yeni İş Başvurusu — Kazanım Gayrimenkul",
      lines: [
        ["Ad Soyad", data.name],
        ["Telefon", data.phone],
        ["E-posta", data.email || "—"],
        ["Pozisyon", position?.title ?? "Genel Başvuru"],
        ["CV", cvUrl ? "Yüklendi" : "Yok"],
        ["Mesaj", data.message || "—"],
      ],
    });

    return NextResponse.json({
      ok: true,
      leadId: application.id,
      message:
        "Başvurunuz alınmıştır. İnsan kaynakları ekibimiz başvurunuzu değerlendirdikten sonra sizinle iletişime geçecektir.",
    });
  } catch (error) {
    console.error("[api/applications] failed to persist application:", error);
    return NextResponse.json(
      { ok: false, message: "Başvurunuz kaydedilemedi. Lütfen daha sonra tekrar deneyin." },
      { status: 500 },
    );
  }
}
