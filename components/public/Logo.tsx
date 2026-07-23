import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  src: string;
  companyName: string;
  href?: string;
  className?: string;
  /**
   * The Kazanım logo is a charcoal wordmark + gold accent on white, so it is
   * unreadable directly on dark navy/emerald. Per the design system we never
   * recolor or invert it — instead we place the original on a soft ivory panel.
   */
  onDark?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function Logo({
  src,
  companyName,
  href = "/",
  className,
  onDark = false,
  priority = false,
  width = 179,
  height = 90,
}: LogoProps) {
  const image = (
    <Image
      src={src}
      alt={`${companyName} logosu`}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-full w-auto object-contain", onDark && "p-1.5")}
    />
  );

  const content = onDark ? (
    <span className="inline-flex h-full items-center rounded-sm bg-warm-ivory/95 px-3 py-1 shadow-sm">
      {image}
    </span>
  ) : (
    image
  );

  if (!href) {
    return <span className={cn("block", className)}>{content}</span>;
  }

  return (
    <Link href={href} className={cn("block shrink-0", className)} aria-label={`${companyName} ana sayfa`}>
      {content}
    </Link>
  );
}
