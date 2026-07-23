import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/forms/ContactForm";
import { HomeHero } from "@/components/public/HomeHero";
import { Icon, type IconName } from "@/components/public/Icon";
import { NewsCard } from "@/components/public/NewsCard";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectFinder } from "@/components/public/ProjectFinder";
import { SectionHeading } from "@/components/public/SectionHeading";
import { TrackedCTALink } from "@/components/public/TrackedCTALink";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getFeaturedProjects,
  getProjectFilterOptions,
  getPublishedNews,
} from "@/lib/content";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { getSettings, isEnabled, type SiteSettings } from "@/lib/settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata({
    title: settings.defaultSeoTitle,
    description: settings.defaultSeoDescription,
    path: "/",
    ogImage: settings.defaultOgImage,
  });
}

/** Services / activity areas — refined icon-led cards (brief §5.6). */
const SERVICE_ITEMS: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "building",
    title: "Proje Geliştirme",
    text: "Arsa seçiminden proje tasarımına, lokasyona değer katan yaşam alanları geliştiririz.",
  },
  {
    icon: "apartment",
    title: "Konut Projeleri",
    text: "Modern mimariyle tasarlanan, uzun vadeli değer üreten nitelikli konut projeleri.",
  },
  {
    icon: "briefcase",
    title: "Ticari Projeler",
    text: "Doğru konumda, sürdürülebilir getiri hedefiyle planlanan ticari yaşam alanları.",
  },
  {
    icon: "bar-chart",
    title: "Gayrimenkul Değerlendirme",
    text: "Lokasyon ve proje analizine dayalı, şeffaf ve gerçekçi değerlendirme yaklaşımı.",
  },
  {
    icon: "handshake",
    title: "Satış ve Pazarlama Süreçleri",
    text: "Profesyonel pazarlama ve satış stratejileriyle hedefe yönelik, güvenli süreç yönetimi.",
  },
  {
    icon: "users",
    title: "Satış Sonrası İletişim",
    text: "Teslim sonrasında da süren destek ve düzenli, şeffaf iletişim anlayışı.",
  },
];

/** Trust strip — dark navy/emerald highlights (brief §5.7). */
const TRUST_ITEMS: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "map-pin",
    title: "Doğru Lokasyon",
    text: "Değer üretme potansiyeli yüksek bölgelerde stratejik proje seçimi.",
  },
  {
    icon: "diamond",
    title: "Nitelikli Proje",
    text: "Kaliteli malzeme ve özenli mimariyle uzun ömürlü yaşam alanları.",
  },
  {
    icon: "eye",
    title: "Şeffaf Süreç",
    text: "Her aşamada açık, dürüst ve izlenebilir proje iletişimi.",
  },
  {
    icon: "leaf",
    title: "Sürdürülebilir Değer",
    text: "Kalıcı yaşam kalitesi ve uzun vadeli değer artışı hedefi.",
  },
  {
    icon: "shield",
    title: "Güvenilir İletişim",
    text: "Karar öncesinde ve sonrasında her zaman ulaşılabilir bir ekip.",
  },
];

/** Process timeline — horizontal on desktop, vertical on mobile (brief §5.8). */
const PROCESS_STEPS: Array<{ title: string; text: string }> = [
  {
    title: "İhtiyaç Analizi",
    text: "Hedeflerinizi dinler, size en uygun yatırım stratejisini birlikte belirleriz.",
  },
  {
    title: "Proje ve Lokasyon Değerlendirmesi",
    text: "Doğru lokasyon ve proje seçeneklerini analiz ederek sunarız.",
  },
  {
    title: "Bilgilendirme",
    text: "Proje detayları, teslim planı ve süreç hakkında şeffaf bilgi paylaşırız.",
  },
  {
    title: "Karar Süreci",
    text: "Karar aşamasında sorularınızı yanıtlar, süreci güvenceye alırız.",
  },
  {
    title: "Teslim ve İletişim",
    text: "Teslim sonrasında da iletişimi sürdürür, uzun vadeli destek sağlarız.",
  },
];

export default async function HomePage() {
  const settings = await getSettings();
  const [featured, news, finderOptions, localBusiness] = await Promise.all([
    getFeaturedProjects(3),
    getPublishedNews(3),
    getProjectFilterOptions(),
    localBusinessJsonLd(),
  ]);

  const stats = [
    { value: settings.statCompletedValue, label: settings.statCompletedLabel },
    { value: settings.statOngoingValue, label: settings.statOngoingLabel },
    { value: settings.statDeliveredValue, label: settings.statDeliveredLabel },
    { value: settings.statExperienceValue, label: settings.statExperienceLabel },
  ].filter((stat) => stat.value && stat.label);
  const showStats = isEnabled(settings.statsVisible) && stats.length > 0;

  const sections: Record<string, React.ReactNode> = {
    about: isEnabled(settings.aboutVisible) ? (
      <AboutSection key="about" settings={settings} showStats={showStats} stats={stats} />
    ) : null,
    featured:
      isEnabled(settings.featuredVisible) && featured.length > 0 ? (
        <section key="featured" className="bg-deep-emerald py-16 lg:py-section-gap-desktop">
          <div className="container-max">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow={settings.featuredEyebrow}
                title={settings.featuredTitle}
                variant="dark"
              />
              <TrackedCTALink
                href="/projeler"
                label="Tüm Projeleri Gör"
                location="home_featured"
                className="hidden border-b border-champagne-gold pb-1 font-button-text uppercase tracking-[0.1em] text-soft-gold transition-colors hover:text-champagne-gold lg:block"
              >
                Tüm Projeleri Gör →
              </TrackedCTALink>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((project, index) => (
                <ProjectCard key={project.id} project={project} priority={index === 0} />
              ))}
            </div>
            <div className="mt-10 text-center lg:hidden">
              <TrackedCTALink
                href="/projeler"
                label="Tüm Projeleri Gör"
                location="home_featured"
                className="inline-block border border-champagne-gold px-8 py-3 font-button-text uppercase tracking-[0.12em] text-soft-gold"
              >
                Tüm Projeleri Gör
              </TrackedCTALink>
            </div>
          </div>
        </section>
      ) : null,
    services: isEnabled(settings.servicesVisible) ? (
      <section key="services" className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <SectionHeading
            eyebrow={settings.servicesEyebrow}
            title={settings.servicesTitle}
            className="mb-14"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_ITEMS.map((item) => (
              <div
                key={item.title}
                className="group border border-warm-border bg-white p-8 transition-colors hover:border-champagne-gold/60"
              >
                <span className="mb-6 flex h-14 w-14 items-center justify-center border border-champagne-gold/40 text-deep-emerald transition-colors group-hover:border-champagne-gold">
                  <Icon name={item.icon} className="h-7 w-7" />
                </span>
                <h3 className="mb-3 font-serif text-xl font-semibold text-midnight-navy">
                  {item.title}
                </h3>
                <p className="text-body-sm leading-relaxed text-slate">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    trust: isEnabled(settings.trustVisible) ? (
      <section key="trust" className="bg-midnight-navy py-16 lg:py-20">
        <div className="container-max">
          <SectionHeading
            eyebrow={settings.trustEyebrow}
            title={settings.trustTitle}
            variant="dark"
            align="center"
            className="mb-14"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="text-center">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-champagne-gold/40 text-champagne-gold">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <h3 className="mb-2 font-serif text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-body-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    process: isEnabled(settings.processVisible) ? (
      <section key="process" className="bg-soft-cream py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <SectionHeading
            eyebrow={settings.processEyebrow}
            title={settings.processTitle}
            className="mb-14"
          />
          <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
            {/* Connecting line, desktop only */}
            <div
              aria-hidden
              className="absolute left-6 top-0 h-full w-px bg-warm-border lg:left-0 lg:top-6 lg:h-px lg:w-full"
            />
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="relative pl-16 lg:pl-0 lg:pt-16">
                <span className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center border border-champagne-gold bg-white font-serif text-lg font-bold text-deep-emerald">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 font-serif text-lg font-semibold text-midnight-navy">
                  {step.title}
                </h3>
                <p className="text-body-sm leading-relaxed text-slate">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    ) : null,
    news:
      isEnabled(settings.newsVisible) && news.length > 0 ? (
        <section key="news" className="bg-dark-navy py-16 lg:py-section-gap-desktop">
          <div className="container-max">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow={settings.newsEyebrow}
                title={settings.newsTitle}
                variant="dark"
              />
              <TrackedCTALink
                href="/haberler"
                label="Tüm Haberleri Gör"
                location="home_news"
                className="hidden border-b border-champagne-gold pb-1 font-button-text uppercase tracking-[0.1em] text-soft-gold transition-colors hover:text-champagne-gold lg:block"
              >
                Tüm Haberleri Gör →
              </TrackedCTALink>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      ) : null,
    leadform: isEnabled(settings.leadFormVisible) ? (
      <section key="leadform" className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={settings.leadFormEyebrow}
              title={settings.leadFormTitle}
              description={settings.leadFormBody}
            />
            <div className="mt-10 space-y-6">
              {settings.phone ? (
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-champagne-gold/40 bg-white">
                    <Icon name="phone" className="h-5 w-5 text-deep-emerald" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-midnight-navy">Telefon</h3>
                    <p className="text-body-sm text-slate">{settings.phone}</p>
                  </div>
                </div>
              ) : null}
              {settings.email ? (
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-champagne-gold/40 bg-white">
                    <Icon name="mail" className="h-5 w-5 text-deep-emerald" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-midnight-navy">E-Posta</h3>
                    <p className="break-all text-body-sm text-slate">{settings.email}</p>
                  </div>
                </div>
              ) : null}
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-champagne-gold/40 bg-white">
                  <Icon name="check-circle" className="h-5 w-5 text-deep-emerald" />
                </span>
                <div>
                  <h3 className="font-semibold text-midnight-navy">Hızlı Dönüş</h3>
                  <p className="text-body-sm text-slate">
                    Talebiniz kaydedilir ve ekibimiz en kısa sürede sizinle iletişime geçer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-4 border-champagne-gold bg-white p-8 shadow-2xl lg:p-10">
            <ContactForm
              compact
              formLocation="homepage_lead"
              submitLabel="Bilgi Talep Et"
            />
          </div>
        </div>
      </section>
    ) : null,
  };

  const order = settings.homeSectionOrder
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
  // Any section missing from the configured order still renders at the end.
  const remaining = Object.keys(sections).filter((key) => !order.includes(key));

  return (
    <>
      <JsonLd data={localBusiness} />

      <HomeHero
        eyebrow={settings.heroEyebrow}
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        image={settings.heroImage}
        primaryCta={settings.heroPrimaryCta}
        primaryCtaUrl={settings.heroPrimaryCtaUrl}
        secondaryCta={settings.heroSecondaryCta}
        secondaryCtaUrl={settings.heroSecondaryCtaUrl}
        whatsappNumber={
          isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappNumber : ""
        }
        whatsappMessage={settings.whatsappMessage}
      />

      {isEnabled(settings.finderVisible) ? (
        <ProjectFinder options={finderOptions} />
      ) : null}

      {[...order, ...remaining].map((key) => sections[key] ?? null)}
    </>
  );
}

/** About / value introduction with optional statistic row (brief §5.4). */
function AboutSection({
  settings,
  showStats,
  stats,
}: {
  settings: SiteSettings;
  showStats: boolean;
  stats: Array<{ value: string; label: string }>;
}) {
  return (
    <section className="py-16 lg:py-section-gap-desktop">
      <div className="container-max grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden border border-warm-border">
            <Image
              src={settings.aboutImage}
              alt="Kazanım Gayrimenkul projelerinden mimari görsel"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute -bottom-6 -right-4 hidden h-40 w-40 border border-champagne-gold/50 lg:block"
          />
        </div>

        <div>
          <SectionHeading eyebrow={settings.aboutEyebrow} title={settings.aboutTitle} />
          <div className="mt-8 space-y-6 text-body-md leading-relaxed text-on-surface-variant">
            {settings.aboutBody
              .split("\n")
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
          </div>

          {showStats ? (
            <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-warm-border pt-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-serif text-3xl font-bold text-deep-emerald">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-slate">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}

          <Link
            href="/kurumsal/hakkimizda"
            className="group mt-10 inline-flex items-center gap-4 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:text-deep-emerald"
          >
            Hakkımızda Daha Fazla
            <span className="h-px w-12 bg-champagne-gold transition-all group-hover:w-20" />
          </Link>
        </div>
      </div>
    </section>
  );
}
