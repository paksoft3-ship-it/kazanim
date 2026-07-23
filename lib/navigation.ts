export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/** Public header navigation, per the brief. */
export const MAIN_NAV: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  {
    label: "Kurumsal",
    href: "/kurumsal/hakkimizda",
    children: [
      { label: "Hakkımızda", href: "/kurumsal/hakkimizda" },
      { label: "Tarihçemiz", href: "/kurumsal/tarihcemiz" },
      { label: "Vizyon ve Misyon", href: "/kurumsal/vizyon-misyon" },
      { label: "Kalite Politikamız", href: "/kurumsal/kalite-politikamiz" },
      { label: "Faaliyet Alanları", href: "/kurumsal/faaliyet-alanlari" },
    ],
  },
  {
    label: "Projeler",
    href: "/projeler",
    children: [
      { label: "Tüm Projeler", href: "/projeler" },
      { label: "Devam Eden Projeler", href: "/projeler/devam-eden" },
      { label: "Tamamlanan Projeler", href: "/projeler/tamamlanan" },
    ],
  },
  { label: "Galeri", href: "/galeri" },
  { label: "Haberler", href: "/haberler" },
  { label: "İnsan Kaynakları", href: "/insan-kaynaklari" },
  { label: "İletişim", href: "/iletisim" },
];

export const FOOTER_QUICK_LINKS: NavItem[] = [
  { label: "Hakkımızda", href: "/kurumsal/hakkimizda" },
  { label: "Vizyon ve Misyon", href: "/kurumsal/vizyon-misyon" },
  { label: "Faaliyet Alanları", href: "/kurumsal/faaliyet-alanlari" },
  { label: "Haberler", href: "/haberler" },
  { label: "İnsan Kaynakları", href: "/insan-kaynaklari" },
  { label: "İletişim", href: "/iletisim" },
];

export const FOOTER_PROJECT_LINKS: NavItem[] = [
  { label: "Tüm Projeler", href: "/projeler" },
  { label: "Devam Eden Projeler", href: "/projeler/devam-eden" },
  { label: "Tamamlanan Projeler", href: "/projeler/tamamlanan" },
  { label: "Galeri", href: "/galeri" },
];

export const LEGAL_LINKS: NavItem[] = [
  { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
  { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
];

/** Admin sidebar, per the brief. */
export const ADMIN_NAV: Array<{ label: string; href: string; icon: string }> = [
  { label: "Genel Bakış", href: "/admin", icon: "dashboard" },
  { label: "Projeler", href: "/admin/projects", icon: "domain" },
  { label: "Galeri", href: "/admin/gallery", icon: "photo_library" },
  { label: "Haberler", href: "/admin/news", icon: "newspaper" },
  { label: "Sayfalar", href: "/admin/pages", icon: "description" },
  { label: "Form Talepleri", href: "/admin/forms", icon: "inbox" },
  { label: "İnsan Kaynakları", href: "/admin/hr", icon: "badge" },
  { label: "Site Ayarları", href: "/admin/site-settings", icon: "settings" },
  { label: "Kullanıcılar", href: "/admin/users", icon: "group" },
  { label: "SEO Ayarları", href: "/admin/seo", icon: "travel_explore" },
];

/** Turkish display labels for enum values. */
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  ONGOING: "Devam Eden",
  COMPLETED: "Tamamlanan",
  UPCOMING: "Yakında",
};

export const CONTENT_STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Yayında",
  DRAFT: "Taslak",
  HIDDEN: "Gizli",
};

export const LEAD_TYPE_LABELS: Record<string, string> = {
  CONTACT: "İletişim Formu",
  PROJECT_INFO: "Proje Bilgi Talebi",
  APPOINTMENT: "Randevu Talebi",
  PHONE: "Telefon",
  WHATSAPP: "WhatsApp",
  CAREER: "Kariyer",
  OTHER: "Diğer",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "Yeni",
  READ: "Okundu",
  IN_PROGRESS: "İşlemde",
  DONE: "Tamamlandı",
  ARCHIVED: "Arşivlendi",
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  NEW: "Yeni",
  REVIEWED: "İncelendi",
  SUITABLE: "Uygun",
  NOT_SUITABLE: "Uygun Değil",
  ARCHIVED: "Arşivlendi",
};

export const USER_ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Süper Yönetici",
  ADMIN: "Yönetici",
  EDITOR: "Editör",
  SALES: "Satış",
  HR: "İnsan Kaynakları",
  VIEWER: "Görüntüleyici",
};
