"use client";

import Link from "next/link";

import { trackFooterLinkClick } from "@/lib/tracking";

/**
 * Footer links are interactive only to emit the `footer_link_click` event,
 * so the footer itself can stay a server component.
 */
export function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      onClick={() => trackFooterLinkClick(label)}
      className="transition-colors hover:text-forest-emerald"
    >
      {label}
    </Link>
  );
}
