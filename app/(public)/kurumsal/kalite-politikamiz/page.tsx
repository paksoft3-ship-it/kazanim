import type { Metadata } from "next";
import Image from "next/image";

import { type Crumb } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";
import { Icon } from "@/components/public/Icon";
import { PageHero } from "@/components/public/PageHero";
import { SectionHeading } from "@/components/public/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageBySlug } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";
import { parseJson } from "@/lib/utils";

export const revalidate = 300;

const SLUG = "kurumsal/kalite-politikamiz";
const PATH = "/kurumsal/kalite-politikamiz";

type KaliteContent = {
  statement?: string;
  pillars?: Array<{ title?: string; text?: string }>;
};

const FALLBACK: Required<KaliteContent> = {
  statement:
    "Kalite, bizim için tek bir aşamanın değil, projenin tamamının sonucudur. Tasarımdan teslime kadar her adımda kontrol noktaları tanımlar ve bu noktalarda uygunluğu denetleriz.",
  pillars: [
    { title: "Malzeme Kontrolü", text: "Kullanılan malzemelerin teknik şartnameye uygunluğu kontrol edilir." },
    { title: "Uygulama Denetimi", text: "Saha imalatları, teknik ofis ve şantiye ekipleri tarafından düzenli olarak denetlenir." },
    { title: "İş Güvenliği", text: "Saha çalışmalarında iş güvenliği kurallarına uygunluk esastır." },
    { title: "Teslim Kontrolü", text: "Teslim öncesi kontrol listeleri üzerinden son kontroller yapılır." },
    { title: "Teslim Sonrası Destek", text: "Teslim sonrasında kullanıcı talepleri takip edilir." },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seoTitle || page?.title || "Kalite Politikamız",
    description: page?.seoDescription,
    ogImage: page?.ogImage || page?.heroImage,
    canonicalUrl: page?.canonicalUrl,
    robots: page?.robots,
    path: PATH,
  });
}

export default async function KalitePolitikamizPage() {
  const page = await getPageBySlug(SLUG);
  const settings = await getSettings();
  const content = parseJson<KaliteContent>(page?.content, FALLBACK);

  const statement = content.statement || FALLBACK.statement;
  const pillars = content.pillars?.length ? content.pillars : FALLBACK.pillars;

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Kurumsal", href: "/kurumsal/hakkimizda" },
    { name: page?.title || "Kalite Politikamız", href: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="KURUMSAL"
        title={page?.heroTitle || "Her Projede Güvenilir Kalite Anlayışı"}
        description={
          page?.heroSubtitle ||
          "Kalite yaklaşımımız; malzeme seçimi, uygulama denetimi ve teslim sonrası süreçlerin tamamını kapsar."
        }
        image={page?.heroImage || "/images/hero/kurumsal-hero.svg"}
        crumbs={crumbs}
      />

      {/* Statement + image */}
      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 aspect-[4/3] overflow-hidden border border-warm-border lg:order-1">
            <Image
              src="/images/corporate/kalite.svg"
              alt="Kazanım Gayrimenkul kalite süreçleri"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="KALİTE POLİTİKAMIZ" title="Süreç Odaklı Kalite Anlayışı" />
            <p className="mt-6 border-l-2 border-champagne-gold pl-6 text-body-lg leading-relaxed text-on-surface-variant">
              {statement}
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-warm-border bg-surface-container-low py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <SectionHeading
            eyebrow="KALİTE SÜREÇLERİMİZ"
            title="Kaliteyi Güvence Altına Alan Aşamalar"
            align="center"
            className="mb-14"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, i) => (
              <div key={i} className="flex gap-4 border border-warm-border bg-white p-7">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-soft-gold/40 text-forest-emerald">
                  <Icon name="check-circle" className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="mb-2 font-serif text-lg text-midnight-navy">{pillar.title}</h3>
                  <p className="text-body-sm leading-relaxed text-slate">{pillar.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        location="kurumsal_kalite"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
