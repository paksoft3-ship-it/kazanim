import Link from "next/link";

import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { Icon } from "@/components/public/Icon";
import { LEGAL_LINKS } from "@/lib/navigation";
import { slugify } from "@/lib/utils";

export type LegalSection = { heading: string; body: string[] };

/**
 * Shared two-column legal reading layout: sticky table-of-contents sidebar +
 * content card. Used by all four legal pages so the markup lives in one place.
 */
export function LegalPageLayout({
  title,
  updatedLabel,
  sections,
  currentPath,
}: {
  title: string;
  updatedLabel: string;
  sections: LegalSection[];
  currentPath: string;
}) {
  const withIds = sections.map((section) => ({ ...section, id: slugify(section.heading) }));

  return (
    <>
      {/* Light legal hero */}
      <section className="border-b border-warm-border bg-warm-ivory">
        <div className="container-max pb-12 pt-32 lg:pt-40">
          <Breadcrumbs
            variant="light"
            items={[
              { name: "Ana Sayfa", href: "/" },
              { name: title, href: currentPath },
            ]}
          />
          <h1 className="mt-6 font-serif text-hero-heading-mobile text-midnight-navy lg:text-[52px]">
            {title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-body-sm text-slate">
            <Icon name="calendar" className="h-4 w-4" />
            {updatedLabel}
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-max grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
          {/* Sticky ToC */}
          <aside className="hidden lg:block">
            <nav aria-label="İçindekiler" className="sticky top-28">
              <p className="mb-4 font-label-caps uppercase tracking-wider text-slate">
                İçindekiler
              </p>
              <ul className="space-y-1 border-l border-warm-border">
                {withIds.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-body-sm text-slate transition-colors hover:border-forest-emerald hover:text-forest-emerald"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content — the counsel-review note stays admin-only, never public. */}
          <div className="min-w-0">
            <div className="prose-legal max-w-none">
              {withIds.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                  <h2 id={section.id} className="scroll-mt-28">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>

            {/* Related legal pages */}
            <div className="mt-14 border-t border-warm-border pt-8">
              <p className="mb-4 font-label-caps uppercase tracking-wider text-slate">
                Diğer Yasal Metinler
              </p>
              <ul className="flex flex-wrap gap-3">
                {LEGAL_LINKS.filter((link) => link.href !== currentPath).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 border border-warm-border bg-white px-4 py-2 text-body-sm text-charcoal transition-colors hover:border-forest-emerald hover:text-forest-emerald"
                    >
                      <Icon name="file-text" className="h-4 w-4 text-slate" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
