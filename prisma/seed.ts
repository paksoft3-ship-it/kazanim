/**
 * Kazanım Gayrimenkul — seed data.
 *
 * Content rules (see CLAUDE.md §7):
 *  - Turkish only, premium but natural language.
 *  - No unsupported claims. Statistics, dates and milestones are editable
 *    placeholders, not verified facts.
 *  - No ISO/TSE/award/certification claims.
 *  - Legal pages carry an admin-visible "review by legal counsel" notice.
 *  - Demo projects/news are examples only. They seed as PUBLISHED for local
 *    development, but demo seeding is skipped on production deployments
 *    (VERCEL_ENV=production) or when SEED_DEMO_CONTENT=false. The admin
 *    dashboard shows a demo-content banner while these records exist.
 *
 * Idempotent: safe to re-run. Uses upsert keyed on slug/email/key.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { SETTING_DEFAULTS } from "../lib/settings";

const prisma = new PrismaClient();

const LEGAL_NOTICE =
  "Bu metin taslak niteliğinde olup şirketin resmi hukuki danışmanı tarafından kontrol edilerek yayınlanmalıdır.";

const IS_PRODUCTION = process.env.VERCEL_ENV === "production";
const SEED_DEMO =
  process.env.SEED_DEMO_CONTENT === "true" ||
  (process.env.SEED_DEMO_CONTENT !== "false" && !IS_PRODUCTION);

// ─── Admin user ──────────────────────────────────────────────────────────────

async function seedAdminUser() {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (IS_PRODUCTION && (!envEmail || !envPassword)) {
    console.log(
      "  ⚠ ADMIN_EMAIL / ADMIN_PASSWORD tanımlı değil — üretim ortamında varsayılan yönetici OLUŞTURULMADI.",
    );
    return;
  }

  // Stored lowercase — loginAction() lowercases the submitted e-mail before lookup.
  const email = (envEmail || "admin@kazanim.local").toLowerCase();
  const password = envPassword || "KazanimDev123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Kazanım Yönetici",
      email,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log(`  ✓ Yönetici kullanıcı: ${email}`);
}

// ─── Site settings ───────────────────────────────────────────────────────────

const SETTING_GROUP_BY_PREFIX: Array<[RegExp, string]> = [
  [/^(company|footerDescription|logo|favicon)/, "general"],
  [/^(phone|whatsapp|email|address|maps|workingHours)/, "contact"],
  [/^(instagram|facebook|linkedin|youtube)/, "social"],
  [/^floating/, "floating"],
  [/^(hero|finder)/, "homepage"],
  [/^stat/, "stats"],
  [/^(about|featured|services|trust|process|news|leadForm|homeSection)/, "sections"],
  [/^(default|google|gtm|ga4|metaPixel)/, "seo"],
];

function groupFor(key: string): string {
  for (const [pattern, group] of SETTING_GROUP_BY_PREFIX) {
    if (pattern.test(key)) return group;
  }
  return "general";
}

async function seedSettings() {
  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value: String(value), group: groupFor(key) },
    });
  }
  // Flag for the admin demo-content banner; cleared when demo records are removed.
  await prisma.siteSetting.upsert({
    where: { key: "demoContentSeeded" },
    update: {},
    create: { key: "demoContentSeeded", value: SEED_DEMO ? "true" : "false", group: "general" },
  });
  console.log(`  ✓ Site ayarları: ${Object.keys(SETTING_DEFAULTS).length} kayıt`);
}

// ─── Projects (demo content) ─────────────────────────────────────────────────

const PROJECTS = [
  {
    title: "Kazanım Vadi",
    slug: "kazanim-vadi",
    slogan: "Vadi yeşiliyle iç içe, değer odaklı bir yaşam kurgusu.",
    status: "ONGOING" as const,
    type: "Konut Projesi",
    location: "Sarıyer, İstanbul",
    shortDescription:
      "Vadi manzarasıyla bütünleşen mimarisi ve geniş yaşam alanlarıyla geliştirilen konut projemiz. (Örnek içerik)",
    description:
      "Kazanım Vadi, doğayla iç içe bir yaşam kurgusunu modern mimariyle buluşturan bir konut projesidir. Daire planları gün ışığından en verimli şekilde yararlanacak biçimde tasarlanmış; ortak alanlar ise sakinlerin günlük yaşamına değer katacak şekilde planlanmıştır.\n\nProje, lokasyonun uzun vadeli değer üretme potansiyeli gözetilerek geliştirilmektedir. Teslim planı ve güncel ilerleme bilgisi bu sayfadan takip edilebilir.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    coverImage: "/images/projects/kazanim-vadi.jpg",
    progressOverall: 55,
    progressItems: [
      { label: "Kaba İnşaat", value: 80 },
      { label: "İnce İşler", value: 45 },
      { label: "Cephe Uygulaması", value: 50 },
      { label: "Peyzaj ve Çevre", value: 20 },
    ],
    features: [
      "Vadi manzaralı yerleşim planı",
      "Geniş yeşil alan ve peyzaj düzenlemesi",
      "Kapalı otopark",
      "Sosyal tesis ve yaşam alanları",
      "Çocuk oyun alanları",
      "24 saat güvenlik altyapısı",
    ],
    technicalDetails: [
      { label: "Proje Türü", value: "Konut" },
      { label: "Daire Tipleri", value: "2+1, 3+1, 5+1" },
      { label: "Otopark", value: "Kapalı ve açık otopark" },
    ],
    deliveryDate: new Date("2027-06-30"),
    isFeatured: true,
    sortOrder: 1,
  },
  {
    title: "Kazanım Bosphorus",
    slug: "kazanim-bosphorus",
    slogan: "Boğaz siluetiyle bütünleşen seçkin bir yaşam alanı.",
    status: "ONGOING" as const,
    type: "Konut Projesi",
    location: "Beşiktaş, İstanbul",
    shortDescription:
      "Boğaz manzarasına açılan konumu ve özenli mimarisiyle öne çıkan prestijli konut projemiz. (Örnek içerik)",
    description:
      "Kazanım Bosphorus, şehrin en değerli akslarından birinde, manzara odaklı bir yerleşim kurgusuyla geliştirilmektedir. Daire planları ferah kullanımı öncelerken, ortak alanlar seçkin bir yaşam deneyimi sunacak şekilde tasarlanmıştır.\n\nProje iletişim süreçleri şeffaf biçimde yürütülmekte; ilerleme bilgisi düzenli olarak güncellenmektedir.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    coverImage: "/images/projects/kazanim-bosphorus.jpg",
    progressOverall: 35,
    progressItems: [
      { label: "Temel ve İksa", value: 100 },
      { label: "Kaba İnşaat", value: 40 },
      { label: "Cephe Uygulaması", value: 10 },
    ],
    features: [
      "Manzara odaklı yerleşim",
      "Geniş balkon ve teras kullanımları",
      "Sosyal donatı alanları",
      "Kapalı otopark",
      "Akıllı bina altyapısı",
    ],
    technicalDetails: [
      { label: "Proje Türü", value: "Konut" },
      { label: "Daire Tipleri", value: "1+1, 2+1, 4+1" },
    ],
    deliveryDate: new Date("2028-03-31"),
    isFeatured: true,
    sortOrder: 2,
  },
  {
    title: "Kazanım Cadde",
    slug: "kazanim-cadde",
    slogan: "Caddenin dinamizmi, yatırımın kalıcı değeri.",
    status: "UPCOMING" as const,
    type: "Karma Proje",
    location: "Kadıköy, İstanbul",
    shortDescription:
      "Cadde yaşamıyla bütünleşen, konut ve ticari üniteleri bir arada sunan karma projemiz. (Örnek içerik)",
    description:
      "Kazanım Cadde, canlı bir cadde aksı üzerinde konut ve ticari fonksiyonları bir araya getiren karma kullanımlı bir projedir. Ulaşım akslarına yakınlığı ve günlük yaşam olanaklarına erişimi ile öne çıkmaktadır.\n\nProje lansman hazırlıkları sürmektedir; detaylı bilgi için bilgi talep formunu kullanabilirsiniz.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    coverImage: "/images/projects/kazanim-cadde.jpg",
    progressOverall: 0,
    features: [
      "Konut ve ticari üniteler bir arada",
      "Toplu ulaşıma yakın konum",
      "Cadde cepheli ticari alanlar",
      "Modern mimari çizgiler",
    ],
    technicalDetails: [
      { label: "Proje Türü", value: "Konut + Ticari" },
      { label: "Daire Tipleri", value: "1+1, 2+1, 3+1" },
    ],
    deliveryDate: new Date("2028-12-31"),
    isFeatured: true,
    sortOrder: 3,
  },
  {
    title: "Kazanım Residence",
    slug: "kazanim-residence",
    slogan: "Şehrin merkezinde konforlu ve prestijli bir yaşam.",
    status: "COMPLETED" as const,
    type: "Konut Projesi",
    location: "Şişli, İstanbul",
    shortDescription:
      "Merkezi konumu ve nitelikli daire planlarıyla tamamlanarak sakinlerine teslim edilen projemiz. (Örnek içerik)",
    description:
      "Kazanım Residence, merkezi konumu ve fonksiyonel daire planlarıyla tamamlanmış bir konut projesidir. Ortak alanlar, otopark ve peyzaj düzenlemeleri planlandığı şekilde hayata geçirilmiştir.\n\nTeslim sonrası iletişim süreçlerimiz devam etmektedir.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    coverImage: "/images/projects/kazanim-residence.jpg",
    progressOverall: 100,
    features: [
      "Merkezi konum",
      "Fonksiyonel daire planları",
      "Kapalı otopark",
      "Sosyal donatı alanları",
    ],
    technicalDetails: [
      { label: "Proje Türü", value: "Konut" },
      { label: "Durum", value: "Teslim edildi" },
      { label: "Daire Tipleri", value: "1+1, 2+1, 3+1" },
    ],
    isFeatured: false,
    sortOrder: 4,
  },
  {
    title: "Kazanım İş Merkezi",
    slug: "kazanim-is-merkezi",
    slogan: "Kurumsal kullanıcılar için değer üreten ofis alanları.",
    status: "COMPLETED" as const,
    type: "Ticari Proje",
    location: "Maslak, İstanbul",
    shortDescription:
      "Esnek ofis planları ve kurumsal altyapısıyla tamamlanan ticari projemiz. (Örnek içerik)",
    description:
      "Kazanım İş Merkezi, kurumsal kullanıcıların ihtiyaçları gözetilerek planlanmış, esnek ofis alanları sunan bir ticari projedir. Ortak alanlar, otopark ve teknik altyapı kurumsal kullanım standartlarına göre çözümlenmiştir.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    coverImage: "/images/projects/kazanim-is-merkezi.jpg",
    progressOverall: 100,
    features: [
      "Esnek ofis plan çözümleri",
      "Kurumsal teknik altyapı",
      "Kapalı otopark",
      "Toplantı ve ortak kullanım alanları",
    ],
    technicalDetails: [
      { label: "Proje Türü", value: "Ticari / Ofis" },
      { label: "Durum", value: "Teslim edildi" },
    ],
    isFeatured: false,
    sortOrder: 5,
  },
  {
    title: "Kazanım Yaşam Evleri",
    slug: "kazanim-yasam-evleri",
    slogan: "Aile odaklı, huzurlu ve güvenli bir yaşam çevresi.",
    status: "ONGOING" as const,
    type: "Konut Projesi",
    location: "Ümraniye, İstanbul",
    shortDescription:
      "Aile yaşamını önceleyen planlaması ve geniş ortak alanlarıyla geliştirilen konut projemiz. (Örnek içerik)",
    description:
      "Kazanım Yaşam Evleri, aile yaşamının ihtiyaçlarını önceleyen bir planlama anlayışıyla geliştirilmektedir. Geniş ortak alanlar, çocuk oyun alanları ve yeşil dokusuyla huzurlu bir yaşam ortamı hedeflenmektedir.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    coverImage: "/images/projects/kazanim-yasam-evleri.jpg",
    progressOverall: 20,
    progressItems: [
      { label: "Hafriyat ve Temel", value: 70 },
      { label: "Kaba İnşaat", value: 15 },
    ],
    features: [
      "Aile odaklı plan çözümleri",
      "Geniş yeşil alanlar",
      "Çocuk oyun alanları",
      "Güvenlikli yerleşke",
    ],
    technicalDetails: [
      { label: "Proje Türü", value: "Konut" },
      { label: "Daire Tipleri", value: "2+1, 3+1" },
    ],
    deliveryDate: new Date("2027-12-31"),
    isFeatured: false,
    sortOrder: 6,
  },
];

async function seedProjects() {
  for (const project of PROJECTS) {
    const { progressItems, features, technicalDetails, ...rest } = project;
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        ...rest,
        publishStatus: "PUBLISHED",
        publishedAt: new Date(),
        progressItems: progressItems ?? undefined,
        features: features ?? undefined,
        technicalDetails: technicalDetails ?? undefined,
        seoTitle: `${project.title} | Kazanım Gayrimenkul`,
        seoDescription: project.shortDescription,
        ogImage: project.coverImage,
      },
    });
  }
  console.log(`  ✓ Projeler (demo): ${PROJECTS.length} kayıt`);
}

// ─── News (demo content) ─────────────────────────────────────────────────────

const NEWS = [
  {
    title: "Gayrimenkul Yatırımında Doğru Lokasyonun Önemi",
    slug: "gayrimenkul-yatiriminda-dogru-lokasyonun-onemi",
    excerpt:
      "Uzun vadeli değer üretiminde lokasyon seçiminin rolünü ve değerlendirme kriterlerimizi ele alıyoruz.",
    content:
      "Gayrimenkul yatırımında uzun vadeli değeri belirleyen en önemli unsurlardan biri lokasyondur. Ulaşım akslarına yakınlık, bölgenin gelişim planları, günlük yaşam olanaklarına erişim ve çevresel nitelikler; bir projenin zaman içindeki değer seyrini doğrudan etkiler.\n\nKazanım Gayrimenkul olarak proje geliştirme sürecimiz, kapsamlı bir lokasyon analiziyle başlar. Bölgenin mevcut durumunu ve gelişim potansiyelini birlikte değerlendirir; projelerimizi uzun vadeli değer üretme hedefiyle konumlandırırız.\n\nProjelerimiz ve lokasyon yaklaşımımız hakkında detaylı bilgi için bizimle iletişime geçebilirsiniz.",
    category: "Yatırım Rehberi",
    coverImage: "/images/news/dogru-lokasyon.jpg",
    relatedSlug: null,
    isFeatured: true,
  },
  {
    title: "Kazanım Vadi'de Çalışmalar Planlandığı Şekilde İlerliyor",
    slug: "kazanim-vadi-proje-guncellemesi",
    excerpt:
      "Kazanım Vadi projemizde kaba inşaat çalışmaları sürerken cephe uygulamalarına başlandı. (Örnek içerik)",
    content:
      "Kazanım Vadi projemizde çalışmalar, planlanan takvim doğrultusunda devam etmektedir. Kaba inşaat imalatlarında önemli bir aşamaya gelinmiş, cephe uygulamalarına başlanmıştır.\n\nPeyzaj ve sosyal donatı alanlarına ilişkin uygulamalar önümüzdeki dönemde başlayacaktır. Proje ilerleme durumu, proje detay sayfamızdan takip edilebilir.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    category: "Proje Gelişmesi",
    coverImage: "/images/news/proje-guncelleme.jpg",
    relatedSlug: "kazanim-vadi",
    isFeatured: false,
  },
  {
    title: "Konut Projelerinde Değer Odaklı Yeni Dönem",
    slug: "konut-projelerinde-deger-odakli-yeni-donem",
    excerpt:
      "Konut tercihlerinde kalite, konum ve uzun vadeli değer beklentisinin öne çıktığı yeni dönemi değerlendiriyoruz.",
    content:
      "Konut piyasasında tercihler; yalnızca metrekare ve fiyat üzerinden değil, yaşam kalitesi, lokasyon ve uzun vadeli değer beklentisi üzerinden şekillenmektedir. Nitelikli mimari, ortak alan kurgusu ve şeffaf süreç yönetimi, alıcılar için giderek daha belirleyici hale gelmektedir.\n\nKazanım Gayrimenkul olarak bu beklentileri projelerimizin merkezine koyuyor; yaşam alanlarını uzun vadeli değer üretecek şekilde planlıyoruz.\n\nGüncel projelerimizi web sitemizin projeler bölümünden inceleyebilirsiniz.",
    category: "Piyasa Analizi",
    coverImage: "/images/news/deger-odakli-projeler.jpg",
    relatedSlug: null,
    isFeatured: false,
  },
  {
    title: "Kazanım Residence Sakinlerine Teslim Edildi",
    slug: "kazanim-residence-teslim-edildi",
    excerpt:
      "Kazanım Residence projemizde teslim süreci tamamlandı; daireler sakinlerine teslim edildi. (Örnek içerik)",
    content:
      "Kazanım Residence projemizde teslim süreci tamamlanmıştır. Proje kapsamında planlanan ortak alanlar, otopark ve peyzaj düzenlemeleri hayata geçirilmiştir.\n\nTeslim sürecinde her daire için kontrol listesi üzerinden son kontroller yapılmış ve sakinlerimize kullanım bilgilendirmesi iletilmiştir. Teslim sonrası iletişim süreçlerimiz devam etmektedir.\n\nBu kayıt, yönetim panelinden düzenlenebilir örnek içeriktir.",
    category: "Teslim",
    coverImage: "/images/news/teslim-duyurusu.jpg",
    relatedSlug: "kazanim-residence",
    isFeatured: false,
  },
];

async function seedNews() {
  const now = Date.now();
  for (const [index, article] of NEWS.entries()) {
    const related = article.relatedSlug
      ? await prisma.project.findUnique({
          where: { slug: article.relatedSlug },
          select: { id: true },
        })
      : null;

    await prisma.newsArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        category: article.category,
        status: "PUBLISHED",
        isFeatured: article.isFeatured,
        // Stagger publish dates so ordering is meaningful out of the box.
        publishedAt: new Date(now - index * 7 * 24 * 60 * 60 * 1000),
        relatedProjectId: related?.id ?? null,
        seoTitle: `${article.title} | Kazanım Gayrimenkul`,
        seoDescription: article.excerpt,
        ogImage: article.coverImage,
      },
    });
  }
  console.log(`  ✓ Haberler (demo): ${NEWS.length} kayıt`);
}

// ─── Media / gallery (demo content) ──────────────────────────────────────────

// All gallery tiles now use real photography (jpg). Interior/amenity/construction/
// floor-plan tiles were cropped from mosaic renders.
const GALLERY = [
  { file: "dis-cephe-01", title: "Dış Cephe Görünümü", category: "dis-cephe", project: "kazanim-bosphorus", ext: "jpg" },
  { file: "dis-cephe-02", title: "Cephe Detayı", category: "dis-cephe", project: "kazanim-vadi", ext: "jpg" },
  { file: "dis-cephe-03", title: "Bahçeli Cephe", category: "dis-cephe", project: "kazanim-residence", ext: "jpg" },
  { file: "dis-cephe-04", title: "Peyzaj ve Cephe", category: "dis-cephe", project: "kazanim-vadi", ext: "jpg" },
  { file: "dis-cephe-05", title: "Akşam Cephe Görünümü", category: "dis-cephe", project: "kazanim-bosphorus", ext: "jpg" },
  { file: "ic-mekan-01", title: "Salon Görünümü", category: "ic-mekan", project: "kazanim-residence", ext: "jpg" },
  { file: "ic-mekan-02", title: "Mutfak", category: "ic-mekan", project: "kazanim-vadi", ext: "jpg" },
  { file: "ic-mekan-03", title: "Banyo", category: "ic-mekan", project: "kazanim-yasam-evleri", ext: "jpg" },
  { file: "ic-mekan-04", title: "Teras ve Manzara", category: "ic-mekan", project: "kazanim-bosphorus", ext: "jpg" },
  { file: "sosyal-alanlar-01", title: "Sosyal Yaşam Alanları", category: "sosyal-alanlar", project: "kazanim-vadi", ext: "jpg" },
  { file: "sosyal-alanlar-02", title: "Peyzaj ve Ortak Alanlar", category: "sosyal-alanlar", project: "kazanim-yasam-evleri", ext: "jpg" },
  { file: "sosyal-alanlar-03", title: "Bahçe ve Dinlenme Alanları", category: "sosyal-alanlar", project: "kazanim-vadi", ext: "jpg" },
  { file: "sosyal-alanlar-04", title: "Lobi ve Karşılama", category: "sosyal-alanlar", project: "kazanim-residence", ext: "jpg" },
  { file: "sosyal-alanlar-05", title: "Fitness Merkezi", category: "sosyal-alanlar", project: "kazanim-vadi", ext: "jpg" },
  { file: "sosyal-alanlar-06", title: "Kafe ve Sosyal Alan", category: "sosyal-alanlar", project: "kazanim-yasam-evleri", ext: "jpg" },
  { file: "santiye-01", title: "İnşaat Aşaması", category: "santiye", project: "kazanim-bosphorus", ext: "jpg" },
  { file: "kat-planlari-01", title: "Örnek Kat Planı", category: "kat-planlari", project: "kazanim-vadi", ext: "jpg" },
];

async function seedMedia() {
  for (const [index, item] of GALLERY.entries()) {
    const ext = item.ext ?? "svg";
    const url = `/images/gallery/${item.file}.${ext}`;
    const project = await prisma.project.findUnique({
      where: { slug: item.project },
      select: { id: true, title: true },
    });

    const existing = await prisma.mediaAsset.findFirst({ where: { url } });
    if (existing) continue;

    await prisma.mediaAsset.create({
      data: {
        fileName: `${item.file}.${ext}`,
        url,
        title: item.title,
        altText: `${project?.title ?? "Kazanım Gayrimenkul"} — ${item.title}`,
        category: item.category,
        mimeType: ext === "jpg" ? "image/jpeg" : "image/svg+xml",
        sortOrder: index,
        linkedProjectId: project?.id ?? null,
      },
    });
  }
  console.log(`  ✓ Galeri görselleri (demo): ${GALLERY.length} kayıt`);
}

// ─── Job positions (demo content) ────────────────────────────────────────────

const POSITIONS = [
  {
    title: "Gayrimenkul Satış Danışmanı",
    slug: "gayrimenkul-satis-danismani",
    department: "Satış ve Pazarlama",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "Projelerimizin satış süreçlerinde görev alacak, iletişimi güçlü satış danışmanı arayışımız bulunmaktadır.",
    requirements:
      "Gayrimenkul satışında deneyim\nGüçlü iletişim ve sunum becerisi\nMüşteri odaklı çalışma anlayışı\nTercihen İngilizce bilgisi",
    responsibilities:
      "Proje tanıtım ve satış görüşmelerinin yürütülmesi\nMüşteri taleplerinin takibi ve raporlanması\nSatış sonrası iletişim süreçlerine destek",
  },
  {
    title: "Proje Geliştirme Uzmanı",
    slug: "proje-gelistirme-uzmani",
    department: "Proje Geliştirme",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "Lokasyon analizi ve proje geliştirme süreçlerinde görev alacak uzman aramaktayız.",
    requirements:
      "Şehir planlama, mimarlık, inşaat mühendisliği veya ilgili bölümlerden lisans mezunu\nFizibilite ve pazar analizi deneyimi\nAnaliz ve raporlama becerisi",
    responsibilities:
      "Lokasyon ve pazar analizlerinin hazırlanması\nProje fizibilite çalışmalarının yürütülmesi\nProje geliştirme süreçlerinin koordinasyonu",
  },
  {
    title: "Pazarlama ve İletişim Uzmanı",
    slug: "pazarlama-ve-iletisim-uzmani",
    department: "Satış ve Pazarlama",
    location: "İstanbul",
    type: "Tam Zamanlı",
    description:
      "Marka iletişimi ve dijital pazarlama süreçlerini yürütecek uzman arayışımız bulunmaktadır.",
    requirements:
      "Pazarlama veya iletişim alanında deneyim\nDijital pazarlama kanallarına hâkimiyet\nİçerik üretimi ve marka dili konusunda yetkinlik",
    responsibilities:
      "Dijital pazarlama kampanyalarının planlanması\nWeb sitesi ve sosyal medya içeriklerinin yönetimi\nMarka iletişiminin tutarlılığının sağlanması",
  },
];

async function seedPositions() {
  for (const [index, position] of POSITIONS.entries()) {
    await prisma.jobPosition.upsert({
      where: { slug: position.slug },
      update: {},
      create: {
        ...position,
        status: "PUBLISHED",
        sortOrder: index,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`  ✓ Açık pozisyonlar (demo): ${POSITIONS.length} kayıt`);
}

// ─── Pages ───────────────────────────────────────────────────────────────────

type SeedPage = {
  title: string;
  slug: string;
  pageType: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
  content?: unknown;
  seoDescription: string;
  showInMenu?: boolean;
  sortOrder?: number;
};

const PAGES: SeedPage[] = [
  {
    title: "Hakkımızda",
    slug: "kurumsal/hakkimizda",
    pageType: "corporate",
    heroTitle: "Güven, Şeffaflık ve Değer Odaklı Yaklaşım",
    heroSubtitle:
      "Kazanım Gayrimenkul; doğru lokasyon seçimi, nitelikli mimari ve şeffaf süreç yönetimiyle uzun vadeli değer üreten konut ve ticari projeler geliştirir.",
    heroImage: "/images/hero/kurumsal-hero.jpg",
    seoDescription:
      "Kazanım Gayrimenkul hakkında: değer odaklı proje geliştirme yaklaşımımız, çalışma prensiplerimiz ve kurumsal değerlerimiz.",
    content: {
      intro: {
        eyebrow: "KURUMSAL",
        title: "Yatırıma Kalıcı Değer Katan Bir Yaklaşım",
        body: [
          "Kazanım Gayrimenkul olarak, geliştirdiğimiz her projede güven, şeffaflık ve uzun vadeli değer üretimini esas alıyoruz. Lokasyon seçiminden teslim sonrası iletişime kadar her aşamada özenle çalışıyoruz.",
          "Projelerimizi geliştirirken yalnızca bugünün değil, uzun vadenin ihtiyaçlarını da gözetiyoruz. Amacımız, sahiplerine ve yatırımcılarına kalıcı değer sunan yaşam ve ticaret alanları üretmektir.",
        ],
      },
      principles: [
        { icon: "shield", title: "Güven", text: "Verdiğimiz sözleri takip edilebilir süreçlerle hayata geçiririz." },
        { icon: "map-pin", title: "Doğru Lokasyon", text: "Değer üretme potansiyeli yüksek bölgelerde stratejik seçim yaparız." },
        { icon: "diamond", title: "Kalite", text: "Malzeme seçiminden uygulamaya kadar kalite standartlarımızı koruruz." },
        { icon: "eye", title: "Şeffaflık", text: "Proje süreçlerini açık ve anlaşılır biçimde paylaşırız." },
        { icon: "handshake", title: "Sorumluluk", text: "Yatırımcılarımıza, çalışanlarımıza ve çevreye karşı sorumluluk taşırız." },
        { icon: "leaf", title: "Sürdürülebilir Değer", text: "Uzun vadeli yaşam kalitesi ve değer artışını hedefleriz." },
      ],
    },
  },
  {
    title: "Tarihçemiz",
    slug: "kurumsal/tarihcemiz",
    pageType: "corporate",
    heroTitle: "Değer Üretme Hedefiyle Süren Bir Yolculuk",
    heroSubtitle:
      "Kuruluşumuzdan bugüne, geliştirdiğimiz her projede aynı değer odaklı yaklaşımı sürdürüyoruz.",
    heroImage: "/images/hero/kurumsal-hero.jpg",
    seoDescription:
      "Kazanım Gayrimenkul'ün kuruluşundan bugüne uzanan yolculuğu ve dönemsel gelişim aşamaları.",
    content: {
      note: "Aşağıdaki dönem başlıkları yönetim panelinden düzenlenebilir şablon içeriklerdir.",
      timeline: [
        { period: "Kuruluş Dönemi", title: "Temellerin Atılması", text: "Şirketin kuruluşu ve ilk proje geliştirme çalışmalarının başlaması." },
        { period: "İlk Projeler", title: "İlk Yaşam Alanları", text: "İlk konut projelerinin geliştirilmesi ve satış süreçlerinin yürütülmesi." },
        { period: "Büyüme Süreci", title: "Portföyün Genişlemesi", text: "Ekip yapısının güçlenmesi ve proje portföyünün genişlemesi." },
        { period: "Tamamlanan Projeler", title: "Teslim Edilen Değerler", text: "Tamamlanan projelerle birlikte kurumsal güvenin pekişmesi." },
        { period: "Bugün", title: "Devam Eden Projeler", text: "Seçkin lokasyonlarda yeni projelerin geliştirilmesi." },
        { period: "Gelecek", title: "Yeni Dönem Hedefleri", text: "Uzun vadeli değer üreten yeni projelerin planlanması." },
      ],
    },
  },
  {
    title: "Vizyon ve Misyon",
    slug: "kurumsal/vizyon-misyon",
    pageType: "corporate",
    heroTitle: "Uzun Vadeli Değerin Peşinde",
    heroSubtitle:
      "Vizyonumuz ve misyonumuz, geliştirdiğimiz her projenin arkasındaki temel yaklaşımı tanımlar.",
    heroImage: "/images/hero/kurumsal-hero.jpg",
    seoDescription:
      "Kazanım Gayrimenkul'ün vizyonu, misyonu, değerleri ve çalışma prensipleri.",
    content: {
      vision: {
        title: "Vizyonumuz",
        text: "Doğru lokasyonlarda geliştirdiği nitelikli projelerle uzun vadeli değer üreten; güveniyle ve şeffaflığıyla anılan bir gayrimenkul markası olmak.",
      },
      mission: {
        title: "Misyonumuz",
        text: "Lokasyon analizinden teslim sonrası iletişime kadar her aşamada özenli ve şeffaf bir süreç yürütmek; yatırımcılarına ve kullanıcılarına kalıcı değer sunan yaşam ve ticaret alanları geliştirmek.",
      },
      goals: [
        "Proje süreçlerinde şeffaf ve izlenebilir bir yönetim anlayışı sürdürmek",
        "Lokasyon ve proje seçiminde uzun vadeli değer üretimini esas almak",
        "Mimari ve uygulama kalitesinde standartlarımızı korumak",
        "Teslim sonrası iletişimi ve kullanıcı memnuniyetini gözetmek",
      ],
    },
  },
  {
    title: "Kalite Politikamız",
    slug: "kurumsal/kalite-politikamiz",
    pageType: "corporate",
    heroTitle: "Her Projede Aynı Özen, Aynı Standart",
    heroSubtitle:
      "Kalite yaklaşımımız; proje geliştirme, uygulama denetimi ve teslim sonrası süreçlerin tamamını kapsar.",
    heroImage: "/images/hero/kurumsal-hero.jpg",
    seoDescription:
      "Kazanım Gayrimenkul kalite politikası: proje geliştirme, uygulama denetimi ve teslim sonrası süreç yaklaşımımız.",
    content: {
      statement:
        "Kalite, bizim için tek bir aşamanın değil, projenin tamamının sonucudur. Lokasyon analizinden teslime kadar her adımda kontrol noktaları tanımlar ve bu noktalarda uygunluğu denetleriz.",
      pillars: [
        { title: "Proje Geliştirme Disiplini", text: "Her proje, kapsamlı lokasyon ve ihtiyaç analizleriyle planlanır." },
        { title: "Malzeme Kontrolü", text: "Kullanılan malzemelerin teknik şartnameye uygunluğu kontrol edilir." },
        { title: "Uygulama Denetimi", text: "Saha imalatları düzenli olarak denetlenir ve raporlanır." },
        { title: "Teslim Kontrolü", text: "Teslim öncesi kontrol listeleri üzerinden son kontroller yapılır." },
        { title: "Teslim Sonrası Destek", text: "Teslim sonrasında kullanıcı talepleri takip edilir ve yanıtlanır." },
      ],
    },
  },
  {
    title: "Faaliyet Alanları",
    slug: "kurumsal/faaliyet-alanlari",
    pageType: "corporate",
    heroTitle: "Yatırımınız İçin Uçtan Uca Çözümler",
    heroSubtitle:
      "Proje geliştirmeden satış sonrası iletişime kadar gayrimenkul yatırım sürecinin her aşamasında yanınızdayız.",
    heroImage: "/images/hero/kurumsal-hero.jpg",
    seoDescription:
      "Kazanım Gayrimenkul faaliyet alanları: proje geliştirme, konut projeleri, ticari projeler, gayrimenkul değerlendirme, satış ve pazarlama süreçleri.",
    content: {
      areas: [
        { icon: "building", title: "Proje Geliştirme", text: "Lokasyon ve ihtiyaç analizine dayalı, değer üreten proje geliştirme." },
        { icon: "apartment", title: "Konut Projeleri", text: "Yaşam odaklı planlama anlayışıyla geliştirilen nitelikli konut projeleri." },
        { icon: "briefcase", title: "Ticari Projeler", text: "Kurumsal kullanıma uygun ofis ve ticari alan çözümleri." },
        { icon: "bar-chart", title: "Gayrimenkul Değerlendirme", text: "Lokasyon ve proje analizine dayalı şeffaf değerlendirme yaklaşımı." },
        { icon: "handshake", title: "Satış ve Pazarlama Süreçleri", text: "Profesyonel pazarlama ve güvenli satış süreç yönetimi." },
        { icon: "users", title: "Satış Sonrası İletişim", text: "Teslim sonrasında da süren destek ve düzenli iletişim." },
      ],
    },
  },
  {
    title: "İnsan Kaynakları",
    slug: "insan-kaynaklari",
    pageType: "career",
    heroTitle: "Geleceği Birlikte Kazanalım",
    heroSubtitle:
      "Ekibimize katılarak değer üreten projelerin bir parçası olabilirsiniz.",
    heroImage: "/images/hero/kariyer-hero.jpg",
    seoDescription:
      "Kazanım Gayrimenkul kariyer fırsatları, açık pozisyonlar ve iş başvuru formu.",
    content: {
      culture: [
        { title: "Ekip Çalışması", text: "Disiplinler arası iş birliğini önceleyen bir çalışma kültürü." },
        { title: "Gelişim", text: "Mesleki ve kişisel gelişimi destekleyen bir ortam." },
        { title: "Güven ve Şeffaflık", text: "Kurum içinde de açık iletişim ve şeffaflık esastır." },
      ],
      process: [
        "Başvuru formunun doldurulması",
        "İnsan kaynakları ön değerlendirmesi",
        "Birim görüşmesi",
        "Sonucun adaya bildirilmesi",
      ],
    },
  },
  {
    title: "İletişim",
    slug: "iletisim",
    pageType: "contact",
    heroTitle: "Yatırımınızı Birlikte Değerlendirelim",
    heroSubtitle:
      "Projelerimiz, yatırım fırsatları ve talepleriniz için bize ulaşabilirsiniz.",
    heroImage: "/images/hero/iletisim-hero.jpg",
    seoDescription:
      "Kazanım Gayrimenkul iletişim bilgileri ve bilgi talep formu.",
    content: {
      faq: [
        { q: "Projeleriniz hakkında nasıl bilgi alabilirim?", a: "Bilgi talep formunu doldurabilir veya iletişim kanallarımız üzerinden bize ulaşabilirsiniz. Ekibimiz en kısa sürede size dönüş yapacaktır." },
        { q: "Satış ofisinizi ziyaret edebilir miyim?", a: "Randevu talebinizi iletişim formu üzerinden iletebilirsiniz. Uygun bir zaman planlayarak sizi bilgilendiririz." },
        { q: "Devam eden projelerin teslim tarihleri nedir?", a: "Her projenin teslim planı farklıdır. Güncel bilgi için ilgili proje detay sayfasını inceleyebilir veya bizimle iletişime geçebilirsiniz." },
        { q: "İş başvurusu nasıl yapabilirim?", a: "İnsan Kaynakları sayfamızdaki başvuru formunu doldurarak açık pozisyonlara veya genel havuza başvurabilirsiniz." },
      ],
    },
  },
];

const LEGAL_PAGES: Array<{ title: string; slug: string; heroTitle: string; sections: Array<{ heading: string; body: string[] }> }> = [
  {
    title: "KVKK Aydınlatma Metni",
    slug: "kvkk",
    heroTitle: "KVKK Aydınlatma Metni",
    sections: [
      { heading: "Veri Sorumlusu", body: ["6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla Kazanım Gayrimenkul tarafından aşağıda açıklanan kapsamda işlenmektedir."] },
      { heading: "İşlenen Kişisel Veriler", body: ["Web sitemiz üzerinden ilettiğiniz ad soyad, telefon numarası, e-posta adresi ve mesaj içeriği; iş başvurularında ayrıca özgeçmiş dosyanızda yer alan bilgiler işlenmektedir."] },
      { heading: "İşlenme Amaçları", body: ["Kişisel verileriniz; talep ve sorularınızın yanıtlanması, proje bilgilendirmelerinin yapılması, iş başvurularının değerlendirilmesi ve iletişim süreçlerinin yürütülmesi amacıyla işlenmektedir."] },
      { heading: "Veri Toplama Yöntemleri", body: ["Kişisel verileriniz, web sitemizdeki iletişim ve başvuru formları ile elektronik ortamda toplanmaktadır."] },
      { heading: "Hukuki Sebepler", body: ["Verileriniz, Kanun'un 5. maddesinde belirtilen hukuki sebepler kapsamında, açık rızanız veya meşru menfaat hukuki sebebine dayanılarak işlenmektedir."] },
      { heading: "Veri Aktarımı", body: ["Kişisel verileriniz, hizmet aldığımız altyapı ve barındırma sağlayıcıları ile sınırlı olmak üzere, mevzuata uygun şekilde aktarılabilmektedir."] },
      { heading: "Saklama Süresi", body: ["Verileriniz, işlendikleri amaç için gerekli olan süre boyunca ve ilgili mevzuatta öngörülen süreler kadar saklanmaktadır."] },
      { heading: "İnsan Kaynakları Başvuruları", body: ["İş başvurusu kapsamında ilettiğiniz özgeçmiş ve iletişim bilgileri, başvurunuzun değerlendirilmesi amacıyla işlenmekte ve değerlendirme süreci tamamlandıktan sonra mevzuata uygun süre boyunca saklanmaktadır."] },
      { heading: "Çerezler ve Web Analitiği", body: ["Web sitemizde kullanılan çerezler hakkında ayrıntılı bilgi için Çerez Politikamızı inceleyebilirsiniz."] },
      { heading: "Haklarınız", body: ["Kanun'un 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, düzeltilmesini veya silinmesini isteme ve işlenmesine itiraz etme haklarına sahipsiniz."] },
      { heading: "Başvuru ve İletişim", body: ["Haklarınıza ilişkin taleplerinizi, web sitemizde yer alan iletişim kanalları üzerinden bize iletebilirsiniz."] },
    ],
  },
  {
    title: "Gizlilik Politikası",
    slug: "gizlilik-politikasi",
    heroTitle: "Gizlilik Politikası",
    sections: [
      { heading: "Genel Bilgilendirme", body: ["Bu Gizlilik Politikası, Kazanım Gayrimenkul web sitesi üzerinden toplanan bilgilerin nasıl kullanıldığını açıklamaktadır."] },
      { heading: "Toplanan Bilgiler", body: ["Web sitemiz üzerinden yalnızca sizin ilettiğiniz iletişim bilgileri ve mesaj içerikleri toplanmaktadır. Ayrıca site kullanımına ilişkin anonim analitik veriler işlenebilmektedir."] },
      { heading: "Bilgilerin Kullanım Amaçları", body: ["Toplanan bilgiler; taleplerinizin yanıtlanması, hizmet kalitesinin iyileştirilmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılmaktadır."] },
      { heading: "Formlar ve İletişim Süreçleri", body: ["İletişim ve bilgi talep formları üzerinden ilettiğiniz veriler, yalnızca talebinizin karşılanması amacıyla kullanılmaktadır."] },
      { heading: "İnsan Kaynakları Başvuruları", body: ["Kariyer başvurularınız kapsamındaki bilgiler yalnızca işe alım süreçlerinde değerlendirilmektedir."] },
      { heading: "Çerezler ve Analitik", body: ["Web sitemizde çerezler kullanılmaktadır. Zorunlu çerezler dışındaki çerezler yalnızca onayınızla çalışır."] },
      { heading: "Üçüncü Taraf Hizmetler", body: ["Web sitemizde analitik ve barındırma amacıyla üçüncü taraf hizmet sağlayıcıları kullanılabilmektedir."] },
      { heading: "Veri Güvenliği", body: ["Verilerinizin güvenliği için teknik ve idari tedbirler uygulanmaktadır."] },
      { heading: "Veri Saklama", body: ["Veriler, işlenme amacının gerektirdiği süre boyunca saklanmaktadır."] },
      { heading: "Kullanıcı Hakları", body: ["KVKK kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz."] },
      { heading: "Politika Güncellemeleri", body: ["Bu politika gerektiğinde güncellenebilir. Güncel sürüm web sitemizde yayımlanır."] },
      { heading: "İletişim", body: ["Sorularınız için web sitemizdeki iletişim kanallarını kullanabilirsiniz."] },
    ],
  },
  {
    title: "Çerez Politikası",
    slug: "cerez-politikasi",
    heroTitle: "Çerez Politikası",
    sections: [
      { heading: "Çerez Nedir?", body: ["Çerezler, ziyaret ettiğiniz web siteleri tarafından cihazınıza kaydedilen küçük metin dosyalarıdır."] },
      { heading: "Çerezleri Neden Kullanıyoruz?", body: ["Çerezleri, web sitemizin düzgün çalışmasını sağlamak, kullanıcı deneyimini iyileştirmek ve site performansını ölçmek için kullanıyoruz."] },
      { heading: "Kullanılan Çerez Türleri", body: ["Web sitemizde zorunlu, analitik, tercih ve pazarlama çerezleri kullanılmaktadır."] },
      { heading: "Zorunlu Çerezler", body: ["Sitenin temel işlevleri ve güvenliği için gereklidir; devre dışı bırakılamaz."] },
      { heading: "Analitik Çerezler", body: ["Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur. Yalnızca onayınızla çalışır."] },
      { heading: "Tercih Çerezleri", body: ["Site üzerindeki tercihlerinizin hatırlanmasını sağlar. Yalnızca onayınızla çalışır."] },
      { heading: "Pazarlama Çerezleri", body: ["İlgi alanlarınıza uygun içerik ve reklam gösterimi için kullanılır. Yalnızca onayınızla çalışır."] },
      { heading: "Üçüncü Taraf Çerezleri", body: ["Analitik ve reklam hizmetleri kapsamında üçüncü taraf çerezleri kullanılabilir."] },
      { heading: "Çerez Tercihleri", body: ["Çerez tercihlerinizi, sitede ilk ziyaretinizde görüntülenen çerez bildirimindeki 'Tercihleri Yönet' seçeneğinden düzenleyebilirsiniz."] },
      { heading: "Tarayıcı Ayarları", body: ["Tarayıcınızın ayarlar bölümünden çerezleri silebilir veya engelleyebilirsiniz. Bu durumda sitenin bazı işlevleri etkilenebilir."] },
      { heading: "Politika Güncellemeleri", body: ["Bu politika gerektiğinde güncellenebilir."] },
      { heading: "İletişim", body: ["Çerez kullanımına ilişkin sorularınız için bizimle iletişime geçebilirsiniz."] },
    ],
  },
  {
    title: "Kullanım Koşulları",
    slug: "kullanim-kosullari",
    heroTitle: "Kullanım Koşulları",
    sections: [
      { heading: "Genel Bilgilendirme", body: ["Bu web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız."] },
      { heading: "Web Sitesi Kullanımı", body: ["Web sitesi içerikleri yalnızca bilgilendirme amaçlıdır ve kişisel kullanım için sunulmaktadır."] },
      { heading: "İçeriklerin Bilgilendirme Niteliği", body: ["Sitede yer alan bilgiler bilgilendirme amaçlı olup, bağlayıcı bir teklif veya yatırım tavsiyesi niteliği taşımaz."] },
      { heading: "Proje Bilgileri", body: ["Proje görselleri, planları ve teknik bilgileri temsilî olup, uygulamada değişiklik gösterebilir. Güncel ve bağlayıcı bilgi için satış ekibimizle iletişime geçiniz."] },
      { heading: "Form Kullanımı", body: ["Formlar aracılığıyla ilettiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz."] },
      { heading: "Fikri Mülkiyet Hakları", body: ["Sitede yer alan tüm içerik, görsel ve tasarımların hakları Kazanım Gayrimenkul'e aittir. İzinsiz kullanılamaz."] },
      { heading: "Üçüncü Taraf Bağlantılar", body: ["Sitede yer alabilecek üçüncü taraf bağlantıların içeriğinden Kazanım Gayrimenkul sorumlu değildir."] },
      { heading: "Sorumluluk Sınırı", body: ["Sitenin kullanımından doğabilecek dolaylı zararlardan Kazanım Gayrimenkul sorumlu tutulamaz."] },
      { heading: "Güncelleme Hakkı", body: ["Kazanım Gayrimenkul, bu koşulları önceden bildirmeksizin güncelleme hakkını saklı tutar."] },
      { heading: "Uygulanacak Hukuk", body: ["Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir."] },
      { heading: "İletişim", body: ["Sorularınız için web sitemizdeki iletişim kanallarını kullanabilirsiniz."] },
    ],
  },
];

async function seedPages() {
  for (const [index, page] of PAGES.entries()) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        status: "PUBLISHED",
        heroTitle: page.heroTitle,
        heroSubtitle: page.heroSubtitle,
        heroImage: page.heroImage,
        content: (page.content ?? {}) as object,
        seoTitle: `${page.title} | Kazanım Gayrimenkul`,
        seoDescription: page.seoDescription,
        sortOrder: index,
      },
    });
  }

  for (const [index, page] of LEGAL_PAGES.entries()) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: {
        title: page.title,
        slug: page.slug,
        pageType: "legal",
        status: "PUBLISHED",
        heroTitle: page.heroTitle,
        heroSubtitle: `Son Güncelleme: ${new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`,
        heroImage: "/images/hero/legal-hero.svg",
        content: { legalNotice: LEGAL_NOTICE, sections: page.sections },
        seoTitle: `${page.title} | Kazanım Gayrimenkul`,
        seoDescription: `Kazanım Gayrimenkul ${page.title.toLowerCase()}.`,
        showInFooter: true,
        sortOrder: index,
      },
    });
  }

  console.log(`  ✓ Sayfalar: ${PAGES.length + LEGAL_PAGES.length} kayıt`);
}

// ─── Runner ──────────────────────────────────────────────────────────────────

async function main() {
  console.log("\nKazanım Gayrimenkul — veritabanı seed işlemi başlıyor…\n");
  await seedAdminUser();
  await seedSettings();
  await seedPages();
  if (SEED_DEMO) {
    await seedProjects();
    await seedNews();
    await seedMedia();
    await seedPositions();
  } else {
    console.log("  ↷ Demo içerik atlandı (SEED_DEMO_CONTENT=false veya üretim ortamı).");
  }
  console.log("\n✅ Seed işlemi tamamlandı.\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Seed işlemi başarısız:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
