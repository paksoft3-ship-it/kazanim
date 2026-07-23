"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Icon } from "@/components/public/Icon";
import { Logo } from "@/components/public/Logo";
import { MAIN_NAV } from "@/lib/navigation";
import { trackContactClick, trackCTA, trackNavigationClick } from "@/lib/tracking";
import { cn, telHref } from "@/lib/utils";

type PublicHeaderProps = {
  companyName: string;
  logoPath: string;
  phone: string;
  /** Homepage uses a transparent header over the hero image. */
  transparentUntilScroll?: boolean;
};

export function PublicHeader({
  companyName,
  logoPath,
  phone,
  transparentUntilScroll = false,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!transparentUntilScroll) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentUntilScroll]);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isTransparent = transparentUntilScroll && !scrolled && !mobileOpen;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <header
      className={cn(
        // The nav always keeps the dark "homepage entry" look (white items, gold
        // active); only the backdrop switches from transparent to solid navy.
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isTransparent
          ? "border-b border-white/15 bg-transparent"
          : "border-b border-white/10 bg-midnight-navy/97 backdrop-blur-md shadow-sm",
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-midnight-navy focus:px-4 focus:py-2 focus:text-white"
      >
        İçeriğe geç
      </a>

      <div className="container-max flex items-center justify-between gap-6 py-4">
        <Logo
          src={logoPath}
          companyName={companyName}
          onDark
          priority
          className="h-10 lg:h-12"
        />

        {/* Desktop navigation */}
        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {MAIN_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    onClick={() => trackNavigationClick(item.label)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1 border-b-2 pb-1 font-button-text uppercase tracking-[0.08em] transition-colors",
                      active
                        ? "border-champagne-gold text-soft-gold"
                        : "border-transparent text-white hover:border-champagne-gold/50 hover:text-soft-gold",
                    )}
                  >
                    {item.label}
                    {item.children ? (
                      <Icon name="chevron-down" className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    ) : null}
                  </Link>

                  {item.children ? (
                    <div className="invisible absolute left-0 top-full z-50 min-w-[240px] translate-y-1 border border-warm-border bg-soft-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <ul className="py-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => trackNavigationClick(`${item.label} › ${child.label}`)}
                              className="block px-5 py-3 text-body-sm text-charcoal transition-colors hover:bg-warm-ivory hover:text-deep-emerald"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 lg:flex">
          {phone ? (
            <a
              href={telHref(phone)}
              onClick={() => trackContactClick("phone", "header_phone")}
              className="flex items-center gap-2 font-medium text-white transition-colors hover:text-soft-gold"
            >
              <Icon name="phone" className="h-5 w-5 text-champagne-gold" />
              <span className="whitespace-nowrap">{phone}</span>
            </a>
          ) : null}
          <Link
            href="/iletisim"
            onClick={() => trackCTA("section_cta_click", { cta_location: "header", event_label: "Bilgi Al" })}
            className="bg-champagne-gold px-7 py-3 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:bg-soft-gold"
          >
            Bilgi Al
          </Link>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          className="p-2 text-white lg:hidden"
        >
          <Icon name={mobileOpen ? "close" : "menu"} className="h-7 w-7" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-y-auto border-t border-warm-border bg-soft-white lg:hidden",
          mobileOpen ? "max-h-[calc(100vh-72px)]" : "hidden",
        )}
      >
        <nav aria-label="Mobil menü" className="container-max py-4">
          <ul className="divide-y divide-warm-border">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => trackNavigationClick(item.label)}
                        className="flex-1 py-4 font-button-text uppercase tracking-[0.08em] text-midnight-navy"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenGroup((g) => (g === item.href ? null : item.href))}
                        aria-expanded={openGroup === item.href}
                        aria-label={`${item.label} alt menüsü`}
                        className="p-3 text-slate"
                      >
                        <Icon
                          name="chevron-down"
                          className={cn(
                            "h-5 w-5 transition-transform",
                            openGroup === item.href && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                    {openGroup === item.href ? (
                      <ul className="pb-3 pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => trackNavigationClick(`${item.label} › ${child.label}`)}
                              className="block py-3 text-body-sm text-charcoal"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => trackNavigationClick(item.label)}
                    className="block py-4 font-button-text uppercase tracking-[0.08em] text-midnight-navy"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3 pb-4">
            {phone ? (
              <a
                href={telHref(phone)}
                onClick={() => trackContactClick("phone", "mobile_menu_phone")}
                className="flex items-center justify-center gap-2 border border-warm-border py-3 font-button-text uppercase tracking-[0.12em] text-midnight-navy"
              >
                <Icon name="phone" className="h-5 w-5 text-champagne-gold" />
                {phone}
              </a>
            ) : null}
            <Link
              href="/iletisim"
              onClick={() => trackCTA("section_cta_click", { cta_location: "mobile_menu", event_label: "Bilgi Al" })}
              className="bg-champagne-gold py-3 text-center font-button-text uppercase tracking-[0.12em] text-midnight-navy"
            >
              Bilgi Al
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
