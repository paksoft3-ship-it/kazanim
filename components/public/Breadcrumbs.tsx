import Link from "next/link";

import { Icon } from "@/components/public/Icon";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({
  items,
  variant = "dark",
}: {
  items: Crumb[];
  variant?: "dark" | "light";
}) {
  const dark = variant === "dark";

  return (
    <nav aria-label="Sayfa yolu">
      <ol className="flex flex-wrap items-center gap-1 text-body-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 ? (
                <Icon
                  name="chevron-right"
                  className={cn("h-4 w-4", dark ? "text-white/40" : "text-slate/60")}
                />
              ) : null}
              {isLast ? (
                <span
                  aria-current="page"
                  className={cn(dark ? "text-white/90" : "text-midnight-navy", "font-medium")}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    dark
                      ? "text-white/60 hover:text-forest-emerald"
                      : "text-slate hover:text-forest-emerald",
                  )}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
