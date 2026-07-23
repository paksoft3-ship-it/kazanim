/**
 * Kazanım Gayrimenkul — dataLayer tracking layer.
 *
 * Design rules (see docs/tracking.md):
 *  1. No Google Ads conversion IDs live in the app. We push structured,
 *     semantic events; GTM maps them to GA4 key events and Ads conversions.
 *  2. NEVER push PII. No name, e-mail, phone, or message body ever enters
 *     the dataLayer — only a generated lead_id and event metadata.
 *  3. Every helper is browser-only and fails silently server-side.
 *  4. Every event carries a unique `event_id` and ISO `timestamp`.
 */

export const SITE_ID = "kazanim" as const;
export const SITE_NAME = "Kazanım Gayrimenkul" as const;
export const LANGUAGE = "tr" as const;

export type ContactMethod = "phone" | "whatsapp" | "email" | "directions" | "form";

export type DataLayerPayload = {
  event: string;
  event_id: string;
  site_id: typeof SITE_ID;
  site_name: typeof SITE_NAME;
  language: typeof LANGUAGE;
  page_type?: string;
  page_path?: string;
  page_title?: string;
  content_group?: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  cta_text?: string;
  cta_location?: string;
  contact_method?: ContactMethod;
  form_id?: string;
  form_name?: string;
  form_location?: string;
  lead_type?: string;
  lead_id?: string;
  project_id?: string;
  project_slug?: string;
  project_name?: string;
  project_status?: string;
  project_type?: string;
  filter_location?: string;
  filter_project_type?: string;
  filter_project_status?: string;
  news_slug?: string;
  news_category?: string;
  gallery_category?: string;
  value?: number;
  currency?: "TRY";
  timestamp?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  msclkid?: string;
};

/** Payload minus the fields we always fill in ourselves. */
export type EventPayload = Omit<
  DataLayerPayload,
  "event" | "event_id" | "site_id" | "site_name" | "language" | "timestamp"
>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    /** Defined by the Consent Mode bootstrap script in GTMProvider. */
    gtag?: (...args: unknown[]) => void;
  }
}

const PII_KEYS = new Set([
  "name", "full_name", "ad_soyad", "email", "e_mail", "eposta",
  "phone", "telefon", "message", "mesaj", "cv", "address", "adres",
]);

function isEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return process.env.NEXT_PUBLIC_ENABLE_DATALAYER !== "false";
}

function isDebug(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_TRACKING_DEBUG === "true"
  );
}

/** Unique per-event ID so GTM/GA4 can deduplicate. */
function newEventId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through
  }
  return `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Defensive scrub: drops any key that looks like PII and any value that
 * looks like an e-mail or a phone number, regardless of key name.
 * This is a backstop — callers should never pass PII in the first place.
 */
function scrub(payload: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null || value === "") continue;
    if (PII_KEYS.has(key.toLowerCase())) continue;
    if (typeof value === "string") {
      if (/@/.test(value) && /\.[a-z]{2,}/i.test(value)) continue;
      if (/(?:\+?\d[\s()-]*){10,}/.test(value)) continue;
    }
    clean[key] = value;
  }
  return clean;
}

function currentPagePath(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.location.pathname + window.location.search;
}

/** Core push. All other helpers funnel through here. */
export function pushDataLayer(eventName: string, payload: EventPayload = {}): void {
  if (!isEnabled()) return;
  try {
    window.dataLayer = window.dataLayer || [];
    const entry = scrub({
      event: eventName,
      event_id: newEventId(),
      site_id: SITE_ID,
      site_name: SITE_NAME,
      language: LANGUAGE,
      page_path: payload.page_path ?? currentPagePath(),
      page_title: payload.page_title ?? document.title,
      timestamp: new Date().toISOString(),
      ...payload,
    });
    window.dataLayer.push(entry);
    if (isDebug()) {
      // eslint-disable-next-line no-console
      console.debug(`[tracking] ${eventName}`, entry);
    }
  } catch {
    // Tracking must never break the UI.
  }
}

// ─── Attribution capture ─────────────────────────────────────────────────────

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  msclkid?: string;
  landing_page?: string;
  referrer?: string;
};

const ATTRIBUTION_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "gclid", "gbraid", "wbraid", "fbclid", "msclkid",
] as const;

const FIRST_TOUCH_KEY = "kazanim_attribution_first";
const LAST_TOUCH_KEY = "kazanim_attribution_last";
const CONSENT_STORAGE_KEY = "kazanim_cookie_consent";

/**
 * Marketing consent gates long-lived attribution storage. Before consent (or
 * after rejection) attribution only lives in sessionStorage, which clears when
 * the browsing session ends. See docs/tracking.md for retention behaviour.
 */
function hasMarketingConsent(): boolean {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const stored = JSON.parse(raw) as { marketing?: boolean };
    return stored.marketing === true;
  } catch {
    return false;
  }
}

function readStore(storage: Storage, key: string): Attribution {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

function writeStore(storage: Storage, key: string, value: Attribution): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked (private mode) — attribution is best-effort.
  }
}

/**
 * Read UTM params and click IDs from the URL and persist attribution:
 *  - first-touch: written once and never overwritten on later pages;
 *  - last-touch: refreshed whenever new campaign parameters arrive.
 * First-touch also records the landing page and original referrer.
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: Attribution = {};
    for (const key of ATTRIBUTION_PARAMS) {
      const value = params.get(key);
      if (value) fromUrl[key] = value;
    }

    const persistent = hasMarketingConsent() ? window.localStorage : window.sessionStorage;

    // First-touch: only fill values that are not already recorded.
    const first = {
      ...readStore(window.sessionStorage, FIRST_TOUCH_KEY),
      ...readStore(window.localStorage, FIRST_TOUCH_KEY),
    };
    const firstIsNew = Object.keys(first).length === 0;
    const mergedFirst: Attribution = { ...fromUrl, ...first };
    if (firstIsNew) {
      mergedFirst.landing_page = window.location.pathname;
      if (document.referrer) mergedFirst.referrer = document.referrer;
    }
    if (Object.keys(mergedFirst).length > 0) {
      writeStore(persistent, FIRST_TOUCH_KEY, mergedFirst);
    }

    // Last-touch: new campaign parameters replace the previous ones.
    if (Object.keys(fromUrl).length > 0) {
      writeStore(window.sessionStorage, LAST_TOUCH_KEY, fromUrl);
    }

    return mergedFirst;
  } catch {
    return {};
  }
}

/** First-touch attribution (campaign params + landing page + referrer). */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return {
    ...readStore(window.sessionStorage, FIRST_TOUCH_KEY),
    ...readStore(window.localStorage, FIRST_TOUCH_KEY),
  };
}

/** Last-touch campaign attribution for the current session. */
export function getLastTouchAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return readStore(window.sessionStorage, LAST_TOUCH_KEY);
}

// ─── Page / navigation ───────────────────────────────────────────────────────

export function trackPageView(payload: EventPayload = {}): void {
  pushDataLayer("page_view_custom", payload);
}

export function trackNavigationClick(label: string, payload: EventPayload = {}): void {
  pushDataLayer("navigation_click", {
    event_category: "navigation",
    event_action: "click",
    event_label: label,
    ...payload,
  });
}

export function trackFooterLinkClick(label: string, payload: EventPayload = {}): void {
  pushDataLayer("footer_link_click", {
    event_category: "navigation",
    event_action: "click",
    event_label: label,
    ...payload,
  });
}

export function trackMobileStickyBarClick(label: string, payload: EventPayload = {}): void {
  pushDataLayer("mobile_sticky_bar_click", {
    event_category: "navigation",
    event_action: "click",
    event_label: label,
    ...payload,
  });
}

// ─── CTA clicks ──────────────────────────────────────────────────────────────

export function trackCTA(
  eventName: "hero_cta_click" | "section_cta_click" | "project_cta_click" | "news_cta_click",
  payload: EventPayload = {},
): void {
  pushDataLayer(eventName, {
    event_category: "cta",
    event_action: "click",
    ...payload,
  });
}

export function trackLegalPdfClick(label: string, payload: EventPayload = {}): void {
  pushDataLayer("legal_pdf_click", {
    event_category: "document",
    event_action: "click",
    event_label: label,
    ...payload,
  });
}

// ─── Contact clicks (primary Google Ads conversions) ─────────────────────────

export function trackContactClick(
  method: ContactMethod,
  label: string,
  payload: EventPayload = {},
): void {
  const eventByMethod: Record<ContactMethod, string> = {
    phone: "phone_click",
    whatsapp: "whatsapp_click",
    email: "email_click",
    directions: "directions_click",
    form: "form_click",
  };
  pushDataLayer(eventByMethod[method], {
    contact_method: method,
    event_category: "contact",
    event_action: "click",
    event_label: label,
    ...payload,
  });
}

// ─── Forms ───────────────────────────────────────────────────────────────────

export type FormKind = "contact" | "project" | "career";

export function trackFormStart(kind: FormKind, payload: EventPayload = {}): void {
  pushDataLayer(`${kind}_form_start`, {
    event_category: "form",
    event_action: "start",
    form_name: `${kind}_form`,
    ...payload,
  });
}

export function trackFormError(
  kind: FormKind,
  reason: string,
  payload: EventPayload = {},
): void {
  pushDataLayer(`${kind}_form_error`, {
    event_category: "form",
    event_action: "error",
    event_label: reason,
    form_name: `${kind}_form`,
    ...payload,
  });
}

/**
 * Successful submission. Pushes the form-specific event AND the unified
 * `lead_form_submit` that Google Ads uses as the primary conversion.
 * `leadId` is a server-generated opaque ID — never a name or e-mail.
 * Only called after the server confirms the lead was persisted.
 */
export function trackFormSubmit(
  kind: FormKind,
  leadId: string,
  payload: EventPayload = {},
): void {
  const base: EventPayload = {
    event_category: "lead",
    event_action: "submit",
    form_name: `${kind}_form`,
    lead_id: leadId,
    value: 1,
    currency: "TRY",
    ...payload,
  };

  pushDataLayer(`${kind}_form_submit`, base);
  pushDataLayer("lead_form_submit", base);
}

// ─── Projects ────────────────────────────────────────────────────────────────

export function trackProjectListView(payload: EventPayload = {}): void {
  pushDataLayer("project_list_view", { event_category: "project", ...payload });
}

export function trackProjectFilter(filterLabel: string, payload: EventPayload = {}): void {
  pushDataLayer("project_filter_apply", {
    event_category: "project",
    event_action: "filter",
    event_label: filterLabel,
    ...payload,
  });
}

export function trackProjectCardClick(payload: EventPayload = {}): void {
  pushDataLayer("project_card_click", {
    event_category: "project",
    event_action: "click",
    ...payload,
  });
}

export function trackProjectView(payload: EventPayload = {}): void {
  pushDataLayer("project_detail_view", {
    event_category: "project",
    event_action: "view",
    page_type: "project_detail",
    ...payload,
  });
}

export function trackProjectGalleryOpen(payload: EventPayload = {}): void {
  pushDataLayer("project_gallery_open", {
    event_category: "project",
    event_action: "open",
    ...payload,
  });
}

export function trackProjectPdfClick(label: string, payload: EventPayload = {}): void {
  pushDataLayer("project_pdf_click", {
    event_category: "project",
    event_action: "download",
    event_label: label,
    ...payload,
  });
}

// ─── News ────────────────────────────────────────────────────────────────────

export function trackNewsListView(payload: EventPayload = {}): void {
  pushDataLayer("news_list_view", { event_category: "news", ...payload });
}

export function trackNewsView(payload: EventPayload = {}): void {
  pushDataLayer("news_article_view", {
    event_category: "news",
    event_action: "view",
    page_type: "news_detail",
    ...payload,
  });
}

export function trackNewsShareClick(channel: string, payload: EventPayload = {}): void {
  pushDataLayer("news_share_click", {
    event_category: "news",
    event_action: "share",
    event_label: channel,
    ...payload,
  });
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export function trackGalleryFilter(category: string, payload: EventPayload = {}): void {
  pushDataLayer("gallery_filter_apply", {
    event_category: "gallery",
    event_action: "filter",
    gallery_category: category,
    ...payload,
  });
}

export function trackGalleryOpen(payload: EventPayload = {}): void {
  pushDataLayer("gallery_image_open", {
    event_category: "gallery",
    event_action: "open",
    ...payload,
  });
}

// ─── Cookie consent ──────────────────────────────────────────────────────────

export function trackCookieEvent(
  eventName:
    | "cookie_banner_view"
    | "cookie_accept_all"
    | "cookie_reject_all"
    | "cookie_preferences_save",
  payload: EventPayload = {},
): void {
  pushDataLayer(eventName, { event_category: "consent", ...payload });
}
