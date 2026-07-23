import type { Metadata } from "next";

import { LegalPageLayout } from "@/components/public/LegalPageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { GIZLILIK_SECTIONS } from "@/lib/legal-content";
import { legalMetadata, resolveLegalPage } from "@/lib/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 600;
const SLUG = "gizlilik-politikasi";

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata(SLUG, "Gizlilik Politikası", "Kazanım Gayrimenkul gizlilik politikası.");
}

export default async function GizlilikPage() {
  const page = await resolveLegalPage(SLUG, "Gizlilik Politikası", GIZLILIK_SECTIONS);
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
