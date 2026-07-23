import type { Metadata } from "next";

import { LegalPageLayout } from "@/components/public/LegalPageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { KULLANIM_SECTIONS } from "@/lib/legal-content";
import { legalMetadata, resolveLegalPage } from "@/lib/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 600;
const SLUG = "kullanim-kosullari";

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata(SLUG, "Kullanım Koşulları", "Kazanım Gayrimenkul kullanım koşulları.");
}

export default async function KullanimPage() {
  const page = await resolveLegalPage(SLUG, "Kullanım Koşulları", KULLANIM_SECTIONS);
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
