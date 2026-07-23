import Link from "next/link";

import { Icon } from "@/components/public/Icon";

/**
 * 404 page. Lives in the (public) route group so it inherits the header,
 * footer and floating buttons. Warm, premium tone — not an alarming error.
 */
export default function NotFound() {
  const quickLinks = [
    { label: "Projeler", href: "/projeler" },
    { label: "Kurumsal", href: "/kurumsal/hakkimizda" },
    { label: "Haberler", href: "/haberler" },
    { label: "Galeri", href: "/galeri" },
    { label: "İnsan Kaynakları", href: "/insan-kaynaklari" },
    { label: "İletişim", href: "/iletisim" },
  ];

  return (
    <section className="relative overflow-hidden bg-warm-ivory">
      {/* Blueprint grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#0B1E3A 1px, transparent 1px), linear-gradient(90deg, #0B1E3A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-max relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-[120px] font-bold leading-none text-midnight-navy/90 lg:text-[180px]">
          404
        </p>
        <span className="mt-2 font-label-caps uppercase tracking-[0.3em] text-champagne-gold">
          Sayfa Bulunamadı
        </span>
        <h1 className="mt-4 max-w-xl font-serif text-section-heading-mobile text-midnight-navy lg:text-4xl">
          Aradığınız Sayfaya Ulaşılamıyor
        </h1>
        <p className="mt-5 max-w-md text-body-md leading-relaxed text-slate">
          Aradığınız sayfa taşınmış, silinmiş veya geçici olarak kullanılamıyor olabilir.
          Aşağıdaki bağlantılardan devam edebilirsiniz.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-midnight-navy px-8 py-4 font-button-text uppercase tracking-[0.12em] text-white transition-colors hover:bg-forest-emerald"
          >
            <Icon name="home" className="h-5 w-5" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/projeler"
            className="border border-champagne-gold px-8 py-4 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:bg-champagne-gold"
          >
            Projeleri İncele
          </Link>
          <Link
            href="/iletisim"
            className="border border-warm-border bg-white px-8 py-4 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:border-forest-emerald hover:text-forest-emerald"
          >
            İletişime Geç
          </Link>
        </div>

        <div className="mt-14 w-full max-w-lg border-t border-warm-border pt-8">
          <p className="mb-4 font-label-caps uppercase tracking-wider text-slate">
            Popüler Sayfalar
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex border border-warm-border bg-white px-4 py-2 text-body-sm text-charcoal transition-colors hover:border-forest-emerald hover:text-forest-emerald"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
