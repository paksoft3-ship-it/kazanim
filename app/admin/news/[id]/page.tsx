import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/AdminUI";
import { NewsForm, type NewsFormValues } from "@/components/admin/NewsForm";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function toDateInput(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [article, projects] = await Promise.all([
    prisma.newsArticle.findUnique({ where: { id } }).catch(() => null),
    prisma.project
      .findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } })
      .catch(() => []),
  ]);

  if (!article) notFound();

  const values: NewsFormValues = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    category: article.category,
    status: article.status,
    isFeatured: article.isFeatured,
    relatedProjectId: article.relatedProjectId,
    publishedAt: toDateInput(article.publishedAt),
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    ogImage: article.ogImage,
    canonicalUrl: article.canonicalUrl,
    robots: article.robots,
  };

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-2 text-body-sm text-slate">
        <Link href="/admin/news" className="hover:text-forest-emerald">
          Haberler
        </Link>
        <Icon name="chevron-right" className="h-4 w-4" />
        <span className="font-medium text-charcoal">Haber Düzenle</span>
      </nav>

      <PageHeader
        title={article.title}
        description="Haber içeriğini düzenleyin"
        action={
          <Link
            href={`/haberler/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-warm-border bg-white px-4 py-2 text-body-sm font-semibold text-charcoal transition-colors hover:border-forest-emerald"
          >
            <Icon name="external-link" className="h-4 w-4" />
            Önizle
          </Link>
        }
      />

      <NewsForm news={values} projects={projects} />
    </div>
  );
}
