import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectLeadForm } from "@/components/forms/ProjectLeadForm";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Icon, type IconName } from "@/components/public/Icon";
import { ProjectCard } from "@/components/public/ProjectCard";
import {
  ProjectDocuments,
  ProjectGallery,
  ProjectViewTracker,
  type GalleryImage,
} from "@/components/public/ProjectDetailClient";
import { NewsCard } from "@/components/public/NewsCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProjectBySlug, getProjectOptions, getPublishedProjects } from "@/lib/content";
import { PROJECT_STATUS_LABELS } from "@/lib/navigation";
import {
  breadcrumbJsonLd,
  buildMetadata,
  projectJsonLd,
} from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";
import { formatDateTR, parseJson, whatsappUrl } from "@/lib/utils";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return buildMetadata({ title: "Proje Bulunamadı", path: `/projeler/${slug}`, robots: "noindex, follow" });
  }
  return buildMetadata({
    title: project.seoTitle || `${project.title} | Kazanım Gayrimenkul`,
    description: project.seoDescription || project.shortDescription,
    path: `/projeler/${project.slug}`,
    ogImage: project.ogImage || project.coverImage,
    canonicalUrl: project.canonicalUrl,
    robots: project.robots,
  });
}

type ProgressItem = { label: string; value: number };
type TechDetail = { label: string; value: string };
type DocItem = { label: string; url: string };

const STATUS_BADGE: Record<string, string> = {
  ONGOING: "bg-forest-emerald text-white",
  COMPLETED: "bg-white/95 text-midnight-navy",
  UPCOMING: "bg-champagne-gold text-midnight-navy",
};

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const [project, allProjects, projectCards, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjectOptions(),
    getPublishedProjects(),
    getSettings(),
  ]);

  if (!project) notFound();

  const progressItems = parseJson<ProgressItem[]>(project.progressItems, []);
  const features = parseJson<string[]>(project.features, []);
  const technicalDetails = parseJson<TechDetail[]>(project.technicalDetails, []);
  const documents = parseJson<DocItem[]>(project.documents, []);
  const gallery = parseJson<string[]>(project.gallery, []);

  const statusLabel = PROJECT_STATUS_LABELS[project.status] ?? project.status;
  const whatsappEnabled = isEnabled(settings.floatingWhatsappEnabled);

  // Quick facts — only render rows the admin actually filled in.
  const quickFacts: Array<{ icon: IconName; label: string; value: string }> = [];
  if (project.location) quickFacts.push({ icon: "map-pin", label: "Konum", value: project.location });
  if (project.type) quickFacts.push({ icon: "building", label: "Proje Türü", value: project.type });
  quickFacts.push({ icon: "info", label: "Durum", value: statusLabel });
  if (project.status === "ONGOING") {
    quickFacts.push({ icon: "bar-chart", label: "İlerleme", value: `%${project.progressOverall}` });
  }
  if (project.deliveryDate) {
    quickFacts.push({ icon: "calendar", label: "Teslim", value: formatDateTR(project.deliveryDate) });
  }

  // Gallery: media relations first, then any extra gallery URLs.
  const galleryImages: GalleryImage[] = [
    ...project.media.map((m) => ({ url: m.url, alt: m.altText || m.title || project.title })),
    ...gallery
      .filter((url) => !project.media.some((m) => m.url === url))
      .map((url) => ({ url, alt: project.title })),
  ];

  const related = projectCards.filter((p) => p.slug !== project.slug).slice(0, 3);
  const currentOption = { id: project.id, title: project.title, slug: project.slug };

  const paragraphs = (project.description ?? "").split("\n").filter((p) => p.trim());

  return (
    <>
      <ProjectViewTracker
        payload={{
          project_id: project.id,
          project_slug: project.slug,
          project_name: project.title,
          project_status: project.status,
          project_type: project.type ?? undefined,
        }}
      />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Ana Sayfa", href: "/" },
            { name: "Projeler", href: "/projeler" },
            { name: project.title, href: `/projeler/${project.slug}` },
          ]),
          projectJsonLd({
            name: project.title,
            description: project.shortDescription,
            image: project.coverImage,
            location: project.location,
            path: `/projeler/${project.slug}`,
          }),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-midnight-navy">
        <Image
          src={project.coverImage || "/images/projects/proje-placeholder.jpg"}
          alt={`${project.title} projesi`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight-navy via-midnight-navy/70 to-midnight-navy/40" />
        <div className="container-max relative z-10 pb-14 pt-32 lg:pb-20 lg:pt-44">
          <Breadcrumbs
            items={[
              { name: "Ana Sayfa", href: "/" },
              { name: "Projeler", href: "/projeler" },
              { name: project.title, href: `/projeler/${project.slug}` },
            ]}
          />
          <span className={`mt-6 inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] ${STATUS_BADGE[project.status] ?? STATUS_BADGE.COMPLETED}`}>
            {statusLabel}
          </span>
          <h1 className="mt-4 max-w-3xl font-serif text-hero-heading-mobile text-white lg:text-[56px] lg:leading-tight">
            {project.title}
          </h1>
          {project.slogan ? (
            <p className="mt-5 max-w-2xl text-body-lg text-white/80">{project.slogan}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#bilgi-formu"
              className="bg-white px-8 py-3.5 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:bg-soft-gold"
            >
              Bilgi Talep Et
            </Link>
            {whatsappEnabled ? (
              <a
                href={whatsappUrl(settings.whatsappNumber, `${project.title} projesi hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-champagne-gold px-8 py-3.5 font-button-text uppercase tracking-[0.12em] text-champagne-gold transition-colors hover:bg-champagne-gold hover:text-midnight-navy"
              >
                <Icon name="whatsapp" filled className="h-5 w-5" />
                WhatsApp ile Görüş
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* Quick facts */}
      {quickFacts.length > 0 ? (
        <section className="border-b border-warm-border bg-surface-container-low">
          <div className="container-max grid grid-cols-2 gap-px md:grid-cols-3 lg:grid-cols-5">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3 bg-surface-container-low px-2 py-6">
                <Icon name={fact.icon} className="h-6 w-6 shrink-0 text-champagne-gold" />
                <div className="min-w-0">
                  <p className="font-label-caps uppercase tracking-wider text-slate">{fact.label}</p>
                  <p className="truncate font-semibold text-midnight-navy">{fact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="py-16 lg:py-section-gap-desktop">
        <div className="container-max grid gap-14 lg:grid-cols-3 lg:gap-16">
          {/* Main column */}
          <div className="space-y-14 lg:col-span-2">
            {paragraphs.length > 0 ? (
              <div>
                <h2 className="mb-6 font-serif text-section-heading-mobile text-midnight-navy">
                  Proje Hakkında
                </h2>
                <div className="space-y-5 text-body-md leading-relaxed text-on-surface-variant">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : null}

            {progressItems.length > 0 ? (
              <div>
                <h2 className="mb-6 font-serif text-2xl text-midnight-navy">İnşaat İlerlemesi</h2>
                <div className="space-y-5">
                  {progressItems.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between text-body-sm">
                        <span className="font-medium text-charcoal">{item.label}</span>
                        <span className="font-semibold text-forest-emerald">%{item.value}</span>
                      </div>
                      <div
                        className="h-2 w-full bg-warm-border"
                        role="progressbar"
                        aria-valuenow={item.value}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={item.label}
                      >
                        <div className="h-full bg-forest-emerald" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {features.length > 0 ? (
              <div>
                <h2 className="mb-6 font-serif text-2xl text-midnight-navy">Proje Özellikleri</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 border border-warm-border/60 bg-white p-4">
                      <Icon name="check-circle" className="mt-0.5 h-5 w-5 shrink-0 text-success-green" />
                      <span className="text-body-sm text-charcoal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {galleryImages.length > 0 ? (
              <div>
                <h2 className="mb-6 font-serif text-2xl text-midnight-navy">Proje Galerisi</h2>
                <ProjectGallery images={galleryImages} projectName={project.title} />
              </div>
            ) : null}

            {project.videoUrl ? (
              <div>
                <h2 className="mb-6 font-serif text-2xl text-midnight-navy">Proje Videosu</h2>
                <div className="relative aspect-video overflow-hidden border border-warm-border">
                  <iframe
                    src={project.videoUrl}
                    title={`${project.title} tanıtım videosu`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            {project.mapsUrl ? (
              <div>
                <h2 className="mb-6 font-serif text-2xl text-midnight-navy">Konum</h2>
                <a
                  href={project.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-warm-border bg-white p-6 transition-colors hover:border-forest-emerald"
                >
                  <span className="flex items-center gap-3">
                    <Icon name="map-pin" className="h-6 w-6 text-champagne-gold" />
                    <span className="font-medium text-charcoal">
                      {project.location || "Harita üzerinde görüntüle"}
                    </span>
                  </span>
                  <Icon name="external-link" className="h-5 w-5 text-slate" />
                </a>
              </div>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-28">
              {technicalDetails.length > 0 ? (
                <div className="border border-warm-border bg-white p-6">
                  <h2 className="mb-4 font-serif text-xl text-midnight-navy">Teknik Bilgiler</h2>
                  <dl className="divide-y divide-warm-border/60">
                    {technicalDetails.map((detail) => (
                      <div key={detail.label} className="flex justify-between gap-4 py-3 text-body-sm">
                        <dt className="text-slate">{detail.label}</dt>
                        <dd className="text-right font-semibold text-charcoal">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {documents.length > 0 ? (
                <div className="border border-warm-border bg-white p-6">
                  <h2 className="mb-4 font-serif text-xl text-midnight-navy">Dokümanlar</h2>
                  <ProjectDocuments
                    documents={documents}
                    projectName={project.title}
                    projectSlug={project.slug}
                  />
                </div>
              ) : null}

              <div id="bilgi-formu" className="scroll-mt-28 border-t-4 border-forest-emerald bg-white p-6 shadow-lg">
                <h2 className="mb-1 font-serif text-xl text-midnight-navy">Proje Bilgi Talebi</h2>
                <p className="mb-5 text-body-sm text-slate">
                  Bu proje hakkında detaylı bilgi için formu doldurun.
                </p>
                <ProjectLeadForm
                  projects={allProjects}
                  currentProject={currentOption}
                  formLocation="project_detail_sidebar"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related news */}
      {project.news.length > 0 ? (
        <section className="border-t border-warm-border bg-surface-container-low py-16">
          <div className="container-max">
            <h2 className="mb-10 font-serif text-section-heading-mobile text-midnight-navy">
              Bu Projeyle İlgili Haberler
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {project.news.map((article) => (
                <NewsCard
                  key={article.id}
                  article={{
                    id: article.id,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    coverImage: article.coverImage,
                    category: article.category,
                    publishedAt: article.publishedAt,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Related projects */}
      {related.length > 0 ? (
        <section className="py-16 lg:py-section-gap-desktop">
          <div className="container-max">
            <h2 className="mb-10 font-serif text-section-heading-mobile text-midnight-navy">
              Diğer Projeler
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((card) => (
                <ProjectCard key={card.id} project={card} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
