"use client";

import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/public/Icon";
import { trackContactClick, trackCTA } from "@/lib/tracking";
import { whatsappUrl } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  primaryCta: string;
  primaryCtaUrl: string;
  secondaryCta: string;
  secondaryCtaUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
};

export function HomeHero({
  eyebrow,
  title,
  subtitle,
  image,
  primaryCta,
  primaryCtaUrl,
  secondaryCta,
  secondaryCtaUrl,
  whatsappNumber,
  whatsappMessage,
}: Props) {
  // Premium detail: the final sentence of the headline renders in gold.
  const sentences = title.match(/[^.!?]+[.!?]*\s*/g) ?? [title];
  const lead = sentences.slice(0, -1).join("");
  const emphasis = sentences.length > 1 ? sentences[sentences.length - 1] : null;

  return (
    <header className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-midnight-navy">
      <Image
        src={image}
        alt="Kazanım Gayrimenkul proje görseli"
        fill
        priority
        sizes="100vw"
        className="animate-zoom-slow object-cover"
      />
      {/* Dark emerald/navy overlay — not black — keeps the copy readable. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-midnight-navy/95 via-dark-navy/70 to-deep-emerald/30"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-midnight-navy/80 to-transparent"
      />

      <div className="container-max relative z-10 pb-28 pt-24 lg:pb-36">
        <div className="max-w-2xl text-white">
          <span className="mb-4 block font-label-caps uppercase tracking-[0.3em] text-champagne-gold">
            {eyebrow}
          </span>
          <h1 className="font-serif text-hero-heading-mobile leading-tight lg:text-hero-heading">
            {emphasis ? (
              <>
                {lead}
                <span className="text-soft-gold">{emphasis}</span>
              </>
            ) : (
              title
            )}
          </h1>
          <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-white/85">{subtitle}</p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={primaryCtaUrl}
              onClick={() =>
                trackCTA("hero_cta_click", { cta_location: "hero", event_label: primaryCta })
              }
              className="bg-champagne-gold px-10 py-4 text-center font-button-text uppercase tracking-[0.15em] text-midnight-navy transition-colors hover:bg-soft-gold"
            >
              {primaryCta}
            </Link>
            <Link
              href={secondaryCtaUrl}
              onClick={() =>
                trackCTA("hero_cta_click", { cta_location: "hero", event_label: secondaryCta })
              }
              className="border border-white/40 px-10 py-4 text-center font-button-text uppercase tracking-[0.15em] text-white transition-colors hover:border-soft-gold hover:text-soft-gold"
            >
              {secondaryCta}
            </Link>
            {whatsappNumber ? (
              <a
                href={whatsappUrl(whatsappNumber, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick("whatsapp", "hero_whatsapp")}
                className="flex items-center justify-center gap-2 border border-[#25D366] bg-[#25D366] px-8 py-4 font-button-text uppercase tracking-[0.15em] text-white transition-colors hover:border-[#20BA5A] hover:bg-[#20BA5A]"
              >
                <Icon name="whatsapp" filled className="h-5 w-5" />
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </div>

    </header>
  );
}
