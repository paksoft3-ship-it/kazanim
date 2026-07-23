import Image from "next/image";

import { Breadcrumbs, type Crumb } from "@/components/public/Breadcrumbs";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  image?: string | null;
  crumbs?: Crumb[];
  /** Light variant is used by the legal pages (warm ivory background). */
  variant?: "dark" | "light";
  children?: React.ReactNode;
  meta?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs,
  variant = "dark",
  children,
  meta,
}: PageHeroProps) {
  const dark = variant === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        dark ? "bg-midnight-navy" : "border-b border-warm-border bg-warm-ivory",
      )}
    >
      {dark && image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
          {/* Navy overlay keeps the heading readable over photography. */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-midnight-navy/90 via-midnight-navy/70 to-midnight-navy/40"
            aria-hidden
          />
        </>
      ) : null}

      <div className="container-max relative z-10 pb-14 pt-32 lg:pb-20 lg:pt-44">
        {crumbs ? <Breadcrumbs items={crumbs} variant={variant} /> : null}

        <div className="mt-6 max-w-3xl">
          {eyebrow ? (
            <span
              className={cn(
                "mb-4 block font-label-caps uppercase tracking-[0.3em]",
                dark ? "text-champagne-gold" : "text-forest-emerald",
              )}
            >
              {eyebrow}
            </span>
          ) : null}

          <h1
            className={cn(
              "font-serif text-hero-heading-mobile lg:text-[56px] lg:leading-[1.1]",
              dark ? "text-white" : "text-midnight-navy",
            )}
          >
            {title}
          </h1>

          {description ? (
            <p
              className={cn(
                "mt-6 text-body-lg leading-relaxed",
                dark ? "text-white/80" : "text-on-surface-variant",
              )}
            >
              {description}
            </p>
          ) : null}

          {meta ? <div className="mt-6">{meta}</div> : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
