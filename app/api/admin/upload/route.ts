import { NextResponse } from "next/server";

import { requireWrite } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { storeFile, UploadError } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Authenticated image upload for the admin media library.
 *
 * Stores through the storage adapter (Vercel Blob in production, local
 * /public/uploads in development) and records a MediaAsset row so the file
 * is immediately usable from the gallery and image pickers.
 */
export async function POST(request: Request) {
  try {
    await requireWrite();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Bu işlem için yetkiniz bulunmuyor." },
      { status: 403 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Geçersiz istek." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { ok: false, message: "Yüklenecek dosya bulunamadı." },
      { status: 400 },
    );
  }

  const category = String(formData.get("category") || "genel");
  const linkedProjectId = String(formData.get("linkedProjectId") || "") || null;
  const altText = String(formData.get("altText") || "") || null;

  try {
    const stored = await storeFile(file, "image", "medya");

    const media = await prisma.mediaAsset.create({
      data: {
        fileName: stored.fileName,
        url: stored.url,
        mimeType: stored.mimeType,
        size: stored.size,
        category,
        altText,
        title: altText,
        linkedProjectId,
      },
      select: { id: true, url: true, fileName: true },
    });

    return NextResponse.json({ ok: true, media });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 422 });
    }
    console.error("[api/admin/upload] failed:", error);
    return NextResponse.json(
      { ok: false, message: "Dosya yüklenemedi. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
