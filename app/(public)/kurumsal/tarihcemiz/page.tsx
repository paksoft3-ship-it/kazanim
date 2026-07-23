import type { Metadata } from "next";

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

const SLUG = "kurumsal/tarihcemiz";
const PATH = "/kurumsal/tarihcemiz";

type TarihceContent = {
  note?: string;
  timeline?: Array<{ period?: string; title?: string; text?: string }>;
};

const FALLBACK: Required<TarihceContent> = {
  note: "Aşağıdaki dönem başlıkları yönetim panelinden düzenlenebilir şablon içeriklerdir.",
  timeline: [
    { period: "Kuruluş Dönemi", title: "Temellerin Atılması", text: "Şirketin kuruluşu ve ilk yapı üretim süreçlerinin başlaması." },
    { period: "İlk Projeler", title: "İlk Yaşam Alanları", text: "İlk konut projelerinin geliştirilmesi ve teslim edilmesi." },
    { period: "Büyüme Süreci", title: "Kapasitenin Genişlemesi", text: "Ekip yapısının ve proje kapasitesinin genişletilmesi." },
    { period: "Tamamlanan Projeler", title: "Teslim Edilen Değerler", text: "Tamamlanan projelerle birlikte portföyün güçlenmesi." },
    { period: "Bugün", title: "Devam Eden Projeler", text: "Devam eden projelerle üretimin sürdürülmesi." },
    { period: "Gelecek", title: "Yeni Dönem Hedefleri", text: "Yeni proje geliştirme çalışmalarının sürdürülmesi." },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seoTitle || page?.title || "Tarihçemiz",
    description: page?.seoDescription,
    ogImage: page?.ogImage || page?.heroImage,
    canonicalUrl: page?.canonicalUrl,
    robots: page?.robots,
    path: PATH,
  });
}

export default async function TarihcemizPage() {
  const page = await getPageBySlug(SLUG);
  const settings = await getSettings();
  const content = parseJson<TarihceContent>(page?.content, FALLBACK);

  const timeline = content.timeline?.length ? content.timeline : FALLBACK.timeline;
  const note = content.note || FALLBACK.note;

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Kurumsal", href: "/kurumsal/hakkimizda" },
    { name: page?.title || "Tarihçemiz", href: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="KURUMSAL"
        title={page?.heroTitle || "Güven Üzerine Kurulan, Değer Üreten Bir Yolculuk"}
        description={
          page?.heroSubtitle ||
          "Kuruluşumuzdan bugüne, ürettiğimiz her projede aynı yapı anlayışını sürdürüyoruz."
        }
        image={page?.heroImage || "/images/hero/kurumsal-hero.svg"}
        crumbs={crumbs}
      />

      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <SectionHeading
            eyebrow="TARİHÇEMİZ"
            title="Dönemsel Gelişim Yolculuğumuz"
            description={note}
            className="mb-14"
          />

          {/* Vertical timeline */}
          <ol className="relative mx-auto max-w-3xl border-l border-warm-border pl-8 lg:pl-10">
            {timeline.map((item, i) => (
              <li key={i} className="relative pb-12 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-champagne-gold bg-warm-ivory lg:-left-[49px]"
                >
                  <span className="h-2 w-2 rounded-full bg-champagne-gold" />
                </span>
                <span className="font-label-caps uppercase tracking-[0.2em] text-forest-emerald">
                  {item.period}
                </span>
                <h3 className="mt-2 font-serif text-2xl text-midnight-navy">{item.title}</h3>
                <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-12 flex max-w-3xl items-start gap-3 border border-warm-border bg-surface-container-low p-5 text-body-sm leading-relaxed text-slate">
            <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-forest-emerald" />
            <span>{note}</span>
          </p>
        </div>
      </section>

      <CTASection
        location="kurumsal_tarihcemiz"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
