import type { Metadata } from "next";

import { type Crumb } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";
import { Icon, type IconName } from "@/components/public/Icon";
import { PageHero } from "@/components/public/PageHero";
import { SectionHeading } from "@/components/public/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageBySlug } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";
import { parseJson } from "@/lib/utils";

export const revalidate = 300;

const SLUG = "kurumsal/faaliyet-alanlari";
const PATH = "/kurumsal/faaliyet-alanlari";

type FaaliyetContent = {
  areas?: Array<{ icon?: string; title?: string; text?: string }>;
};

const FALLBACK: Required<FaaliyetContent> = {
  areas: [
    { icon: "apartment", title: "Konut Projeleri", text: "Yaşam odaklı planlama anlayışıyla geliştirilen konut projeleri." },
    { icon: "building", title: "Ticari Yapılar", text: "Kurumsal kullanıma uygun ofis ve ticari alan çözümleri." },
    { icon: "layers", title: "Kentsel Dönüşüm", text: "Yapı güvenliğini önceleyen dönüşüm projeleri." },
    { icon: "target", title: "Gayrimenkul Geliştirme", text: "Konum ve ihtiyaç analizine dayalı proje geliştirme." },
    { icon: "ruler", title: "Proje Planlama", text: "Mimari ve mühendislik disiplinlerinin koordineli planlaması." },
    { icon: "briefcase", title: "İnşaat Yönetimi", text: "Süreç, maliyet ve kalite yönetiminin bütüncül takibi." },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seoTitle || page?.title || "Faaliyet Alanları",
    description: page?.seoDescription,
    ogImage: page?.ogImage || page?.heroImage,
    canonicalUrl: page?.canonicalUrl,
    robots: page?.robots,
    path: PATH,
  });
}

export default async function FaaliyetAlanlariPage() {
  const page = await getPageBySlug(SLUG);
  const settings = await getSettings();
  const content = parseJson<FaaliyetContent>(page?.content, FALLBACK);

  const areas = content.areas?.length ? content.areas : FALLBACK.areas;

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Kurumsal", href: "/kurumsal/hakkimizda" },
    { name: page?.title || "Faaliyet Alanları", href: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="KURUMSAL"
        title={page?.heroTitle || "Yaşam Alanlarına Değer Katan Çözümler"}
        description={
          page?.heroSubtitle ||
          "Konut, ticari yapı ve proje geliştirme alanlarında uçtan uca çözümler sunuyoruz."
        }
        image={page?.heroImage || "/images/hero/kurumsal-hero.svg"}
        crumbs={crumbs}
      />

      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <SectionHeading
            eyebrow="FAALİYET ALANLARIMIZ"
            title="Uçtan Uca Yapı ve Proje Çözümleri"
            description="Projelerin planlanmasından teslimine kadar tüm süreçlerde çözüm sunuyoruz."
            align="center"
            className="mb-14"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => (
              <article
                key={i}
                className="group border border-warm-border bg-white p-8 transition-colors hover:border-champagne-gold/60"
              >
                <span className="mb-6 flex h-16 w-16 items-center justify-center bg-midnight-navy text-soft-gold transition-colors group-hover:bg-forest-emerald">
                  <Icon name={(area.icon as IconName) || "building"} className="h-8 w-8" />
                </span>
                <h3 className="mb-3 font-serif text-xl text-midnight-navy">{area.title}</h3>
                <p className="text-body-sm leading-relaxed text-slate">{area.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        location="kurumsal_faaliyet_alanlari"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
