import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/public/Icon";
import { formatDateTR } from "@/lib/utils";

export type NewsCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  publishedAt: Date | null;
};

export function NewsCard({
  article,
  featured = false,
}: {
  article: NewsCardData;
  featured?: boolean;
}) {
  const href = `/haberler/${article.slug}`;

  return (
    <article
      className={
        featured
          ? "group grid overflow-hidden border border-warm-border/60 bg-white lg:grid-cols-2"
          : "group flex h-full flex-col overflow-hidden border border-warm-border/60 bg-white transition-colors hover:border-champagne-gold/50"
      }
    >
      <Link href={href} className={featured ? "relative block aspect-[16/10] lg:aspect-auto" : "relative block aspect-[16/10] overflow-hidden"}>
        <Image
          src={article.coverImage || "/images/news/haber-placeholder.jpg"}
          alt={`${article.title} haber görseli`}
          fill
          loading="lazy"
          sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      <div className={featured ? "flex flex-col justify-center p-8 lg:p-12" : "flex flex-1 flex-col p-7"}>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-body-sm">
          <span className="bg-soft-gold/40 px-3 py-1 font-label-caps uppercase tracking-wider text-midnight-navy">
            {article.category}
          </span>
          {article.publishedAt ? (
            <time
              dateTime={article.publishedAt.toISOString()}
              className="flex items-center gap-1.5 text-slate"
            >
              <Icon name="calendar" className="h-4 w-4" />
              {formatDateTR(article.publishedAt)}
            </time>
          ) : null}
        </div>

        <h3
          className={
            featured
              ? "mb-4 font-serif text-3xl leading-snug text-midnight-navy lg:text-4xl"
              : "mb-3 font-serif text-xl leading-snug text-midnight-navy"
          }
        >
          <Link href={href} className="transition-colors hover:text-forest-emerald">
            {article.title}
          </Link>
        </h3>

        {article.excerpt ? (
          <p
            className={
              featured
                ? "mb-8 text-body-md leading-relaxed text-slate"
                : "mb-6 line-clamp-3 flex-1 text-body-sm leading-relaxed text-slate"
            }
          >
            {article.excerpt}
          </p>
        ) : null}

        <Link
          href={href}
          className="mt-auto flex w-fit items-center gap-2 font-button-text uppercase tracking-[0.1em] text-forest-emerald transition-all hover:gap-3 hover:text-forest-emerald"
        >
          Haberi Oku
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
