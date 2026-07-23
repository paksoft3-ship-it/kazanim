import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { ContactChannels } from "@/components/public/ContactChannels";
import { Icon } from "@/components/public/Icon";
import { PageHero } from "@/components/public/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPageBySlug } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { parseJson } from "@/lib/utils";

export const revalidate = 300;
const SLUG = "iletisim";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  return buildMetadata({
    title: page?.seoTitle || "İletişim | Kazanım Gayrimenkul",
    description:
      page?.seoDescription ||
      "Kazanım Gayrimenkul ile iletişime geçin. Projelerimiz ve yatırım fırsatları hakkında bilgi almak için bize ulaşın.",
    path: "/iletisim",
    ogImage: page?.ogImage,
  });
}

type ContactContent = { faq?: Array<{ q: string; a: string }> };

const FALLBACK_FAQ = [
  {
    q: "Projeleriniz hakkında nasıl bilgi alabilirim?",
    a: "İletişim formunu doldurabilir, telefon veya WhatsApp üzerinden bize ulaşabilirsiniz. Ekibimiz en kısa sürede size dönüş yapacaktır.",
  },
  {
    q: "Satış ofisinizi ziyaret edebilir miyim?",
    a: "Randevu talebinizi iletişim formu üzerinden iletebilirsiniz. Uygun bir zaman planlayarak sizi bilgilendiririz.",
  },
  {
    q: "İş başvurusu nasıl yapabilirim?",
    a: "İnsan Kaynakları sayfamızdaki başvuru formunu doldurarak açık pozisyonlara veya genel havuza başvurabilirsiniz.",
  },
];

export default async function IletisimPage() {
  const [page, settings, localBusiness] = await Promise.all([
    getPageBySlug(SLUG),
    getSettings(),
    localBusinessJsonLd(),
  ]);

  const content = parseJson<ContactContent>(page?.content, {});
  const faq = content.faq && content.faq.length > 0 ? content.faq : FALLBACK_FAQ;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Ana Sayfa", href: "/" },
            { name: "İletişim", href: "/iletisim" },
          ]),
          localBusiness,
        ]}
      />

      <PageHero
        eyebrow="İLETİŞİM"
        title={page?.heroTitle || "Projelerimiz Hakkında Bilgi Alın"}
        description={
          page?.heroSubtitle ||
          "Projelerimiz, yatırım fırsatları ve talepleriniz için bize ulaşabilirsiniz."
        }
        image={page?.heroImage || "/images/hero/iletisim-hero.svg"}
        crumbs={[
          { name: "Ana Sayfa", href: "/" },
          { name: "İletişim", href: "/iletisim" },
        ]}
      />

      <section className="py-16 lg:py-section-gap-desktop">
        <div className="container-max grid gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Left: channels + map */}
          <div>
            <h2 className="mb-8 font-serif text-section-heading-mobile text-midnight-navy">
              Bize Ulaşın
            </h2>
            <ContactChannels
              phone={settings.phone}
              whatsappNumber={settings.whatsappNumber}
              whatsappMessage={settings.whatsappMessage}
              email={settings.email}
              address={settings.address}
              mapsUrl={settings.mapsUrl}
              workingHours={settings.workingHours}
            />

            {/* Map — only when confirmed location details exist */}
            {settings.mapsEmbedUrl || (settings.mapsUrl && settings.address) ? (
              <div className="mt-6">
                {settings.mapsEmbedUrl ? (
                  <div className="aspect-[16/10] overflow-hidden border border-warm-border">
                    <iframe
                      src={settings.mapsEmbedUrl}
                      title="Ofis konumu haritası"
                      className="h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <a
                    href={settings.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex aspect-[16/10] flex-col items-center justify-center gap-3 border border-warm-border bg-surface-container-low text-center transition-colors hover:border-forest-emerald"
                  >
                    <Icon name="map-pin" className="h-10 w-10 text-champagne-gold" />
                    <span className="font-semibold text-midnight-navy">{settings.address}</span>
                    <span className="flex items-center gap-1.5 text-body-sm text-forest-emerald">
                      Haritada Aç <Icon name="external-link" className="h-4 w-4" />
                    </span>
                  </a>
                )}
              </div>
            ) : null}
          </div>

          {/* Right: form */}
          <div id="iletisim-formu" className="scroll-mt-28">
            <div className="border-t-4 border-champagne-gold bg-white p-8 shadow-lg lg:p-10">
              <h2 className="mb-1 font-serif text-2xl text-midnight-navy">Bilgi Talep Formu</h2>
              <p className="mb-6 text-body-sm text-slate">
                Formu doldurun, ekibimiz en kısa sürede sizinle iletişime geçsin.
              </p>
              <ContactForm formLocation="contact_page" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-warm-border bg-surface-container-low py-16">
        <div className="container-max max-w-3xl">
          <h2 className="mb-10 text-center font-serif text-section-heading-mobile text-midnight-navy">
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group border border-warm-border bg-white [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-semibold text-midnight-navy">
                  {item.q}
                  <Icon
                    name="chevron-down"
                    className="h-5 w-5 shrink-0 text-forest-emerald transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="border-t border-warm-border px-5 py-4 text-body-md leading-relaxed text-on-surface-variant">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
