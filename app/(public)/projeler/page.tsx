import type { Metadata } from "next";

import { CTASection } from "@/components/public/CTASection";
import { PageHero } from "@/components/public/PageHero";
import { ProjectListing } from "@/components/public/ProjectListing";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedProjects } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Projelerimiz | Kazanım Gayrimenkul",
    description:
      "Kazanım Gayrimenkul'ün seçkin lokasyonlardaki konut ve ticari projelerini inceleyin; devam eden ve tamamlanan projeler hakkında bilgi alın.",
    path: "/projeler",
  });
}

export default async function ProjelerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [projects, settings, params] = await Promise.all([
    getPublishedProjects(),
    getSettings(),
    searchParams,
  ]);

  const single = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", href: "/" },
          { name: "Projeler", href: "/projeler" },
        ])}
      />

      <PageHero
        eyebrow="PROJELERİMİZ"
        title="Seçkin Lokasyonlarda Prestijli Projeler"
        description="Doğru konumda, uzun vadeli değer üretmek üzere geliştirilen konut ve ticari projelerimizi inceleyin."
        image="/images/hero/projeler-hero.jpg"
        crumbs={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Projeler", href: "/projeler" },
        ]}
      />

      <section className="py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <ProjectListing
            projects={projects}
            initialFilters={{
              status: single(params.durum),
              type: single(params.tur),
              location: single(params.lokasyon),
              deliveryYear: single(params.teslim),
            }}
          />
        </div>
      </section>

      <CTASection
        location="projeler_cta"
        whatsappNumber={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappNumber : undefined}
        whatsappMessage={settings.whatsappMessage}
      />
    </>
  );
}
