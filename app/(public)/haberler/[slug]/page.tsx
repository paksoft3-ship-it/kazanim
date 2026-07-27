import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { type Crumb } from "@/components/public/Breadcrumbs";
import { CTASection } from "@/components/public/CTASection";
import { Icon } from "@/components/public/Icon";
import { NewsCard } from "@/components/public/NewsCard";
import { NewsShareButtons } from "@/components/public/NewsShareButtons";
import { NewsViewTracker } from "@/components/public/NewsViewTracker";
import { PageHero } from "@/components/public/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNewsBySlug, getRelatedNews } from "@/lib/content";
import { PROJECT_STATUS_LABELS } from "@/lib/navigation";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";
import { formatDateTR } from "@/lib/utils";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return buildMetadata({ title: "Haber Bulunamadı", path: `/haberler/${slug}`, robots: "noindex, follow" });
  }

  return buildMetadata({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    ogImage: article.ogImage || article.coverImage,
    canonicalUrl: article.canonicalUrl,
    robots: article.robots,
    path: `/haberler/${slug}`,
    type: "article",
    publishedTime: article.publishedAt,
  });
}

export default async function HaberDetayPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) notFound();

  const [related, settings] = await Promise.all([
    getRelatedNews(slug),
    getSettings(),
  ]);

  const paragraphs = (article.content ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const crumbs: Crumb[] = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Haberler", href: "/haberler" },
    { name: article.title, href: `/haberler/${slug}` },
  ];

  const project = article.relatedProject;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          articleJsonLd({
            title: article.title,
            description: article.excerpt,
            image: article.coverImage,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt,
            path: `/haberler/${slug}`,
            publisher: settings.companyName,
            publisherLogo: settings.logoPath,
          }),
        ]}
      />
      <NewsViewTracker slug={slug} category={article.category} />

      <PageHero
        eyebrow={article.category}
        title={article.title}
        image={article.coverImage || "/images/hero/haberler-hero.jpg"}
        crumbs={crumbs}
        meta={
          article.publishedAt ? (
            <div className="flex items-center gap-2 text-body-sm text-white/80">
              <Icon name="calendar" className="h-4 w-4" />
              <time dateTime={new Date(article.publishedAt).toISOString()}>
                {formatDateTR(article.publishedAt)}
              </time>
            </div>
          ) : null
        }
      />

      <section className="bg-warm-ivory py-16 lg:py-section-gap-desktop">
        <div className="container-max grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          {/* Article body */}
          <article className="max-w-2xl">
            {article.coverImage ? (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden border border-warm-border">
                <Image
                  src={article.coverImage}
                  alt={`${article.title} haber görseli`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            {article.excerpt ? (
              <p className="mb-8 border-l-2 border-champagne-gold pl-6 font-serif text-2xl leading-snug text-midnight-navy">
                {article.excerpt}
              </p>
            ) : null}

            <div className="space-y-6">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-body-md leading-relaxed text-on-surface-variant">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-body-md leading-relaxed text-on-surface-variant">
                  Bu haber için içerik yakında eklenecektir.
                </p>
              )}
            </div>

            <div className="mt-12 border-t border-warm-border pt-8">
              <NewsShareButtons
                slug={slug}
                title={article.title}
                url={absoluteUrl(`/haberler/${slug}`)}
              />
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            {/* Article info */}
            <div className="border border-warm-border bg-white p-6">
              <h2 className="mb-4 font-label-caps uppercase tracking-[0.15em] text-forest-emerald">
                Haber Bilgileri
              </h2>
              <dl className="space-y-3 text-body-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate">Kategori</dt>
                  <dd className="font-medium text-midnight-navy">{article.category}</dd>
                </div>
                {article.publishedAt ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate">Tarih</dt>
                    <dd className="font-medium text-midnight-navy">
                      {formatDateTR(article.publishedAt)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {/* Linked project */}
            {project ? (
              <div className="border border-warm-border bg-white p-6">
                <h2 className="mb-4 font-label-caps uppercase tracking-[0.15em] text-forest-emerald">
                  İlgili Proje
                </h2>
                <Link
                  href={`/projeler/${project.slug}`}
                  className="group block overflow-hidden border border-warm-border/60"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.coverImage || "/images/projects/proje-placeholder.jpg"}
                      alt={`${project.title} projesi görseli`}
                      fill
                      loading="lazy"
                      sizes="340px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="font-label-caps uppercase tracking-[0.08em] text-slate">
                      {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                    </span>
                    <h3 className="mt-1 font-serif text-lg text-midnight-navy transition-colors group-hover:text-forest-emerald">
                      {project.title}
                    </h3>
                    {project.location ? (
                      <p className="mt-1 flex items-center gap-1.5 text-body-sm text-slate">
                        <Icon name="map-pin" className="h-4 w-4 text-champagne-gold" />
                        {project.location}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </div>
            ) : null}

            {/* Recent news */}
            {related.length > 0 ? (
              <div className="border border-warm-border bg-white p-6">
                <h2 className="mb-4 font-label-caps uppercase tracking-[0.15em] text-forest-emerald">
                  Son Haberler
                </h2>
                <ul className="space-y-4">
                  {related.map((item) => (
                    <li key={item.id} className="border-b border-warm-border/60 pb-4 last:border-0 last:pb-0">
                      <Link href={`/haberler/${item.slug}`} className="group flex gap-3">
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden border border-warm-border/60">
                          <Image
                            src={item.coverImage || "/images/news/kurumsal-duyuru.svg"}
                            alt={`${item.title} haber görseli`}
                            fill
                            loading="lazy"
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="line-clamp-2 text-body-sm font-medium leading-snug text-midnight-navy transition-colors group-hover:text-forest-emerald">
                            {item.title}
                          </h3>
                          {item.publishedAt ? (
                            <time
                              dateTime={new Date(item.publishedAt).toISOString()}
                              className="mt-1 block text-[12px] text-slate"
                            >
                              {formatDateTR(item.publishedAt)}
                            </time>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {/* More news grid */}
      {related.length > 0 ? (
        <section className="border-t border-warm-border bg-surface-container-low py-16 lg:py-section-gap-desktop">
          <div className="container-max">
            <h2 className="mb-12 font-serif text-section-heading-mobile text-midnight-navy lg:text-section-heading">
              Diğer Haberler
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <NewsCard key={item.id} article={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        location="haber_detay"
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappMessage : undefined}
      />
    </>
  );
}
