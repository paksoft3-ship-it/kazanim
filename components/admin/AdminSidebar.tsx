"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logoutAction } from "@/app/admin/actions";
import { Icon, type IconName } from "@/components/public/Icon";
import { Logo } from "@/components/public/Logo";
import { ADMIN_NAV, USER_ROLE_LABELS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type Props = {
  companyName: string;
  logoPath: string;
  logoLightPath: string;
  user: { name: string; email: string; role: string };
};

export function AdminSidebar({ companyName, logoPath, logoLightPath, user }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const nav = (
    <nav aria-label="Yönetim menüsü" className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-1">
        {ADMIN_NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2.5 text-body-sm font-medium transition-colors",
                  active
                    ? "border-l-2 border-champagne-gold bg-forest-emerald text-white"
                    : "border-l-2 border-transparent text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon name={item.icon as IconName} className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const footer = (
    <div className="border-t border-white/10 p-4">
      <div className="mb-3 min-w-0">
        <p className="truncate text-body-sm font-semibold text-white">{user.name}</p>
        <p className="truncate text-[12px] text-white/50">
          {USER_ROLE_LABELS[user.role] ?? user.role}
        </p>
      </div>
      <div className="space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-sm px-2 py-2 text-body-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Icon name="external-link" className="h-4 w-4" />
          Siteyi Görüntüle
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-body-sm text-white/70 transition-colors hover:bg-error-red/20 hover:text-white"
          >
            <Icon name="logout" className="h-4 w-4" />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-warm-border bg-white px-4 py-3 lg:hidden">
        <Logo src={logoPath} companyName={companyName} href="/admin" className="h-9" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          className="p-2 text-charcoal"
        >
          <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
        </button>
      </div>

      {/* Backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-midnight-navy/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-midnight-navy transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <Logo
            src={logoPath}
            darkSrc={logoLightPath}
            companyName={companyName}
            href="/admin"
            onDark
            className="h-10"
          />
        </div>
        {nav}
        {footer}
      </aside>
    </>
  );
}
