import type { Metadata } from "next";

import { type Crumb } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";
import { NewsCard } from "@/components/public/NewsCard";
import { NewsListTracker } from "@/components/public/NewsListTracker";
import { PageHero } from "@/components/public/PageHero";
import { SectionHeading } from "@/components/public/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedNews } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";

export const revalidate = 300;

const PATH = "/haberler";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Haberler ve Duyurular | Kazanım Gayrimenkul",
    description:
      "Kazanım Gayrimenkul'den proje duyuruları, piyasa analizleri ve kurumsal haberler.",
    path: PATH,
  });
}

export default async function HaberlerPage() {
  const news = await getPublishedNews();
  const settings = await getSettings();

  const [featured, ...rest] = news;

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Haberler", href: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <NewsListTracker count={news.length} />

      <PageHero
        eyebrow="HABERLER VE DUYURULAR"
        title="Kazanım Gayrimenkul'den Haberler ve Duyurular"
        description="Projelerimizdeki gelişmeleri, kurumsal haberlerimizi ve duyurularımızı buradan takip edebilirsiniz."
        image="/images/hero/haberler-hero.svg"
        crumbs={crumbs}
      />

      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          {news.length === 0 ? (
            <p className="border border-warm-border bg-white p-12 text-center text-slate">
              Yakında yeni haber ve duyurular paylaşılacaktır.
            </p>
          ) : (
            <>
              {featured ? (
                <div className="mb-16">
                  <NewsCard article={featured} featured />
                </div>
              ) : null}

              {rest.length > 0 ? (
                <>
                  <SectionHeading
                    eyebrow="TÜM HABERLER"
                    title="Diğer Haberler"
                    className="mb-12"
                  />
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      </section>

      <CTASection
        location="haberler"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
