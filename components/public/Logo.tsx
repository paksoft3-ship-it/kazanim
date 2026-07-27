import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  src: string;
  companyName: string;
  /**
   * Light (ivory/gold) logo variant for dark surfaces. When provided and
   * `onDark` is set, it renders directly on the dark background — no ivory
   * panel. If it is missing we fall back to placing `src` on a soft ivory
   * panel so the logo never becomes unreadable on dark.
   */
  darkSrc?: string;
  href?: string;
  className?: string;
  onDark?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function Logo({
  src,
  companyName,
  darkSrc,
  href = "/",
  className,
  onDark = false,
  priority = false,
  width = 300,
  height = 81,
}: LogoProps) {
  const useLightOnDark = onDark && Boolean(darkSrc);
  const effectiveSrc = useLightOnDark ? (darkSrc as string) : src;

  const image = (
    <Image
      src={effectiveSrc}
      alt={`${companyName} logosu`}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-full w-auto object-contain", onDark && !useLightOnDark && "p-1.5")}
    />
  );

  // Only fall back to the ivory panel when no light variant is available.
  const content =
    onDark && !useLightOnDark ? (
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
