import type { Metadata } from "next";

import { LegalPageLayout } from "@/components/public/LegalPageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { CEREZ_SECTIONS } from "@/lib/legal-content";
import { legalMetadata, resolveLegalPage } from "@/lib/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 600;
const SLUG = "cerez-politikasi";

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata(SLUG, "Çerez Politikası", "Kazanım Gayrimenkul çerez politikası.");
}

export default async function CerezPage() {
  const page = await resolveLegalPage(SLUG, "Çerez Politikası", CEREZ_SECTIONS);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", href: "/" },
          { name: page.title, href: `/${SLUG}` },
        ])}
      />
      <LegalPageLayout {...page} currentPath={`/${SLUG}`} />
    </>
  );
}
