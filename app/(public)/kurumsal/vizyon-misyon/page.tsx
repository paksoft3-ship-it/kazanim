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

const SLUG = "kurumsal/vizyon-misyon";
const PATH = "/kurumsal/vizyon-misyon";

type VizyonContent = {
  vision?: { title?: string; text?: string };
  mission?: { title?: string; text?: string };
  goals?: string[];
};

const FALLBACK: Required<VizyonContent> = {
  vision: {
    title: "Vizyonumuz",
    text: "Yaşam alanlarına kalıcı değer katan, güvenilir ve estetik yapılar üreten; sektörde güveniyle anılan bir kurum olmak.",
  },
  mission: {
    title: "Misyonumuz",
    text: "Mühendislik disiplininden ödün vermeden, kullanıcı ihtiyaçlarını merkezine alan projeler geliştirmek; şeffaf iletişim ve zamanında teslim anlayışıyla güven ilişkisi kurmak.",
  },
  goals: [
    "Proje süreçlerinde şeffaf ve izlenebilir bir yönetim anlayışı sürdürmek",
    "Malzeme ve uygulama kalitesinde standartlarımızı korumak",
    "Kullanıcı memnuniyetini teslim sonrasında da gözetmek",
    "Kaynakları verimli kullanan çözümleri önceliklendirmek",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seoTitle || page?.title || "Vizyon ve Misyon",
    description: page?.seoDescription,
    ogImage: page?.ogImage || page?.heroImage,
    canonicalUrl: page?.canonicalUrl,
    robots: page?.robots,
    path: PATH,
  });
}

export default async function VizyonMisyonPage() {
  const page = await getPageBySlug(SLUG);
  const settings = await getSettings();
  const content = parseJson<VizyonContent>(page?.content, FALLBACK);

  const vision = content.vision ?? FALLBACK.vision;
  const mission = content.mission ?? FALLBACK.mission;
  const goals = content.goals?.length ? content.goals : FALLBACK.goals;

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Kurumsal", href: "/kurumsal/hakkimizda" },
    { name: page?.title || "Vizyon ve Misyon", href: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="KURUMSAL"
        title={page?.heroTitle || "Geleceğe Değer Katan Yapılar İnşa Ediyoruz"}
        description={
          page?.heroSubtitle ||
          "Vizyonumuz ve misyonumuz, ürettiğimiz her projenin arkasındaki temel yaklaşımı tanımlar."
        }
        image={page?.heroImage || "/images/hero/kurumsal-hero.svg"}
        crumbs={crumbs}
      />

      {/* Vision + Mission */}
      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max grid gap-8 lg:grid-cols-2">
          <article className="flex flex-col border border-warm-border bg-midnight-navy p-10 lg:p-12">
            <span className="mb-6 flex h-14 w-14 items-center justify-center bg-white/10 text-champagne-gold">
              <Icon name="eye" className="h-7 w-7" />
            </span>
            <h2 className="mb-4 font-serif text-3xl text-white">{vision.title}</h2>
            <p className="text-body-lg leading-relaxed text-white/80">{vision.text}</p>
          </article>

          <article className="flex flex-col border border-warm-border bg-white p-10 lg:p-12">
            <span className="mb-6 flex h-14 w-14 items-center justify-center bg-soft-gold/40 text-forest-emerald">
              <Icon name="target" className="h-7 w-7" />
            </span>
            <h2 className="mb-4 font-serif text-3xl text-midnight-navy">{mission.title}</h2>
            <p className="text-body-lg leading-relaxed text-on-surface-variant">{mission.text}</p>
          </article>
        </div>
      </section>

      {/* Goals */}
      <section className="border-t border-warm-border bg-surface-container-low py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <SectionHeading
            eyebrow="HEDEFLERİMİZ"
            title="Bizi Yönlendiren Temel Hedefler"
            className="mb-12"
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {goals.map((goal, i) => (
              <li
                key={i}
                className="flex items-start gap-4 border border-warm-border bg-white p-6"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-forest-emerald text-white">
                  <Icon name="check" className="h-5 w-5" />
                </span>
                <span className="text-body-md leading-relaxed text-on-surface-variant">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        location="kurumsal_vizyon_misyon"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
