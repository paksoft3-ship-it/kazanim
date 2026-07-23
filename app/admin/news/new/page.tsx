import Link from "next/link";

import { PageHeader } from "@/components/admin/AdminUI";
import { NewsForm } from "@/components/admin/NewsForm";
import { Icon } from "@/components/public/Icon";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function loadProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    });
  } catch {
    return [];
  }
}

export default async function NewNewsPage() {
  const projects = await loadProjects();

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-2 text-body-sm text-slate">
        <Link href="/admin/news" className="hover:text-forest-emerald">
          Haberler
        </Link>
        <Icon name="chevron-right" className="h-4 w-4" />
        <span className="font-medium text-charcoal">Yeni Haber</span>
      </nav>

      <PageHeader title="Yeni Haber" description="Yeni bir haber veya duyuru oluşturun" />

      <NewsForm projects={projects} />
    </div>
  );
}
