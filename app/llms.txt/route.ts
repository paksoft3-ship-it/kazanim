import { getPublishedProjects } from "@/lib/content";
import { siteUrl } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

/**
 * /llms.txt — a concise, plain-text summary of the public site for large
 * language models and AI crawlers.
 *
 * Both helpers used here swallow their own database errors (getSettings falls
 * back to SETTING_DEFAULTS, getPublishedProjects returns []), so this route
 * always renders even with no database.
 */

export const revalidate = 3600;

const PROJECT_STATUS_TR: Record<string, string> = {
  ONGOING: "Devam Eden",
  COMPLETED: "Tamamlanan",
  UPCOMING: "Yakında",
};

export async function GET(): Promise<Response> {
  const base = siteUrl();

  let body: string;
  try {
    const [settings, projects] = await Promise.all([
      getSettings(),
      getPublishedProjects(),
    ]);

    const projectLines = projects.length
      ? projects
          .map(
            (project) =>
              `- ${project.title} (${
                PROJECT_STATUS_TR[project.status] ?? project.status
              }${project.location ? `, ${project.location}` : ""}): ${base}/projeler/${project.slug}`,
          )
          .join("\n")
      : "- Proje listesi: " + `${base}/projeler`;

    body = `# ${settings.companyName}

> ${settings.defaultSeoDescription}

${settings.companyName}, İstanbul odaklı bir gayrimenkul ve proje geliştirme
şirketidir. Doğru lokasyonlarda konut ve ticari projeler geliştirir, projelerini
web sitesi üzerinden tanıtır ve bilgi taleplerini form üzerinden karşılar.
Sitenin tamamı Türkçedir.

## Ana Bölümler

- Ana Sayfa: ${base}/
- Hakkımızda: ${base}/kurumsal/hakkimizda
- Tarihçemiz: ${base}/kurumsal/tarihcemiz
- Vizyon ve Misyon: ${base}/kurumsal/vizyon-misyon
- Kalite Politikamız: ${base}/kurumsal/kalite-politikamiz
- Faaliyet Alanları: ${base}/kurumsal/faaliyet-alanlari
- Tüm Projeler: ${base}/projeler
- Devam Eden Projeler: ${base}/projeler/devam-eden
- Tamamlanan Projeler: ${base}/projeler/tamamlanan
- Galeri: ${base}/galeri
- Haberler ve Duyurular: ${base}/haberler
- İnsan Kaynakları / Kariyer: ${base}/insan-kaynaklari
- İletişim: ${base}/iletisim

## Projeler

${projectLines}

## İletişim

- İletişim sayfası: ${base}/iletisim${settings.phone ? `\n- Telefon: ${settings.phone}` : ""}${settings.email ? `\n- E-posta: ${settings.email}` : ""}${settings.address ? `\n- Adres: ${settings.address}` : ""}${settings.workingHours ? `\n- Çalışma saatleri: ${settings.workingHours}` : ""}

## Yasal Metinler

- KVKK Aydınlatma Metni: ${base}/kvkk
- Gizlilik Politikası: ${base}/gizlilik-politikasi
- Çerez Politikası: ${base}/cerez-politikasi
- Kullanım Koşulları: ${base}/kullanim-kosullari

## Notlar

- Yönetim paneli (${base}/admin) ve API uçları (${base}/api) taranmaya kapalıdır.
- Sitede yayımlanan istatistik değerleri yönetim panelinden düzenlenebilen
  yaklaşık değerlerdir; resmi/denetlenmiş rakamlar değildir.
- Site haritası: ${base}/sitemap.xml
`;
  } catch (error) {
    console.error("[llms.txt] falling back to static summary:", error);
    body = `# Kazanım Gayrimenkul

İstanbul odaklı gayrimenkul ve proje geliştirme şirketi.

- Ana Sayfa: ${base}/
- Projeler: ${base}/projeler
- Haberler: ${base}/haberler
- İletişim: ${base}/iletisim
- Site haritası: ${base}/sitemap.xml
`;
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
