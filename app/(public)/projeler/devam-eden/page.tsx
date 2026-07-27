import type { Metadata } from "next";

import { CTASection } from "@/components/public/CTASection";
import { PageHero } from "@/components/public/PageHero";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectListTracker } from "@/components/public/ProjectListTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { EmptyProjects } from "@/components/public/EmptyProjects";
import { getPublishedProjects } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Devam Eden Projeler | Kazanım Gayrimenkul",
    description:
      "Kazanım Gayrimenkul'ün devam eden konut ve ticari projelerini inceleyin; teslim planları ve proje detayları hakkında bilgi alın.",
    path: "/projeler/devam-eden",
  });
}

export default async function DevamEdenPage() {
  const [projects, settings] = await Promise.all([
    getPublishedProjects("ONGOING"),
    getSettings(),
  ]);

  return (
    <>
      <ProjectListTracker label="devam_eden_projeler" count={projects.length} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", href: "/" },
          { name: "Projeler", href: "/projeler" },
          { name: "Devam Eden Projeler", href: "/projeler/devam-eden" },
        ])}
      />

      <PageHero
        eyebrow="DEVAM EDEN PROJELER"
        title="Geleceğin Yaşam Alanları Bugünden İnşa Ediliyor"
        description="İnşaat sürecinde olan projelerimizi ve ilerleme durumlarını inceleyin."
        image="/images/hero/projeler-hero.jpg"
        crumbs={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Projeler", href: "/projeler" },
          { name: "Devam Eden", href: "/projeler/devam-eden" },
        ]}
      />

      <section className="py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          {projects.length === 0 ? (
            <EmptyProjects message="Şu anda devam eden proje bulunmuyor. Tamamlanan projelerimizi inceleyebilirsiniz." />
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
        title="Devam Eden Projeler Hakkında Bilgi Alın"
        location="devam_eden_cta"
        whatsappNumber={isEnabled(settings.floatingWhatsappEnabled) ? settings.whatsappNumber : undefined}
        whatsappMessage={settings.whatsappMessage}
      />
    </>
  );
}
