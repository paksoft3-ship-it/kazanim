"use client";

import Link from "next/link";

import { trackCTA } from "@/lib/tracking";

/**
 * Section CTA link with `section_cta_click` tracking, usable from server
 * components. Never place PII in `label` or `location`.
 */
export function TrackedCTALink({
  href,
  label,
  location,
  className,
  children,
}: {
  href: string;
  label: string;
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() =>
        trackCTA("section_cta_click", { cta_location: location, event_label: label })
      }
      className={className}
    >
      {children}
    </Link>
  );
}
