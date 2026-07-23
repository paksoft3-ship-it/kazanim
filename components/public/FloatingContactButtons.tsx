"use client";

import Link from "next/link";

import { Icon, type IconName } from "@/components/public/Icon";
import {
  trackContactClick,
  trackMobileStickyBarClick,
  type ContactMethod,
} from "@/lib/tracking";
import { telHref, whatsappUrl } from "@/lib/utils";

type Action = {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  method: ContactMethod;
  external?: boolean;
  /** WhatsApp keeps its brand green; everything else stays navy/gold. */
  brand?: boolean;
};

type Props = {
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  mapsUrl: string;
  enabled: {
    whatsapp: boolean;
    phone: boolean;
    directions: boolean;
    form: boolean;
  };
};

export function FloatingContactButtons({
  phone,
  whatsappNumber,
  whatsappMessage,
  mapsUrl,
  enabled,
}: Props) {
  const actions: Action[] = [];

  if (enabled.whatsapp && whatsappNumber) {
    actions.push({
      key: "whatsapp",
      label: "WhatsApp",
      href: whatsappUrl(whatsappNumber, whatsappMessage),
      icon: "whatsapp",
      method: "whatsapp",
      external: true,
      brand: true,
    });
  }
  if (enabled.phone && phone) {
    actions.push({
      key: "phone",
      label: "Ara",
      href: telHref(phone),
      icon: "phone",
      method: "phone",
    });
  }
  if (enabled.directions && mapsUrl) {
    actions.push({
      key: "directions",
      label: "Yol Tarifi",
      href: mapsUrl,
      icon: "navigation",
      method: "directions",
      external: true,
    });
  }
  if (enabled.form) {
    actions.push({
      key: "form",
      label: "Bilgi Formu",
      href: "/iletisim#iletisim-formu",
      icon: "mail",
      method: "form",
    });
  }

  if (actions.length === 0) return null;

  return (
    <>
      {/* Desktop: fixed vertical cluster, right edge */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        {actions.map((action) => {
          const content = (
            <>
              <Icon
                name={action.icon}
                filled={action.key === "whatsapp"}
                className="h-6 w-6"
              />
              {/* Label slides out on hover */}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-sm bg-midnight-navy px-3 py-2 font-label-caps uppercase tracking-wider text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {action.label}
              </span>
            </>
          );

          const className = [
            "group relative flex items-center justify-center rounded-full border shadow-lg transition-all hover:scale-105",
            action.brand
              ? "border-[#20BA5A] bg-[#25D366] text-white hover:bg-[#20BA5A]"
              : "border-champagne-gold/40 bg-midnight-navy text-soft-gold hover:bg-forest-emerald hover:text-white",
          ].join(" ");

          return action.external ? (
            <a
              key={action.key}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={action.label}
              onClick={() => trackContactClick(action.method, `floating_${action.key}`)}
              className={className}
              style={{ height: 52, width: 52 }}
            >
              {content}
            </a>
          ) : (
            <Link
              key={action.key}
              href={action.href}
              aria-label={action.label}
              onClick={() => trackContactClick(action.method, `floating_${action.key}`)}
              className={className}
              style={{ height: 52, width: 52 }}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* Mobile: sticky bottom action bar */}
      <nav
        aria-label="Hızlı iletişim"
        className="fixed inset-x-0 bottom-0 z-40 grid border-t border-white/10 bg-midnight-navy pb-[env(safe-area-inset-bottom)] lg:hidden"
        style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}
      >
        {actions.map((action) => {
          const inner = (
            <>
              <Icon
                name={action.icon}
                filled={action.key === "whatsapp"}
                className={`h-5 w-5 ${action.brand ? "text-[#25D366]" : "text-soft-gold"}`}
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/85">
                {action.label}
              </span>
            </>
          );

          const className =
            "flex flex-col items-center justify-center gap-1 py-3 transition-colors active:bg-forest-emerald";

          const onClick = () => {
            trackMobileStickyBarClick(action.label);
            trackContactClick(action.method, `mobile_bar_${action.key}`);
          };

          return action.external ? (
            <a
              key={action.key}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClick}
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link key={action.key} href={action.href} onClick={onClick} className={className}>
              {inner}
            </Link>
          );
        })}
      </nav>

      {/* Spacer so the mobile bar never covers page content or form buttons. */}
      <div aria-hidden className="h-[68px] lg:hidden" />
    </>
  );
}
