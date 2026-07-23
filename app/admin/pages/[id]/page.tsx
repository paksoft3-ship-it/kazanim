import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/AdminUI";
import { PageForm, type PageFormValues } from "@/components/admin/PageForm";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const page = await prisma.page.findUnique({ where: { id } }).catch(() => null);
  if (!page) notFound();

  // The content column is JSON; surface it as pretty-printed text for editing.
  let contentText = "";
  if (page.content !== null && page.content !== undefined) {
    try {
      contentText = JSON.stringify(page.content, null, 2);
    } catch {
      contentText = "";
    }
  }

  const values: PageFormValues = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    status: page.status,
    heroTitle: page.heroTitle,
    heroSubtitle: page.heroSubtitle,
    heroImage: page.heroImage,
    content: contentText,
    showInMenu: page.showInMenu,
    showInFooter: page.showInFooter,
    sortOrder: page.sortOrder,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    seoKeywords: page.seoKeywords,
    ogImage: page.ogImage,
    canonicalUrl: page.canonicalUrl,
    robots: page.robots,
  };

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-2 text-body-sm text-slate">
        <Link href="/admin/pages" className="hover:text-forest-emerald">
          Sayfalar
        </Link>
        <Icon name="chevron-right" className="h-4 w-4" />
        <span className="font-medium text-charcoal">Sayfa Düzenle</span>
      </nav>

      <PageHeader title={page.title} description={`/${page.slug}`} />

      <PageForm page={values} />
    </div>
  );
}
