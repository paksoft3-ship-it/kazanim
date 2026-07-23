"use client";

import { usePathname } from "next/navigation";

import { PublicHeader } from "@/components/public/PublicHeader";

/**
 * Decides the header treatment per route: the homepage hero is full-bleed so
 * the header floats transparently over it, while every other page gets the
 * solid sticky header immediately.
 */
export function PublicHeaderShell(props: {
  companyName: string;
  logoPath: string;
  phone: string;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Inner pages open with <PageHero>, whose pt-32/pt-44 already clears the
  // fixed header — so no spacer element is needed here.
  return <PublicHeader {...props} transparentUntilScroll={isHome} />;
}
