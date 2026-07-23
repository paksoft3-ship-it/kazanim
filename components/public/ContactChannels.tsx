"use client";

import { Icon, type IconName } from "@/components/public/Icon";
import { trackContactClick, type ContactMethod } from "@/lib/tracking";
import { telHref, whatsappUrl } from "@/lib/utils";

type Props = {
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  address: string;
  mapsUrl: string;
  workingHours: string;
};

export function ContactChannels({
  phone,
  whatsappNumber,
  whatsappMessage,
  email,
  address,
  mapsUrl,
  workingHours,
}: Props) {
  const cards: Array<{
    icon: IconName;
    label: string;
    value: string;
    href: string;
    method: ContactMethod;
    external?: boolean;
    filled?: boolean;
    /** WhatsApp keeps its brand green; everything else stays navy/gold. */
    brand?: boolean;
  }> = [];

  // Only channels with confirmed values render — no guessed contact info.
  if (phone) {
    cards.push({ icon: "phone", label: "Telefon", value: phone, href: telHref(phone), method: "phone" });
  }
  if (whatsappNumber) {
    cards.push({
      icon: "whatsapp",
      label: "WhatsApp",
      value: "Hemen Yazın",
      href: whatsappUrl(whatsappNumber, whatsappMessage),
      method: "whatsapp",
      external: true,
      filled: true,
      brand: true,
    });
  }
  if (email) {
    cards.push({ icon: "mail", label: "E-posta", value: email, href: `mailto:${email}`, method: "email" });
  }
  if (address && mapsUrl) {
    cards.push({
      icon: "navigation",
      label: "Adres",
      value: address,
      href: mapsUrl,
      method: "directions",
      external: true,
    });
  }

  if (cards.length === 0 && !workingHours) {
    return (
      <div className="border border-warm-border bg-white p-6 text-body-md text-slate">
        İletişim bilgilerimiz yakında güncellenecektir. Bu süreçte bilgi talep
        formunu kullanabilirsiniz.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {cards.map((card) => (
        <a
          key={card.label}
          href={card.href}
          {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={() => trackContactClick(card.method, `contact_card_${card.method}`)}
          className={`group flex items-start gap-4 border bg-white p-6 transition-colors ${
            card.brand
              ? "border-[#25D366]/40 hover:border-[#25D366]"
              : "border-warm-border hover:border-forest-emerald"
          }`}
        >
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
              card.brand
                ? "bg-[#25D366] text-white group-hover:bg-[#20BA5A]"
                : "bg-midnight-navy text-soft-gold group-hover:bg-forest-emerald"
            }`}
          >
            <Icon name={card.icon} filled={card.filled} className="h-6 w-6" />
          </span>
          <span className="min-w-0">
            <span className="mb-1 block font-label-caps uppercase tracking-wider text-slate">
              {card.label}
            </span>
            <span className="block break-words font-semibold text-midnight-navy">{card.value}</span>
          </span>
        </a>
      ))}

      {workingHours ? (
        <div className="flex items-start gap-4 border border-warm-border bg-white p-6 sm:col-span-2">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-midnight-navy text-soft-gold">
            <Icon name="clock" className="h-6 w-6" />
          </span>
          <span>
            <span className="mb-1 block font-label-caps uppercase tracking-wider text-slate">
              Çalışma Saatleri
            </span>
            <span className="block font-semibold text-midnight-navy">{workingHours}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
