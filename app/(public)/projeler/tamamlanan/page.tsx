import type { Metadata } from "next";

import { CTASection } from "@/components/public/CTASection";
import { EmptyProjects } from "@/components/public/EmptyProjects";
import { PageHero } from "@/components/public/PageHero";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectListTracker } from "@/components/public/ProjectListTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedProjects } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Tamamlanan Projeler | Kazanım Gayrimenkul",
    description:
      "Kazanım Gayrimenkul'ün tamamlanan projelerini inceleyin; teslim edilen yaşam alanlarımızı yakından tanıyın.",
    path: "/projeler/tamamlanan",
  });
}

export default async function TamamlananPage() {
  const [projects, settings] = await Promise.all([
    getPublishedProjects("COMPLETED"),
    getSettings(),
  ]);

  return (
    <>
      <ProjectListTracker label="tamamlanan_projeler" count={projects.length} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", href: "/" },
          { name: "Projeler", href: "/projeler" },
          { name: "Tamamlanan Projeler", href: "/projeler/tamamlanan" },
        ])}
      />

      <PageHero
        eyebrow="TAMAMLANAN PROJELER"
        title="Hayata Geçirdiğimiz Kalıcı Değerler"
        description="Tamamlanarak sakinlerine teslim edilen projelerimizle güvenilir yapı anlayışımızı görün."
        image="/images/hero/projeler-hero.svg"
        crumbs={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Projeler", href: "/projeler" },
          { name: "Tamamlanan", href: "/projeler/tamamlanan" },
        ]}
      />

      <section className="py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          {projects.length === 0 ? (
            <EmptyProjects message="Tamamlanan projeler yakında burada listelenecek." />
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} priority={index === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Projelerimiz Hakkında Bilgi Alın"
        location="tamamlanan_cta"
        whatsappNumber={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappNumber : undefined}
        whatsappMessage={settings.whatsappMessage}
      />
    </>
  );
}
