import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { slugify } from "@/lib/utils";

export type StoredFile = {
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
};

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml",
];
const ALLOWED_DOC_TYPES = ["application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export class UploadError extends Error {}

function assertAllowed(file: File, kind: "image" | "document") {
  const allowed = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOC_TYPES;
  if (!allowed.includes(file.type)) {
    throw new UploadError(
      kind === "image"
        ? "Yalnızca JPG, PNG, WEBP, AVIF veya SVG görseller yüklenebilir."
        : "Yalnızca PDF dosyası yüklenebilir.",
    );
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Dosya boyutu en fazla 10 MB olabilir.");
  }
}

function safeName(original: string): string {
  const ext = path.extname(original).toLowerCase().slice(0, 10);
  const base = slugify(path.basename(original, path.extname(original))) || "dosya";
  return `${base}-${randomUUID().slice(0, 8)}${ext}`;
}

/**
 * Storage adapter.
 *  - Production: Vercel Blob when BLOB_READ_WRITE_TOKEN is configured.
 *  - Development fallback: local /public/uploads.
 */
export async function storeFile(
  file: File,
  kind: "image" | "document" = "image",
  folder = "uploads",
): Promise<StoredFile> {
  assertAllowed(file, kind);

  const fileName = safeName(file.name);
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`${folder}/${fileName}`, file, {
      access: "public",
      token,
      contentType: file.type,
    });
    return { url: blob.url, fileName, size: file.size, mimeType: file.type };
  }

  // Local fallback — development only.
  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);

  return {
    url: `/uploads/${fileName}`,
    fileName,
    size: file.size,
    mimeType: file.type,
  };
}

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
