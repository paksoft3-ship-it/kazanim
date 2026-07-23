import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs, type Crumb } from "@/components/public/Breadcrumbs";
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

const SLUG = "kurumsal/hakkimizda";
const PATH = "/kurumsal/hakkimizda";

type HakkimizdaContent = {
  intro?: { eyebrow?: string; title?: string; body?: string[] };
  principles?: Array<{ icon?: string; title?: string; text?: string }>;
};

const FALLBACK: Required<HakkimizdaContent> = {
  intro: {
    eyebrow: "KURUMSAL",
    title: "Yaşam Alanlarına Değer Katan Güvenilir Yapı Yaklaşımı",
    body: [
      "Kazanım Gayrimenkul olarak, geliştirdiğimiz her projede güven, şeffaflık ve uzun vadeli değer üretimini esas alıyoruz. Lokasyon seçiminden teslim sonrası iletişime kadar her aşamada özenle çalışıyoruz.",
      "Projelerimizi geliştirirken yalnızca bugünün değil, uzun vadenin de ihtiyaçlarını gözetiyoruz. Amacımız, kullanıcılarına kalıcı değer sunan yaşam alanları inşa etmektir.",
    ],
  },
  principles: [
    { icon: "shield", title: "Güven", text: "Verdiğimiz sözleri takip edilebilir süreçlerle hayata geçiririz." },
    { icon: "diamond", title: "Kalite", text: "Malzeme seçiminden uygulamaya kadar kalite standartlarımızı koruruz." },
    { icon: "handshake", title: "Sorumluluk", text: "Kullanıcılarımıza, çalışanlarımıza ve çevreye karşı sorumluluk taşırız." },
    { icon: "eye", title: "Şeffaflık", text: "Proje süreçlerini açık ve anlaşılır biçimde paylaşırız." },
    { icon: "ruler", title: "Estetik", text: "Zamansız mimari çizgileri fonksiyonellikle birlikte ele alırız." },
    { icon: "leaf", title: "Sürdürülebilirlik", text: "Kaynakları verimli kullanan çözümleri önceliklendiririz." },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seoTitle || page?.title || "Hakkımızda",
    description: page?.seoDescription,
    ogImage: page?.ogImage || page?.heroImage,
    canonicalUrl: page?.canonicalUrl,
    robots: page?.robots,
    path: PATH,
  });
}

export default async function HakkimizdaPage() {
  const page = await getPageBySlug(SLUG);
  const settings = await getSettings();
  const content = parseJson<HakkimizdaContent>(page?.content, FALLBACK);

  const intro = content.intro ?? FALLBACK.intro;
  const principles = content.principles?.length ? content.principles : FALLBACK.principles;

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Kurumsal", href: PATH },
    { name: page?.title || "Hakkımızda", href: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="KURUMSAL"
        title={page?.heroTitle || "Sağlam Temeller Üzerine Kurulu Bir Marka"}
        description={
          page?.heroSubtitle ||
          "Kazanım Gayrimenkul; doğru lokasyon seçimi, nitelikli mimari ve şeffaf süreç yönetimiyle uzun vadeli değer üreten konut ve ticari projeler geliştirir."
        }
        image={page?.heroImage || "/images/hero/kurumsal-hero.svg"}
        crumbs={crumbs}
      />

      {/* Intro: text + image */}
      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={intro.eyebrow || "KURUMSAL"}
              title={intro.title || FALLBACK.intro.title!}
            />
            <div className="mt-6 space-y-5">
              {(intro.body?.length ? intro.body : FALLBACK.intro.body!).map((paragraph, i) => (
                <p key={i} className="text-body-md leading-relaxed text-on-surface-variant">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-warm-border">
            <Image
              src="/images/corporate/hakkimizda.svg"
              alt="Kazanım Gayrimenkul kurumsal yaklaşımı"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Principles / values */}
      <section className="border-t border-warm-border bg-surface-container-low py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <SectionHeading
            eyebrow="DEĞERLERİMİZ"
            title="Çalışma Prensiplerimiz"
            description="Her projede bize yön veren temel değerler."
            align="center"
            className="mb-14"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((item, i) => (
              <div
                key={i}
                className="group border border-warm-border bg-white p-8 transition-colors hover:border-champagne-gold/60"
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center bg-soft-gold/40 text-forest-emerald">
                  <Icon name={(item.icon as IconName) || "shield"} className="h-7 w-7" />
                </span>
                <h3 className="mb-3 font-serif text-xl text-midnight-navy">{item.title}</h3>
                <p className="text-body-sm leading-relaxed text-slate">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        location="kurumsal_hakkimizda"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
