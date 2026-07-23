import Link from "next/link";

import { Icon } from "@/components/public/Icon";

export function EmptyProjects({ message }: { message: string }) {
  return (
    <div className="border border-warm-border bg-white p-12 text-center lg:p-16">
      <Icon name="building" className="mx-auto mb-4 h-12 w-12 text-slate/50" />
      <p className="mx-auto mb-8 max-w-md text-body-md text-slate">{message}</p>
      <Link
        href="/projeler"
        className="inline-flex bg-forest-emerald px-8 py-3.5 font-button-text uppercase tracking-[0.12em] text-white transition-colors hover:bg-midnight-navy"
      >
        Tüm Projeler
      </Link>
    </div>
  );
}
