"use client";

import Link from "next/link";

import { Icon } from "@/components/public/Icon";
import { trackContactClick, trackCTA } from "@/lib/tracking";
import { whatsappUrl } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  location: string;
};

export function CTASection({
  title = "Yeni Bir Yaşam Alanı İçin İlk Adımı Atın",
  description = "Projelerimiz ve yatırım fırsatları hakkında detaylı bilgi almak için ekibimizle iletişime geçin.",
  primaryLabel = "Bilgi Al",
  primaryHref = "/iletisim",
  whatsappNumber,
  whatsappMessage,
  location,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-midnight-navy py-16 lg:py-section-gap-desktop">
      {/* Subtle architectural accent */}
      <div
        aria-hidden
        className="absolute right-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/2 bg-forest-emerald/5"
      />
      <div className="container-max relative z-10 text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-section-heading-mobile text-white lg:text-section-heading">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-white/70">
          {description}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={primaryHref}
            onClick={() =>
              trackCTA("section_cta_click", {
                cta_location: location,
                event_label: primaryLabel,
              })
            }
            className="w-full bg-white px-10 py-4 font-button-text uppercase tracking-[0.15em] text-midnight-navy transition-colors hover:bg-soft-gold sm:w-auto"
          >
            {primaryLabel}
          </Link>

          {whatsappNumber ? (
            <a
              href={whatsappUrl(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick("whatsapp", `${location}_whatsapp`)}
              className="flex w-full items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] px-10 py-4 font-button-text uppercase tracking-[0.15em] text-white transition-colors hover:border-[#20BA5A] hover:bg-[#20BA5A] sm:w-auto"
            >
              <Icon name="whatsapp" filled className="h-5 w-5" />
              WhatsApp ile İletişime Geç
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
