"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Icon } from "@/components/public/Icon";
import { trackCookieEvent } from "@/lib/tracking";

const STORAGE_KEY = "kazanim_cookie_consent";
const CONSENT_VERSION = 1;

type Categories = {
  necessary: true;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
};

type StoredConsent = Categories & { version: number; decidedAt: string };

const ALL_ACCEPTED: Categories = {
  necessary: true,
  analytics: true,
  preferences: true,
  marketing: true,
};

const ALL_REJECTED: Categories = {
  necessary: true,
  analytics: false,
  preferences: false,
  marketing: false,
};

const CATEGORY_COPY: Array<{
  key: keyof Omit<Categories, "necessary">;
  title: string;
  description: string;
}> = [
  {
    key: "analytics",
    title: "Analitik Çerezler",
    description:
      "Ziyaretçilerin siteyi nasıl kullandığını anlamamıza ve site performansını iyileştirmemize yardımcı olur.",
  },
  {
    key: "preferences",
    title: "Tercih Çerezleri",
    description:
      "Dil ve görüntüleme tercihleriniz gibi seçimlerinizin hatırlanmasını sağlar.",
  },
  {
    key: "marketing",
    title: "Pazarlama Çerezleri",
    description:
      "İlgi alanlarınıza uygun reklamların gösterilmesi ve reklam performansının ölçülmesi için kullanılır.",
  },
];

/** Push the Google Consent Mode v2 update that GTM listens for. */
function updateConsentMode(categories: Categories) {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_ENABLE_CONSENT_MODE === "false") return;
  try {
    // `gtag` is defined by the consent-default script in GTMProvider. It pushes
    // a real `arguments` object, which is the shape Consent Mode requires.
    const gtag = window.gtag;
    if (typeof gtag !== "function") return;
    gtag("consent", "update", {
      ad_storage: categories.marketing ? "granted" : "denied",
      ad_user_data: categories.marketing ? "granted" : "denied",
      ad_personalization: categories.marketing ? "granted" : "denied",
      analytics_storage: categories.analytics ? "granted" : "denied",
      functionality_storage: categories.preferences ? "granted" : "denied",
      personalization_storage: categories.preferences ? "granted" : "denied",
      security_storage: "granted",
    });
  } catch {
    // Consent must never break rendering.
  }
}

function persist(categories: Categories) {
  try {
    const payload: StoredConsent = {
      ...categories,
      version: CONSENT_VERSION,
      decidedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    // Mirror into a cookie so server-side logic can read it if ever needed.
    document.cookie = `kazanim_consent=${categories.analytics ? 1 : 0}${
      categories.preferences ? 1 : 0
    }${categories.marketing ? 1 : 0}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
  } catch {
    // Storage blocked (private mode) — the banner simply reappears next visit.
  }
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [selection, setSelection] = useState<Categories>(ALL_REJECTED);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredConsent;
        if (stored.version === CONSENT_VERSION) {
          updateConsentMode(stored);
          return;
        }
      }
    } catch {
      // fall through and show the banner
    }
    setVisible(true);
    trackCookieEvent("cookie_banner_view");
  }, []);

  const decide = useCallback(
    (categories: Categories, event: Parameters<typeof trackCookieEvent>[0]) => {
      persist(categories);
      updateConsentMode(categories);
      trackCookieEvent(event);
      setVisible(false);
      setShowPreferences(false);
    },
    [],
  );

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-champagne-gold/30 bg-midnight-navy/97 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:bottom-4 lg:left-4 lg:right-auto lg:max-w-md lg:border lg:border-white/10"
    >
      <div className="p-6 lg:p-7">
        {!showPreferences ? (
          <>
            <div className="mb-3 flex items-start gap-3">
              <Icon name="info" className="mt-0.5 h-5 w-5 text-champagne-gold" />
              <h2
                id="cookie-banner-title"
                className="font-serif text-lg font-semibold text-white"
              >
                Çerez Kullanımı
              </h2>
            </div>
            <p className="mb-5 text-body-sm leading-relaxed text-white/70">
              Web sitemizde, deneyiminizi iyileştirmek ve site performansını ölçmek için
              çerezler kullanıyoruz. Zorunlu çerezler dışındaki çerezler yalnızca onayınızla
              çalışır. Detaylar için{" "}
              <Link
                href="/cerez-politikasi"
                className="text-soft-gold underline underline-offset-4 hover:text-champagne-gold"
              >
                Çerez Politikamızı
              </Link>{" "}
              inceleyebilirsiniz.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => decide(ALL_ACCEPTED, "cookie_accept_all")}
                className="flex-1 bg-champagne-gold px-5 py-3 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:bg-soft-gold"
              >
                Tümünü Kabul Et
              </button>
              <button
                type="button"
                onClick={() => decide(ALL_REJECTED, "cookie_reject_all")}
                className="flex-1 border border-white/25 px-5 py-3 font-button-text uppercase tracking-[0.12em] text-white transition-colors hover:border-white/60"
              >
                Tümünü Reddet
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelection(ALL_REJECTED);
                setShowPreferences(true);
              }}
              className="mt-3 w-full text-center text-body-sm text-white/60 underline underline-offset-4 transition-colors hover:text-soft-gold"
            >
              Tercihleri Yönet
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-white">
                Çerez Tercihleri
              </h2>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                aria-label="Tercihleri kapat"
                className="text-white/60 transition-colors hover:text-white"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 space-y-3">
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="font-semibold text-white">Zorunlu Çerezler</span>
                  <span className="shrink-0 bg-champagne-gold/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-soft-gold">
                    Her Zaman Aktif
                  </span>
                </div>
                <p className="text-body-sm leading-relaxed text-white/60">
                  Sitenin temel işlevleri ve güvenliği için gereklidir, devre dışı bırakılamaz.
                </p>
              </div>

              {CATEGORY_COPY.map((category) => (
                <label
                  key={category.key}
                  className="flex cursor-pointer gap-3 border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/25"
                >
                  <input
                    type="checkbox"
                    checked={selection[category.key]}
                    onChange={(event) =>
                      setSelection((prev) => ({
                        ...prev,
                        [category.key]: event.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-champagne-gold"
                  />
                  <span>
                    <span className="mb-1 block font-semibold text-white">{category.title}</span>
                    <span className="block text-body-sm leading-relaxed text-white/60">
                      {category.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => decide(selection, "cookie_preferences_save")}
                className="flex-1 bg-champagne-gold px-5 py-3 font-button-text uppercase tracking-[0.12em] text-midnight-navy transition-colors hover:bg-soft-gold"
              >
                Seçimleri Kaydet
              </button>
              <button
                type="button"
                onClick={() => decide(ALL_ACCEPTED, "cookie_accept_all")}
                className="flex-1 border border-white/25 px-5 py-3 font-button-text uppercase tracking-[0.12em] text-white transition-colors hover:border-white/60"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
