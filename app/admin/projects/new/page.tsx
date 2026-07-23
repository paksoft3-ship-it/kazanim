import Link from "next/link";

import { AdminCard, PageHeader } from "@/components/admin/AdminUI";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Icon } from "@/components/public/Icon";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-2 text-body-sm text-slate">
        <Link href="/admin/projects" className="hover:text-forest-emerald">
          Projeler
        </Link>
        <Icon name="chevron-right" className="h-4 w-4" />
        <span className="font-medium text-charcoal">Yeni Proje</span>
      </nav>

      <PageHeader title="Yeni Proje" description="Portföye yeni bir proje ekleyin" />

      <AdminCard>
        <ProjectForm />
      </AdminCard>
    </div>
  );
}
