import { z } from "zod";

/** Turkish phone: accepts 05XX XXX XX XX, +90..., 0216... with any separators. */
const phoneSchema = z
  .string()
  .trim()
  .min(10, "Geçerli bir telefon numarası giriniz.")
  .max(25, "Telefon numarası çok uzun.")
  .refine((v) => (v.replace(/\D/g, "").length >= 10), {
    message: "Geçerli bir telefon numarası giriniz.",
  });

const nameSchema = z
  .string()
  .trim()
  .min(2, "Ad soyad en az 2 karakter olmalıdır.")
  .max(120, "Ad soyad çok uzun.");

const emailSchema = z
  .string()
  .trim()
  .email("Geçerli bir e-posta adresi giriniz.")
  .max(160, "E-posta adresi çok uzun.");

const messageSchema = z
  .string()
  .trim()
  .max(4000, "Mesaj en fazla 4000 karakter olabilir.");

const kvkkSchema = z.literal(true, {
  errorMap: () => ({ message: "Devam etmek için KVKK metnini onaylamanız gerekmektedir." }),
});

/** Honeypot: bots fill hidden fields, humans never see them. */
const honeypotSchema = z.string().max(0, "Geçersiz gönderim.").optional().or(z.literal(""));

/** Campaign attribution, captured client-side and sent with the form. */
export const attributionSchema = z.object({
  sourcePage: z.string().max(300).optional(),
  landingPage: z.string().max(300).optional(),
  referrer: z.string().max(500).optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  gclid: z.string().max(300).optional(),
  gbraid: z.string().max(300).optional(),
  wbraid: z.string().max(300).optional(),
  fbclid: z.string().max(300).optional(),
  msclkid: z.string().max(300).optional(),
});

// ─── Public forms ────────────────────────────────────────────────────────────

export const contactFormSchema = attributionSchema.extend({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional(),
  message: messageSchema.optional(),
  kvkk: kvkkSchema,
  website: honeypotSchema, // honeypot
});

export const projectLeadFormSchema = attributionSchema.extend({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal("")),
  projectId: z.string().cuid().optional().or(z.literal("")),
  projectSlug: z.string().max(200).optional(),
  message: messageSchema.optional(),
  kvkk: kvkkSchema,
  website: honeypotSchema,
});

export const careerFormSchema = attributionSchema.extend({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal("")),
  positionId: z.string().cuid().optional().or(z.literal("")),
  message: messageSchema.optional(),
  cvUrl: z.string().max(500).optional().or(z.literal("")),
  kvkk: kvkkSchema,
  website: honeypotSchema,
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ProjectLeadFormInput = z.infer<typeof projectLeadFormSchema>;
export type CareerFormInput = z.infer<typeof careerFormSchema>;

// ─── Admin ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır.").max(200),
  remember: z.boolean().optional(),
});

const seoFieldsSchema = {
  seoTitle: z.string().max(200).optional().or(z.literal("")),
  seoDescription: z.string().max(400).optional().or(z.literal("")),
  ogImage: z.string().max(500).optional().or(z.literal("")),
  canonicalUrl: z.string().max(500).optional().or(z.literal("")),
  robots: z.string().max(100).optional().or(z.literal("")),
};

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Proje adı zorunludur.").max(200),
  slug: z.string().trim().min(2, "URL slug zorunludur.").max(200)
    .regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  slogan: z.string().max(300).optional().or(z.literal("")),
  status: z.enum(["ONGOING", "COMPLETED", "UPCOMING"]),
  publishStatus: z.enum(["PUBLISHED", "DRAFT", "HIDDEN"]),
  type: z.string().max(120).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  mapsUrl: z.string().max(500).optional().or(z.literal("")),
  shortDescription: z.string().max(600).optional().or(z.literal("")),
  description: z.string().max(20000).optional().or(z.literal("")),
  coverImage: z.string().max(500).optional().or(z.literal("")),
  gallery: z.array(z.string().max(500)).optional(),
  progressOverall: z.coerce.number().int().min(0).max(100).optional(),
  progressItems: z.array(z.object({ label: z.string().max(120), value: z.coerce.number().min(0).max(100) })).optional(),
  features: z.array(z.string().max(300)).optional(),
  technicalDetails: z.array(z.object({ label: z.string().max(120), value: z.string().max(300) })).optional(),
  documents: z.array(z.object({ label: z.string().max(160), url: z.string().max(500) })).optional(),
  videoUrl: z.string().max(500).optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  deliveryDate: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  ...seoFieldsSchema,
});

export const newsSchema = z.object({
  title: z.string().trim().min(2, "Başlık zorunludur.").max(250),
  slug: z.string().trim().min(2).max(250).regex(/^[a-z0-9-]+$/, "Geçersiz slug."),
  excerpt: z.string().max(600).optional().or(z.literal("")),
  content: z.string().max(50000).optional().or(z.literal("")),
  coverImage: z.string().max(500).optional().or(z.literal("")),
  category: z.string().max(120).optional().or(z.literal("")),
  status: z.enum(["PUBLISHED", "DRAFT", "HIDDEN"]),
  isFeatured: z.boolean().optional(),
  relatedProjectId: z.string().optional().or(z.literal("")),
  publishedAt: z.string().optional().or(z.literal("")),
  ...seoFieldsSchema,
});

export const pageSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(1).max(200),
  status: z.enum(["PUBLISHED", "DRAFT", "HIDDEN"]),
  heroTitle: z.string().max(300).optional().or(z.literal("")),
  heroSubtitle: z.string().max(600).optional().or(z.literal("")),
  heroImage: z.string().max(500).optional().or(z.literal("")),
  content: z.string().max(100000).optional().or(z.literal("")),
  showInMenu: z.boolean().optional(),
  showInFooter: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  seoKeywords: z.string().max(500).optional().or(z.literal("")),
  ...seoFieldsSchema,
});

export const mediaSchema = z.object({
  title: z.string().max(200).optional().or(z.literal("")),
  altText: z.string().max(300).optional().or(z.literal("")),
  description: z.string().max(600).optional().or(z.literal("")),
  category: z.string().max(120).optional().or(z.literal("")),
  linkedProjectId: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().optional(),
});

export const jobPositionSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Geçersiz slug."),
  department: z.string().max(120).optional().or(z.literal("")),
  location: z.string().max(160).optional().or(z.literal("")),
  type: z.string().max(120).optional().or(z.literal("")),
  description: z.string().max(10000).optional().or(z.literal("")),
  requirements: z.string().max(10000).optional().or(z.literal("")),
  responsibilities: z.string().max(10000).optional().or(z.literal("")),
  status: z.enum(["PUBLISHED", "DRAFT", "HIDDEN"]),
  sortOrder: z.coerce.number().int().optional(),
});

export const userSchema = z.object({
  name: z.string().trim().min(2, "İsim zorunludur.").max(120),
  email: emailSchema,
  password: z.string().min(8, "Şifre en az 8 karakter olmalıdır.").max(200).optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "SALES", "HR", "VIEWER"]),
  isActive: z.boolean().optional(),
});

export const leadUpdateSchema = z.object({
  status: z.enum(["NEW", "READ", "IN_PROGRESS", "DONE", "ARCHIVED"]).optional(),
  internalNotes: z.string().max(4000).optional().or(z.literal("")),
});

export const applicationUpdateSchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "SUITABLE", "NOT_SUITABLE", "ARCHIVED"]).optional(),
  internalNotes: z.string().max(4000).optional().or(z.literal("")),
});

export const siteSettingsSchema = z.record(z.string().max(120), z.string().max(20000));

/** Flatten a ZodError into a `{ field: message }` map for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
