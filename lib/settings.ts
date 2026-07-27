import { cache } from "react";

import { prisma } from "@/lib/db";

/**
 * Every admin-editable global value. Defaults here are the fallback when the
 * database has no row yet, so the site always renders even before seeding.
 *
 * Contact details, statistics and social links deliberately default to empty:
 * Kazanım's official contact information has not been confirmed yet, and the
 * site must never publish guessed values. Empty values hide the related UI.
 */
export const SETTING_DEFAULTS = {
  // General
  companyName: "Kazanım Gayrimenkul",
  companyLegalName: "",
  // Horizontal lockups: dark (charcoal+gold) for light surfaces, light
  // (ivory+gold) for dark surfaces (header/footer/admin sidebar).
  logoPath: "/brand/kazanim-logo-horizontal.png",
  logoLightPath: "/brand/kazanim-logo-light.png",
  faviconPath: "/icon.png",
  footerDescription:
    "Kazanım Gayrimenkul; doğru lokasyonlarda, uzun vadeli değer üreten konut ve ticari projeler geliştirir. Şeffaf süreç yönetimi ve nitelikli mimariyle yatırımınıza kalıcı değer katar.",

  // Contact — intentionally empty until official details are confirmed
  phone: "",
  whatsappNumber: "",
  whatsappMessage: "Merhaba, Kazanım Gayrimenkul projeleri hakkında bilgi almak istiyorum.",
  email: "",
  address: "",
  mapsUrl: "",
  mapsEmbedUrl: "",
  workingHours: "",

  // Social — empty until official profiles exist
  instagramUrl: "",
  facebookUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",

  // Floating buttons
  floatingWhatsappEnabled: "true",
  floatingPhoneEnabled: "true",
  floatingDirectionsEnabled: "false",
  floatingFormEnabled: "true",

  // Homepage — hero
  heroEyebrow: "DEĞER KATAN PROJELER",
  heroTitle: "Doğru Konum. Güvenli Yatırım. Kalıcı Değer.",
  heroSubtitle:
    "Kazanım Gayrimenkul, İstanbul'un değer üreten lokasyonlarında seçkin yaşam alanları ve uzun vadeli yatırım fırsatları geliştirir.",
  heroImage: "/images/hero/anasayfa-hero.jpg",
  heroPrimaryCta: "Projeleri İncele",
  heroPrimaryCtaUrl: "/projeler",
  heroSecondaryCta: "Bilgi Al",
  heroSecondaryCtaUrl: "/iletisim",

  // Homepage — statistics strip.
  // Hidden by default: values are placeholders, not verified claims. An
  // administrator must review them and switch statsVisible to "true".
  statsVisible: "false",
  statCompletedValue: "",
  statCompletedLabel: "Tamamlanan Proje",
  statOngoingValue: "",
  statOngoingLabel: "Devam Eden Proje",
  statDeliveredValue: "",
  statDeliveredLabel: "Teslim Edilen Yaşam Alanı",
  statExperienceValue: "",
  statExperienceLabel: "Sektörel Tecrübe",

  // Homepage — section content and visibility
  aboutEyebrow: "HAKKIMIZDA",
  aboutTitle: "Güven, Şeffaflık ve Değer Odaklı Yaklaşım",
  aboutBody:
    "Kazanım Gayrimenkul, yatırımcılarına yalnızca gayrimenkul değil; güven, şeffaflık ve sürdürülebilir değer sunar. Lokasyon analizinden teslim sonrası iletişime kadar her aşamada doğru projeyi doğru yatırımcıyla buluşturmayı hedefleriz.",
  aboutImage: "/images/corporate/hakkimizda.jpg",
  aboutVisible: "true",
  featuredEyebrow: "ÖNE ÇIKAN PROJELER",
  featuredTitle: "Seçkin Lokasyonlarda Prestijli Yaşam Alanları",
  featuredVisible: "true",
  servicesEyebrow: "HİZMETLERİMİZ",
  servicesTitle: "Yatırımınız İçin Uçtan Uca Çözümler",
  servicesVisible: "true",
  trustEyebrow: "NEDEN KAZANIM GAYRİMENKUL?",
  trustTitle: "Değer Yaratan Yatırım Ortağınız",
  trustVisible: "true",
  processEyebrow: "YATIRIM SÜRECİMİZ",
  processTitle: "Doğru Adımlar, Güvenli Yatırım",
  processVisible: "true",
  newsEyebrow: "GÜNCEL HABERLER",
  newsTitle: "Piyasa Analizleri ve Sektörden Haberler",
  newsVisible: "true",
  leadFormEyebrow: "BİLGİ TALEBİ",
  leadFormTitle: "Yatırımınızı Birlikte Değerlendirelim",
  leadFormBody:
    "Size en uygun projeyi birlikte değerlendirmek için uzman ekibimizle iletişime geçin.",
  leadFormVisible: "true",
  finderVisible: "true",
  // Comma-separated homepage section order (admin-editable)
  homeSectionOrder: "about,featured,services,trust,process,news,leadform",

  // Global SEO — the production domain is configured via NEXT_PUBLIC_SITE_URL
  defaultSeoTitle: "Kazanım Gayrimenkul | Doğru Konum, Güvenli Yatırım, Kalıcı Değer",
  defaultSeoDescription:
    "Kazanım Gayrimenkul; doğru lokasyonlarda geliştirdiği konut ve ticari projelerle uzun vadeli değer üretir. İstanbul gayrimenkul projeleri ve yatırım fırsatları.",
  defaultOgImage: "/images/og/kazanim-og.jpg",
  googleSiteVerification: "",

  // Tracking (env takes precedence; these are the admin-editable fallback)
  gtmId: "",
  ga4Id: "",
  metaPixelId: "",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type SiteSettings = Record<SettingKey, string>;

/**
 * Load all settings merged over the defaults.
 * `cache()` dedupes within a single request/render pass.
 */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const merged = { ...SETTING_DEFAULTS } as Record<string, string>;
  try {
    const rows = await prisma.siteSetting.findMany();
    for (const row of rows) {
      if (row.value !== null && row.value !== undefined) merged[row.key] = row.value;
    }
  } catch {
    // Database unavailable (e.g. first build before migrate) — use defaults.
  }
  return merged as SiteSettings;
});

export function isEnabled(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

/** Group metadata used to lay out the Site Ayarları admin screen. */
export const SETTING_GROUPS: Array<{
  id: string;
  label: string;
  keys: SettingKey[];
}> = [
  {
    id: "general",
    label: "Genel Bilgiler",
    keys: ["companyName", "companyLegalName", "footerDescription"],
  },
  {
    id: "brand",
    label: "Logo ve Marka",
    keys: ["logoPath", "logoLightPath", "faviconPath"],
  },
  {
    id: "contact",
    label: "İletişim Bilgileri",
    keys: [
      "phone", "whatsappNumber", "whatsappMessage", "email",
      "address", "mapsUrl", "mapsEmbedUrl", "workingHours",
    ],
  },
  {
    id: "social",
    label: "Sosyal Medya",
    keys: ["instagramUrl", "facebookUrl", "linkedinUrl", "youtubeUrl"],
  },
  {
    id: "floating",
    label: "Yüzen Butonlar",
    keys: [
      "floatingWhatsappEnabled", "floatingPhoneEnabled",
      "floatingDirectionsEnabled", "floatingFormEnabled",
    ],
  },
  {
    id: "homepage",
    label: "Ana Sayfa — Hero",
    keys: [
      "heroEyebrow", "heroTitle", "heroSubtitle", "heroImage",
      "heroPrimaryCta", "heroPrimaryCtaUrl", "heroSecondaryCta", "heroSecondaryCtaUrl",
      "finderVisible",
    ],
  },
  {
    id: "stats",
    label: "Ana Sayfa — İstatistikler",
    keys: [
      "statsVisible",
      "statCompletedValue", "statCompletedLabel",
      "statOngoingValue", "statOngoingLabel",
      "statDeliveredValue", "statDeliveredLabel",
      "statExperienceValue", "statExperienceLabel",
    ],
  },
  {
    id: "sections",
    label: "Ana Sayfa — Bölümler",
    keys: [
      "homeSectionOrder",
      "aboutEyebrow", "aboutTitle", "aboutBody", "aboutImage", "aboutVisible",
      "featuredEyebrow", "featuredTitle", "featuredVisible",
      "servicesEyebrow", "servicesTitle", "servicesVisible",
      "trustEyebrow", "trustTitle", "trustVisible",
      "processEyebrow", "processTitle", "processVisible",
      "newsEyebrow", "newsTitle", "newsVisible",
      "leadFormEyebrow", "leadFormTitle", "leadFormBody", "leadFormVisible",
    ],
  },
  {
    id: "seo",
    label: "SEO ve Analitik",
    keys: [
      "defaultSeoTitle", "defaultSeoDescription", "defaultOgImage",
      "googleSiteVerification", "gtmId", "ga4Id", "metaPixelId",
    ],
  },
];

/** Human-readable Turkish labels for each setting key in the admin UI. */
export const SETTING_LABELS: Record<SettingKey, string> = {
  companyName: "Firma Adı",
  companyLegalName: "Resmi Unvan",
  logoPath: "Logo",
  logoLightPath: "Logo (açık zemin)",
  faviconPath: "Favicon",
  footerDescription: "Footer Açıklaması",
  phone: "Telefon",
  whatsappNumber: "WhatsApp Numarası (ülke koduyla)",
  whatsappMessage: "Varsayılan WhatsApp Mesajı",
  email: "E-posta",
  address: "Adres",
  mapsUrl: "Google Maps Yol Tarifi Linki",
  mapsEmbedUrl: "Google Maps Embed URL",
  workingHours: "Çalışma Saatleri",
  instagramUrl: "Instagram",
  facebookUrl: "Facebook",
  linkedinUrl: "LinkedIn",
  youtubeUrl: "YouTube",
  floatingWhatsappEnabled: "WhatsApp Butonu Aktif",
  floatingPhoneEnabled: "Ara Butonu Aktif",
  floatingDirectionsEnabled: "Yol Tarifi Butonu Aktif",
  floatingFormEnabled: "Bilgi Formu Butonu Aktif",
  heroEyebrow: "Hero Üst Başlık",
  heroTitle: "Hero Başlık",
  heroSubtitle: "Hero Açıklama",
  heroImage: "Hero Görseli",
  heroPrimaryCta: "Birincil Buton Metni",
  heroPrimaryCtaUrl: "Birincil Buton Linki",
  heroSecondaryCta: "İkincil Buton Metni",
  heroSecondaryCtaUrl: "İkincil Buton Linki",
  finderVisible: "Proje Arama Paneli Görünür",
  statsVisible: "İstatistikler Görünür (onaylanmadan açmayın)",
  statCompletedValue: "İstatistik 1 — Değer",
  statCompletedLabel: "İstatistik 1 — Etiket",
  statOngoingValue: "İstatistik 2 — Değer",
  statOngoingLabel: "İstatistik 2 — Etiket",
  statDeliveredValue: "İstatistik 3 — Değer",
  statDeliveredLabel: "İstatistik 3 — Etiket",
  statExperienceValue: "İstatistik 4 — Değer",
  statExperienceLabel: "İstatistik 4 — Etiket",
  aboutEyebrow: "Hakkımızda — Üst Başlık",
  aboutTitle: "Hakkımızda — Başlık",
  aboutBody: "Hakkımızda — Metin",
  aboutImage: "Hakkımızda — Görsel",
  aboutVisible: "Hakkımızda Bölümü Görünür",
  featuredEyebrow: "Öne Çıkan Projeler — Üst Başlık",
  featuredTitle: "Öne Çıkan Projeler — Başlık",
  featuredVisible: "Öne Çıkan Projeler Görünür",
  servicesEyebrow: "Hizmetler — Üst Başlık",
  servicesTitle: "Hizmetler — Başlık",
  servicesVisible: "Hizmetler Bölümü Görünür",
  trustEyebrow: "Güven Şeridi — Üst Başlık",
  trustTitle: "Güven Şeridi — Başlık",
  trustVisible: "Güven Şeridi Görünür",
  processEyebrow: "Süreç — Üst Başlık",
  processTitle: "Süreç — Başlık",
  processVisible: "Süreç Bölümü Görünür",
  newsEyebrow: "Haberler — Üst Başlık",
  newsTitle: "Haberler — Başlık",
  newsVisible: "Haberler Bölümü Görünür",
  leadFormEyebrow: "Bilgi Formu — Üst Başlık",
  leadFormTitle: "Bilgi Formu — Başlık",
  leadFormBody: "Bilgi Formu — Metin",
  leadFormVisible: "Bilgi Formu Bölümü Görünür",
  homeSectionOrder: "Bölüm Sıralaması (virgülle: about,featured,services,trust,process,news,leadform)",
  defaultSeoTitle: "Varsayılan SEO Başlığı",
  defaultSeoDescription: "Varsayılan Meta Açıklaması",
  defaultOgImage: "Varsayılan Paylaşım Görseli",
  googleSiteVerification: "Google Search Console Doğrulama Kodu",
  gtmId: "Google Tag Manager ID",
  ga4Id: "Google Analytics 4 ID",
  metaPixelId: "Meta Pixel ID",
};
