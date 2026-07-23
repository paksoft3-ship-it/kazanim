"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import {
  jobPositionSchema,
  mediaSchema,
  newsSchema,
  pageSchema,
  projectSchema,
} from "@/lib/validators";
import {
  checkbox,
  fail,
  formToObject,
  guard,
  labelValueLines,
  lines,
  nullify,
  ok,
  progressLines,
  toDate,
  toFieldErrors,
  type ActionState,
} from "./shared";

/** Refresh the public routes affected by a content change. */
function revalidateProject(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projeler");
  revalidatePath("/projeler/devam-eden");
  revalidatePath("/projeler/tamamlanan");
  if (slug) revalidatePath(`/projeler/${slug}`);
  revalidatePath("/sitemap.xml");
}

function revalidateNews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/haberler");
  if (slug) revalidatePath(`/haberler/${slug}`);
  revalidatePath("/sitemap.xml");
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function saveProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));

  const parsed = projectSchema.safeParse({
    ...formToObject(formData),
    isFeatured: checkbox(formData, "isFeatured"),
  });

  if (!parsed.success) {
    return fail("Lütfen formdaki hatalı alanları düzeltin.", toFieldErrors(parsed.error));
  }

  const d = parsed.data;

  const data = {
    title: d.title,
    slug: d.slug,
    slogan: nullify(d.slogan),
    status: d.status,
    publishStatus: d.publishStatus,
    type: nullify(d.type),
    location: nullify(d.location),
    mapsUrl: nullify(d.mapsUrl),
    shortDescription: nullify(d.shortDescription),
    description: nullify(d.description),
    coverImage: nullify(d.coverImage),
    gallery: lines(formData, "galleryLines"),
    progressOverall: d.progressOverall ?? 0,
    progressItems: progressLines(formData, "progressItemsText"),
    features: lines(formData, "featuresText"),
    technicalDetails: labelValueLines(formData, "technicalDetailsText"),
    documents: labelValueLines(formData, "documentsText").map((entry) => ({
      label: entry.label,
      url: entry.value,
    })),
    videoUrl: nullify(d.videoUrl),
    startDate: toDate(d.startDate),
    deliveryDate: toDate(d.deliveryDate),
    isFeatured: d.isFeatured ?? false,
    sortOrder: d.sortOrder ?? 0,
    seoTitle: nullify(d.seoTitle),
    seoDescription: nullify(d.seoDescription),
    ogImage: nullify(d.ogImage),
    canonicalUrl: nullify(d.canonicalUrl),
    robots: nullify(d.robots) ?? "index, follow",
    publishedAt: d.publishStatus === "PUBLISHED" ? new Date() : null,
  };

  try {
    // Guard the unique slug so the user gets a field error, not a 500.
    const clash = await prisma.project.findFirst({
      where: { slug: d.slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) {
      return fail("Bu URL slug başka bir proje tarafından kullanılıyor.", {
        slug: "Bu slug zaten kullanımda.",
      });
    }

    if (id) {
      await prisma.project.update({ where: { id }, data });
    } else {
      await prisma.project.create({ data });
    }
  } catch (error) {
    console.error("[admin] saveProject failed:", error);
    return fail("Proje kaydedilemedi. Lütfen tekrar deneyin.");
  }

  revalidateProject(d.slug);
  revalidatePath("/admin/projects");
  return ok(id ? "Proje güncellendi." : "Proje oluşturuldu.");
}

export async function deleteProjectAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz proje.");

  try {
    const project = await prisma.project.delete({ where: { id }, select: { slug: true } });
    revalidateProject(project.slug);
  } catch (error) {
    console.error("[admin] deleteProject failed:", error);
    return fail("Proje silinemedi.");
  }

  revalidatePath("/admin/projects");
  return ok("Proje silindi.");
}

export async function toggleProjectFeaturedAction(formData: FormData): Promise<void> {
  const auth = await guard();
  if (!auth.ok) return;

  const id = nullify(formData.get("id"));
  if (!id) return;

  const project = await prisma.project.findUnique({
    where: { id },
    select: { isFeatured: true, slug: true },
  });
  if (!project) return;

  await prisma.project.update({
    where: { id },
    data: { isFeatured: !project.isFeatured },
  });

  revalidateProject(project.slug);
  revalidatePath("/admin/projects");
}

// ─── News ────────────────────────────────────────────────────────────────────

export async function saveNewsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));

  const parsed = newsSchema.safeParse({
    ...formToObject(formData),
    isFeatured: checkbox(formData, "isFeatured"),
  });

  if (!parsed.success) {
    return fail("Lütfen formdaki hatalı alanları düzeltin.", toFieldErrors(parsed.error));
  }

  const d = parsed.data;
  const publishedAt = toDate(d.publishedAt) ?? (d.status === "PUBLISHED" ? new Date() : null);

  try {
    const clash = await prisma.newsArticle.findFirst({
      where: { slug: d.slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) {
      return fail("Bu URL slug başka bir haber tarafından kullanılıyor.", {
        slug: "Bu slug zaten kullanımda.",
      });
    }

    const data = {
      title: d.title,
      slug: d.slug,
      excerpt: nullify(d.excerpt),
      content: nullify(d.content),
      coverImage: nullify(d.coverImage),
      category: nullify(d.category) ?? "Kurumsal",
      status: d.status,
      isFeatured: d.isFeatured ?? false,
      relatedProjectId: nullify(d.relatedProjectId),
      publishedAt,
      seoTitle: nullify(d.seoTitle),
      seoDescription: nullify(d.seoDescription),
      ogImage: nullify(d.ogImage),
      canonicalUrl: nullify(d.canonicalUrl),
      robots: nullify(d.robots) ?? "index, follow",
    };

    if (id) {
      await prisma.newsArticle.update({ where: { id }, data });
    } else {
      await prisma.newsArticle.create({ data });
    }
  } catch (error) {
    console.error("[admin] saveNews failed:", error);
    return fail("Haber kaydedilemedi. Lütfen tekrar deneyin.");
  }

  revalidateNews(d.slug);
  revalidatePath("/admin/news");
  return ok(id ? "Haber güncellendi." : "Haber oluşturuldu.");
}

export async function deleteNewsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz haber.");

  try {
    const article = await prisma.newsArticle.delete({ where: { id }, select: { slug: true } });
    revalidateNews(article.slug);
  } catch (error) {
    console.error("[admin] deleteNews failed:", error);
    return fail("Haber silinemedi.");
  }

  revalidatePath("/admin/news");
  return ok("Haber silindi.");
}

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function savePageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));

  const parsed = pageSchema.safeParse({
    ...formToObject(formData),
    showInMenu: checkbox(formData, "showInMenu"),
    showInFooter: checkbox(formData, "showInFooter"),
  });

  if (!parsed.success) {
    return fail("Lütfen formdaki hatalı alanları düzeltin.", toFieldErrors(parsed.error));
  }

  const d = parsed.data;

  // `content` is a JSON column edited as raw JSON in the admin. Reject invalid
  // JSON with a field error rather than silently discarding the editor's work.
  let content: unknown = undefined;
  const rawContent = nullify(d.content);
  if (rawContent) {
    try {
      content = JSON.parse(rawContent);
    } catch {
      return fail("İçerik alanı geçerli bir JSON değil.", {
        content: "Geçersiz JSON. Lütfen söz dizimini kontrol edin.",
      });
    }
  }

  try {
    const clash = await prisma.page.findFirst({
      where: { slug: d.slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) {
      return fail("Bu slug başka bir sayfa tarafından kullanılıyor.", {
        slug: "Bu slug zaten kullanımda.",
      });
    }

    const data = {
      title: d.title,
      slug: d.slug,
      status: d.status,
      heroTitle: nullify(d.heroTitle),
      heroSubtitle: nullify(d.heroSubtitle),
      heroImage: nullify(d.heroImage),
      ...(content !== undefined ? { content: content as object } : {}),
      showInMenu: d.showInMenu ?? false,
      showInFooter: d.showInFooter ?? false,
      sortOrder: d.sortOrder ?? 0,
      seoTitle: nullify(d.seoTitle),
      seoDescription: nullify(d.seoDescription),
      seoKeywords: nullify(d.seoKeywords),
      ogImage: nullify(d.ogImage),
      canonicalUrl: nullify(d.canonicalUrl),
      robots: nullify(d.robots) ?? "index, follow",
    };

    if (id) {
      await prisma.page.update({ where: { id }, data });
    } else {
      await prisma.page.create({ data });
    }
  } catch (error) {
    console.error("[admin] savePage failed:", error);
    return fail("Sayfa kaydedilemedi. Lütfen tekrar deneyin.");
  }

  revalidatePath(`/${d.slug}`);
  revalidatePath("/admin/pages");
  revalidatePath("/sitemap.xml");
  return ok(id ? "Sayfa güncellendi." : "Sayfa oluşturuldu.");
}

// ─── Media ───────────────────────────────────────────────────────────────────

export async function updateMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz görsel.");

  const parsed = mediaSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return fail("Lütfen formdaki hatalı alanları düzeltin.", toFieldErrors(parsed.error));
  }

  const d = parsed.data;

  try {
    await prisma.mediaAsset.update({
      where: { id },
      data: {
        title: nullify(d.title),
        altText: nullify(d.altText),
        description: nullify(d.description),
        category: nullify(d.category) ?? "genel",
        linkedProjectId: nullify(d.linkedProjectId),
        sortOrder: d.sortOrder ?? 0,
      },
    });
  } catch (error) {
    console.error("[admin] updateMedia failed:", error);
    return fail("Görsel güncellenemedi.");
  }

  revalidatePath("/galeri");
  revalidatePath("/admin/gallery");
  return ok("Görsel bilgileri güncellendi.");
}

export async function deleteMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz görsel.");

  try {
    const media = await prisma.mediaAsset.findUnique({
      where: { id },
      select: { url: true },
    });
    if (!media) return fail("Görsel bulunamadı.");

    // Warn instead of silently orphaning references from project covers.
    const usedByProject = await prisma.project.findFirst({
      where: { OR: [{ coverImage: media.url }, { ogImage: media.url }] },
      select: { title: true },
    });
    if (usedByProject) {
      return fail(
        `Bu görsel "${usedByProject.title}" projesinde kullanılıyor. Önce projeden kaldırın.`,
      );
    }

    await prisma.mediaAsset.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteMedia failed:", error);
    return fail("Görsel silinemedi.");
  }

  revalidatePath("/galeri");
  revalidatePath("/admin/gallery");
  return ok("Görsel silindi.");
}

// ─── Job positions ───────────────────────────────────────────────────────────

export async function saveJobPositionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));

  const parsed = jobPositionSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return fail("Lütfen formdaki hatalı alanları düzeltin.", toFieldErrors(parsed.error));
  }

  const d = parsed.data;

  try {
    const clash = await prisma.jobPosition.findFirst({
      where: { slug: d.slug, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) {
      return fail("Bu slug başka bir pozisyon tarafından kullanılıyor.", {
        slug: "Bu slug zaten kullanımda.",
      });
    }

    const data = {
      title: d.title,
      slug: d.slug,
      department: nullify(d.department),
      location: nullify(d.location),
      type: nullify(d.type),
      description: nullify(d.description),
      requirements: nullify(d.requirements),
      responsibilities: nullify(d.responsibilities),
      status: d.status,
      sortOrder: d.sortOrder ?? 0,
      publishedAt: d.status === "PUBLISHED" ? new Date() : null,
    };

    if (id) {
      await prisma.jobPosition.update({ where: { id }, data });
    } else {
      await prisma.jobPosition.create({ data });
    }
  } catch (error) {
    console.error("[admin] saveJobPosition failed:", error);
    return fail("Pozisyon kaydedilemedi.");
  }

  revalidatePath("/insan-kaynaklari");
  revalidatePath("/admin/hr");
  return ok(id ? "Pozisyon güncellendi." : "Pozisyon oluşturuldu.");
}

export async function deleteJobPositionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz pozisyon.");

  try {
    await prisma.jobPosition.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteJobPosition failed:", error);
    return fail("Pozisyon silinemedi.");
  }

  revalidatePath("/insan-kaynaklari");
  revalidatePath("/admin/hr");
  return ok("Pozisyon silindi.");
}
