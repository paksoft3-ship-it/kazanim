import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  variant?: "dark" | "light";
  as?: "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  variant = "light",
  as: Tag = "h2",
  className,
}: Props) {
  const dark = variant === "dark";

  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "mb-4 block font-label-caps uppercase tracking-[0.2em]",
            dark ? "text-champagne-gold" : "text-forest-emerald",
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <Tag
        className={cn(
          "font-serif text-section-heading-mobile lg:text-section-heading",
          dark ? "text-white" : "text-midnight-navy",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-5 text-body-md leading-relaxed",
            dark ? "text-white/70" : "text-on-surface-variant",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
