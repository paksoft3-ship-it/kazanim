import type { Metadata } from "next";

import { CareerApplicationForm } from "@/components/forms/CareerApplicationForm";
import { Icon, type IconName } from "@/components/public/Icon";
import { PageHero } from "@/components/public/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOpenPositions, getPageBySlug } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { parseJson } from "@/lib/utils";

export const revalidate = 300;
const SLUG = "insan-kaynaklari";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seoTitle || "İnsan Kaynakları | Kazanım Gayrimenkul",
    description:
      page?.seoDescription ||
      "Kazanım Gayrimenkul kariyer fırsatları, açık pozisyonlar ve iş başvuru formu.",
    path: "/insan-kaynaklari",
    ogImage: page?.ogImage,
  });
}

type CareerContent = {
  culture?: Array<{ title: string; text: string }>;
  process?: string[];
};

const FALLBACK_CULTURE = [
  { title: "Ekip Çalışması", text: "Disiplinler arası iş birliğini önceleyen bir çalışma kültürü." },
  { title: "Gelişim", text: "Teknik ve mesleki gelişimi destekleyen bir ortam." },
  { title: "İş Güvenliği", text: "Sahada ve ofiste iş güvenliği önceliğimizdir." },
];
const FALLBACK_PROCESS = [
  "Başvuru formunun doldurulması",
  "İnsan kaynakları ön değerlendirmesi",
  "Teknik görüşme",
  "Sonucun adaya bildirilmesi",
];
const CULTURE_ICONS: IconName[] = ["users", "target", "shield", "handshake"];

function splitLines(value: string | null): string[] {
  return (value ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
}

export default async function InsanKaynaklariPage() {
  const [page, positions] = await Promise.all([getPageBySlug(SLUG), getOpenPositions()]);

  const content = parseJson<CareerContent>(page?.content, {});
  const culture = content.culture && content.culture.length > 0 ? content.culture : FALLBACK_CULTURE;
  const process = content.process && content.process.length > 0 ? content.process : FALLBACK_PROCESS;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", href: "/" },
          { name: "İnsan Kaynakları", href: "/insan-kaynaklari" },
        ])}
      />

      <PageHero
        eyebrow="İNSAN KAYNAKLARI"
        title={page?.heroTitle || "Geleceği Birlikte İnşa Edelim"}
        description={
          page?.heroSubtitle ||
          "Ekibimize katılarak yaşam alanlarına değer katan projelerin bir parçası olun."
        }
        image={page?.heroImage || "/images/hero/kariyer-hero.svg"}
        crumbs={[
          { name: "Ana Sayfa", href: "/" },
          { name: "İnsan Kaynakları", href: "/insan-kaynaklari" },
        ]}
      />

      {/* Culture */}
      <section className="py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <div className="grid gap-6 md:grid-cols-3">
            {culture.map((item, index) => (
              <div key={item.title} className="border border-warm-border bg-white p-8">
                <Icon
                  name={CULTURE_ICONS[index % CULTURE_ICONS.length]}
                  className="mb-5 h-10 w-10 text-forest-emerald"
                />
                <h2 className="mb-3 font-serif text-xl text-midnight-navy">{item.title}</h2>
                <p className="text-body-sm leading-relaxed text-slate">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="border-y border-warm-border bg-surface-container-low py-16 lg:py-section-gap-desktop">
        <div className="container-max">
          <h2 className="mb-10 font-serif text-section-heading-mobile text-midnight-navy">
            Açık Pozisyonlar
          </h2>

          {positions.length === 0 ? (
            <div className="border border-warm-border bg-white p-10 text-center">
              <Icon name="briefcase" className="mx-auto mb-4 h-10 w-10 text-slate/50" />
              <p className="text-slate">
                Şu anda açık pozisyon bulunmuyor. Aşağıdaki formu doldurarak genel başvuru
                yapabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {positions.map((position) => {
                const requirements = splitLines(position.requirements);
                const responsibilities = splitLines(position.responsibilities);
                return (
                  <details
                    key={position.id}
                    className="group border border-warm-border bg-white [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-4 p-6">
                      <div>
                        <h3 className="font-serif text-xl text-midnight-navy">{position.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-body-sm text-slate">
                          {position.department ? (
                            <span className="flex items-center gap-1.5">
                              <Icon name="briefcase" className="h-4 w-4" />
                              {position.department}
                            </span>
                          ) : null}
                          {position.location ? (
                            <span className="flex items-center gap-1.5">
                              <Icon name="map-pin" className="h-4 w-4" />
                              {position.location}
                            </span>
                          ) : null}
                          {position.type ? (
                            <span className="flex items-center gap-1.5">
                              <Icon name="clock" className="h-4 w-4" />
                              {position.type}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <Icon
                        name="chevron-down"
                        className="h-5 w-5 shrink-0 text-forest-emerald transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <div className="space-y-6 border-t border-warm-border p-6">
                      {position.description ? (
                        <p className="text-body-md leading-relaxed text-on-surface-variant">
                          {position.description}
                        </p>
                      ) : null}
                      {responsibilities.length > 0 ? (
                        <div>
                          <h4 className="mb-2 font-semibold text-midnight-navy">Sorumluluklar</h4>
                          <ul className="space-y-1.5">
                            {responsibilities.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-body-sm text-slate">
                                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-forest-emerald" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {requirements.length > 0 ? (
                        <div>
                          <h4 className="mb-2 font-semibold text-midnight-navy">Aranan Nitelikler</h4>
                          <ul className="space-y-1.5">
                            {requirements.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-body-sm text-slate">
                                <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-forest-emerald" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <a
                        href="#basvuru-formu"
                        className="inline-flex bg-forest-emerald px-6 py-3 font-button-text uppercase tracking-[0.12em] text-white transition-colors hover:bg-midnight-navy"
                      >
                        Bu Pozisyona Başvur
                      </a>
                    </div>
                  </details>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process + form */}
      <section className="py-16 lg:py-section-gap-desktop">
        <div className="container-max grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-8 font-serif text-section-heading-mobile text-midnight-navy">
              Başvuru Süreci
            </h2>
            <ol className="space-y-6">
              {process.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-midnight-navy font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-2 text-body-md text-charcoal">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div id="basvuru-formu" className="scroll-mt-28">
            <div className="border-t-4 border-forest-emerald bg-white p-8 shadow-lg lg:p-10">
              <h2 className="mb-1 font-serif text-2xl text-midnight-navy">Başvuru Formu</h2>
              <p className="mb-6 text-body-sm text-slate">
                Formu doldurun, CV&apos;nizi ekleyin ve başvurunuzu tamamlayın.
              </p>
              <CareerApplicationForm
                positions={positions.map((p) => ({ id: p.id, title: p.title }))}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
