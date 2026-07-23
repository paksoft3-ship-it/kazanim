import { CookieConsentBanner } from "@/components/public/CookieConsentBanner";
import { FloatingContactButtons } from "@/components/public/FloatingContactButtons";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicHeaderShell } from "@/components/public/PublicHeaderShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { GTMNoScript, GTMProvider } from "@/components/tracking/GTMProvider";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getSettings, isEnabled } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const organization = await organizationJsonLd();

  // Env var wins; the admin-editable setting is the fallback.
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || settings.gtmId;

  return (
    <>
      <GTMProvider gtmId={gtmId} />
      <GTMNoScript gtmId={gtmId} />

      <JsonLd data={[organization, websiteJsonLd(settings.companyName)]} />

      <PublicHeaderShell
        companyName={settings.companyName}
        logoPath={settings.logoPath}
        phone={settings.phone}
      />

      <main id="main-content">{children}</main>

      <PublicFooter settings={settings} />

      <FloatingContactButtons
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappMessage}
        mapsUrl={settings.mapsUrl}
        enabled={{
          whatsapp: isEnabled(settings.floatingWhatsappEnabled),
          phone: isEnabled(settings.floatingPhoneEnabled),
          directions: isEnabled(settings.floatingDirectionsEnabled),
          form: isEnabled(settings.floatingFormEnabled),
        }}
      />

      <CookieConsentBanner />
    </>
  );
}
