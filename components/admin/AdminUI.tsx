import Link from "next/link";

import { Icon, type IconName } from "@/components/public/Icon";
import { cn } from "@/lib/utils";

/** Shared presentational primitives for the admin panel. */

export function AdminCard({
  title,
  description,
  action,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("border border-warm-border bg-white shadow-sm", className)}>
      {title || action ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-warm-border px-6 py-4">
          <div>
            {title ? (
              <h2 className="font-semibold text-charcoal">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-body-sm text-slate">{description}</p>
            ) : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={padded ? "p-6" : ""}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  icon,
  href,
  tone = "navy",
}: {
  label: string;
  value: string | number;
  icon: IconName;
  href?: string;
  tone?: "navy" | "gold" | "cyan" | "green";
}) {
  const tones = {
    navy: "bg-midnight-navy/5 text-midnight-navy",
    gold: "bg-champagne-gold/15 text-champagne-gold",
    cyan: "bg-forest-emerald/10 text-forest-emerald",
    green: "bg-success-green/10 text-success-green",
  };

  const body = (
    <div className="flex items-center gap-4 border border-warm-border bg-white p-5 shadow-sm transition-colors hover:border-forest-emerald/40">
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-sm", tones[tone])}>
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-body-sm text-slate">{label}</p>
        <p className="text-2xl font-bold text-charcoal">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

const STATUS_TONES: Record<string, string> = {
  // Content status
  PUBLISHED: "bg-success-green/10 text-success-green border-success-green/30",
  DRAFT: "bg-warning-orange/10 text-warning-orange border-warning-orange/30",
  HIDDEN: "bg-slate/10 text-slate border-slate/30",
  // Project status
  ONGOING: "bg-forest-emerald/10 text-forest-emerald border-forest-emerald/30",
  COMPLETED: "bg-success-green/10 text-success-green border-success-green/30",
  UPCOMING: "bg-champagne-gold/15 text-champagne-gold border-champagne-gold/40",
  // Lead / application status
  NEW: "bg-forest-emerald/10 text-forest-emerald border-forest-emerald/40",
  READ: "bg-slate/10 text-slate border-slate/30",
  IN_PROGRESS: "bg-warning-orange/10 text-warning-orange border-warning-orange/30",
  DONE: "bg-success-green/10 text-success-green border-success-green/30",
  ARCHIVED: "bg-slate/10 text-slate border-slate/30",
  REVIEWED: "bg-forest-emerald/10 text-forest-emerald border-forest-emerald/30",
  SUITABLE: "bg-success-green/10 text-success-green border-success-green/30",
  NOT_SUITABLE: "bg-error-red/10 text-error-red border-error-red/30",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        STATUS_TONES[status] ?? "bg-slate/10 text-slate border-slate/30",
      )}
    >
      {label}
    </span>
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-warm-border bg-admin-bg px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate shadow-sm">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h3 className="font-semibold text-charcoal">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-body-sm text-slate">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-body-sm">
        <thead>
          <tr className="border-b border-warm-border bg-admin-bg">
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left font-semibold uppercase tracking-wider text-slate"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-border">{children}</tbody>
      </table>
    </div>
  );
}

export function AdminButton({
  href,
  children,
  variant = "primary",
  type = "button",
  size = "md",
  className,
  ...rest
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit";
  size?: "sm" | "md";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-forest-emerald text-white hover:bg-midnight-navy border-forest-emerald",
    secondary: "bg-white text-charcoal border-warm-border hover:border-forest-emerald",
    danger: "bg-error-red text-white border-error-red hover:opacity-90",
    ghost: "bg-transparent text-slate border-transparent hover:text-forest-emerald",
  };
  const sizes = { sm: "px-3 py-1.5 text-[13px]", md: "px-5 py-2.5 text-body-sm" };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

export function FormStatusAlert({
  status,
  message,
}: {
  status: "success" | "error" | "info";
  message: string;
}) {
  const tones = {
    success: "border-success-green/40 bg-success-green/10 text-success-green",
    error: "border-error-red/40 bg-error-red/10 text-error-red",
    info: "border-forest-emerald/30 bg-forest-emerald/5 text-forest-emerald",
  };
  const icons: Record<string, IconName> = {
    success: "check-circle",
    error: "alert-triangle",
    info: "info",
  };
  return (
    <div role="status" aria-live="polite" className={cn("flex items-start gap-3 border p-4 text-body-sm", tones[status])}>
      <Icon name={icons[status]} className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">{title}</h1>
        {description ? (
          <p className="mt-1 text-body-sm text-slate">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
