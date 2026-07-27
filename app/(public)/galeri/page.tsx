import type { Metadata } from "next";

import { type Crumb } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";
import { GalleryGrid, type GalleryItem } from "@/components/public/GalleryGrid";
import { PageHero } from "@/components/public/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGalleryMedia } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";

export const revalidate = 300;

const PATH = "/galeri";

const CATEGORIES = [
  { id: "tumu", label: "Tümü" },
  { id: "dis-cephe", label: "Dış Cephe" },
  { id: "ic-mekan", label: "İç Mekân" },
  { id: "sosyal-alanlar", label: "Sosyal Alanlar" },
  { id: "santiye", label: "Şantiye" },
  { id: "kat-planlari", label: "Kat Planları" },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Galeri | Kazanım Gayrimenkul",
    description:
      "Kazanım Gayrimenkul projelerinden dış cephe, iç mekân, sosyal alan ve şantiye görselleri.",
    path: PATH,
  });
}

export default async function GaleriPage() {
  const media = await getGalleryMedia();
  const settings = await getSettings();

  const items: GalleryItem[] = media.map((asset) => ({
    id: asset.id,
    url: asset.url,
    title: asset.title,
    altText: asset.altText,
    category: asset.category,
    projectName: asset.linkedProject?.title ?? null,
  }));

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Galeri", href: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="GALERİ"
        title="Projelerimizden Kareler"
        description="Tamamlanan ve devam eden projelerimizden dış cephe, iç mekân, sosyal alan ve şantiye görselleri."
        image="/images/hero/galeri-hero.jpg"
        crumbs={crumbs}
      />

      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          {items.length === 0 ? (
            <p className="border border-warm-border bg-white p-12 text-center text-slate">
              Galeri içeriği yakında eklenecektir.
            </p>
          ) : (
            <GalleryGrid items={items} categories={CATEGORIES} />
          )}
        </div>
      </section>

      <CTASection
        location="galeri"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
