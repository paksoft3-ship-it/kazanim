import Link from "next/link";

import { PageHeader } from "@/components/admin/AdminUI";
import { PageForm } from "@/components/admin/PageForm";
import { Icon } from "@/components/public/Icon";

export const dynamic = "force-dynamic";

export default function NewPagePage() {
  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-2 text-body-sm text-slate">
        <Link href="/admin/pages" className="hover:text-forest-emerald">
          Sayfalar
        </Link>
        <Icon name="chevron-right" className="h-4 w-4" />
        <span className="font-medium text-charcoal">Yeni Sayfa</span>
      </nav>

      <PageHeader title="Yeni Sayfa" description="Yeni bir statik sayfa oluşturun" />

      <PageForm />
    </div>
  );
}
