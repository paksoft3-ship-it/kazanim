"use client";

import { Icon, type IconName } from "@/components/public/Icon";
import { trackNewsShareClick } from "@/lib/tracking";

type Props = {
  slug: string;
  title: string;
  /** Absolute canonical URL, computed on the server to avoid bundling server-only code. */
  url: string;
};

const CHANNELS: Array<{ id: string; label: string; icon: IconName; build: (url: string, title: string) => string }> = [
  {
    id: "facebook",
    label: "Facebook'ta paylaş",
    icon: "facebook",
    build: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn'de paylaş",
    icon: "linkedin",
    build: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp'ta paylaş",
    icon: "whatsapp",
    build: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

export function NewsShareButtons({ slug, title, url }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-label-caps uppercase tracking-[0.15em] text-slate">Paylaş</span>
      <div className="flex gap-2">
        {CHANNELS.map((channel) => (
          <a
            key={channel.id}
            href={channel.build(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={channel.label}
            onClick={() => trackNewsShareClick(channel.id, { news_slug: slug })}
            className={`flex h-10 w-10 items-center justify-center border transition-colors ${
              channel.id === "whatsapp"
                ? "border-[#25D366] bg-[#25D366] text-white hover:border-[#20BA5A] hover:bg-[#20BA5A]"
                : "border-warm-border text-forest-emerald hover:border-forest-emerald hover:bg-forest-emerald hover:text-white"
            }`}
          >
            <Icon name={channel.icon} filled={channel.icon === "whatsapp"} className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
