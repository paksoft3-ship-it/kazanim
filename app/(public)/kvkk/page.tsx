import type { Metadata } from "next";

import { LegalPageLayout } from "@/components/public/LegalPageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { KVKK_SECTIONS } from "@/lib/legal-content";
import { legalMetadata, resolveLegalPage } from "@/lib/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 600;
const SLUG = "kvkk";

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata(SLUG, "KVKK Aydınlatma Metni", "Kazanım Gayrimenkul KVKK aydınlatma metni.");
}

export default async function KvkkPage() {
  const page = await resolveLegalPage(SLUG, "KVKK Aydınlatma Metni", KVKK_SECTIONS);
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
