import Link from "next/link";

import { FooterLink } from "@/components/public/FooterLink";
import { Icon, type IconName } from "@/components/public/Icon";
import { Logo } from "@/components/public/Logo";
import {
  FOOTER_PROJECT_LINKS,
  FOOTER_QUICK_LINKS,
  LEGAL_LINKS,
} from "@/lib/navigation";
import type { SiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/utils";

export function PublicFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  const socials = (
    [
      { href: settings.instagramUrl, icon: "instagram", label: "Instagram" },
      { href: settings.facebookUrl, icon: "facebook", label: "Facebook" },
      { href: settings.linkedinUrl, icon: "linkedin", label: "LinkedIn" },
      { href: settings.youtubeUrl, icon: "youtube", label: "YouTube" },
    ] satisfies Array<{ href: string; icon: IconName; label: string }>
  ).filter((s) => Boolean(s.href));

  return (
    <footer className="border-t border-white/10 bg-midnight-navy text-white">
      <div className="container-max py-16 lg:py-section-gap-desktop">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-7">
            <Logo
              src={settings.logoPath}
              darkSrc={settings.logoLightPath}
              companyName={settings.companyName}
              onDark
              className="h-12"
            />
            <p className="max-w-xs text-body-sm leading-relaxed text-white/60">
              {settings.footerDescription}
            </p>
            {socials.length > 0 ? (
              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-champagne-gold hover:text-soft-gold"
                  >
                    <Icon name={social.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Quick links */}
          <nav aria-label="Hızlı menü">
            <h2 className="mb-7 font-serif text-body-lg font-bold text-white">Hızlı Menü</h2>
            <ul className="space-y-4 text-body-sm text-white/70">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Projects */}
          <nav aria-label="Proje bağlantıları">
            <h2 className="mb-7 font-serif text-body-lg font-bold text-white">Projeler</h2>
            <ul className="space-y-4 text-body-sm text-white/70">
              {FOOTER_PROJECT_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="mb-7 font-serif text-body-lg font-bold text-white">İletişim</h2>
            <ul className="space-y-4 text-body-sm text-white/70">
              {settings.phone ? (
                <li>
                  <a
                    href={telHref(settings.phone)}
                    className="flex items-start gap-3 transition-colors hover:text-soft-gold"
                  >
                    <Icon name="phone" className="h-5 w-5 shrink-0 text-champagne-gold" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-start gap-3 transition-colors hover:text-soft-gold"
                  >
                    <Icon name="mail" className="h-5 w-5 shrink-0 text-champagne-gold" />
                    <span className="break-all">{settings.email}</span>
                  </a>
                </li>
              ) : null}
              {settings.address ? (
                <li className="flex items-start gap-3">
                  <Icon name="map-pin" className="h-5 w-5 shrink-0 text-champagne-gold" />
                  <span>{settings.address}</span>
                </li>
              ) : null}
              {settings.workingHours ? (
                <li className="flex items-start gap-3">
                  <Icon name="clock" className="h-5 w-5 shrink-0 text-champagne-gold" />
                  <span>{settings.workingHours}</span>
                </li>
              ) : null}
              {!settings.phone && !settings.email && !settings.address ? (
                <li className="text-white/50">
                  İletişim bilgilerimiz yakında güncellenecektir.
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/40">
            © {year} {settings.companyName}. Tüm Hakları Saklıdır.
          </p>
          <ul className="flex flex-wrap justify-center gap-6 text-[12px] font-medium uppercase tracking-[0.12em] text-white/40">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-soft-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
