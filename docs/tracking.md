# Kazanım Gayrimenkul — Tracking / dataLayer Planı

Bu belge; sitedeki tüm `window.dataLayer` olaylarını, tetiklenme koşullarını,
örnek payload'ları ve GTM → GA4 → Google Ads eşleme önerilerini tanımlar.

> **UYARI — PII YASAĞI:** dataLayer'a hiçbir koşulda kişisel veri (ad, e-posta,
> telefon, mesaj içeriği, CV) gönderilmez. `lib/tracking.ts` içindeki `scrub()`
> fonksiyonu, e-posta/telefon desenine benzeyen değerleri son savunma hattı
> olarak ayıklar; ama asıl kural **çağıran kodun PII göndermemesidir**. GTM
> tarafında da hiçbir değişkene form alanı bağlamayın.

## Temel İlkeler

1. Google Ads dönüşüm ID/label'ları **koda gömülmez**. Uygulama anlamlı
   olaylar üretir; GTM bunları GA4 key event'lerine ve Ads dönüşümlerine eşler.
2. Tüm yardımcılar yalnızca tarayıcıda çalışır, hata durumunda sessiz kalır.
3. Her olay benzersiz `event_id` (UUID) ve ISO `timestamp` taşır.
4. GTM yalnızca kamuya açık sayfalarda yüklenir; `/admin` hiçbir analitik
   yüklemez.
5. `NEXT_PUBLIC_GTM_ID` boşsa GTM yüklenmez; Consent Mode bootstrap yine de
   çalışır (ileride ID eklendiğinde davranış değişmez).

## Ortak Payload Alanları

Her olaya otomatik eklenir:

```json
{
  "event": "…",
  "event_id": "8b1c9f2e-…",
  "site_id": "kazanim",
  "site_name": "Kazanım Gayrimenkul",
  "language": "tr",
  "page_path": "/projeler/kazanim-vadi",
  "page_title": "Kazanım Vadi | Kazanım Gayrimenkul",
  "timestamp": "2026-07-23T12:00:00.000Z"
}
```

`undefined`/boş alanlar push edilmez.

## Olay Kataloğu

### Sayfa ve Navigasyon

| Olay | Tetik | Ek alanlar |
| --- | --- | --- |
| `page_view_custom` | Her rota değişiminde 1 kez (App Router navigasyonu dahil) | `page_path` |
| `navigation_click` | Header menü linki tıklaması | `event_label` (menü etiketi) |
| `footer_link_click` | Footer linki tıklaması | `event_label` |
| `mobile_sticky_bar_click` | Mobil yapışkan bar aksiyonu | `event_label` |

### CTA ve İletişim (birincil Ads dönüşüm adayları)

| Olay | Tetik | Ek alanlar |
| --- | --- | --- |
| `hero_cta_click` | Hero butonları | `cta_location: "hero"`, `event_label` |
| `section_cta_click` | Bölüm CTA'ları (header "Bilgi Al" dahil) | `cta_location`, `event_label` |
| `project_cta_click` | Proje kartı/detay CTA | proje alanları |
| `phone_click` | Her `tel:` linki | `contact_method: "phone"`, `event_label` (konum) |
| `whatsapp_click` | Her WhatsApp linki | `contact_method: "whatsapp"` |
| `email_click` | Her `mailto:` linki | `contact_method: "email"` |
| `directions_click` | Yol tarifi linki | `contact_method: "directions"` |

### Formlar

| Olay | Tetik |
| --- | --- |
| `contact_form_start` / `project_form_start` / `career_form_start` | Formla **ilk** etkileşimde bir kez (focus) |
| `contact_form_submit` / `project_form_submit` / `career_form_submit` | Sunucu kaydı **onayladıktan sonra** |
| `contact_form_error` / `project_form_error` / `career_form_error` | Doğrulama/sunucu/ağ hatası (`event_label`: `validation`\|`server`\|`network`) |
| `lead_form_submit` | Her başarılı form kaydında form-özel olayla birlikte push edilen **normalize dönüşüm olayı** |

Başarılı gönderim payload örneği:

```json
{
  "event": "lead_form_submit",
  "event_category": "lead",
  "event_action": "submit",
  "form_name": "project_form",
  "form_location": "project_detail",
  "lead_type": "project",
  "lead_id": "cmb2…",         // sunucu üretimi opak ID — PII değil
  "project_slug": "kazanim-vadi",
  "value": 1,
  "currency": "TRY"
}
```

- `form_start` form etkileşim oturumu başına yalnızca **bir kez** atılır
  (React StrictMode/yeniden render tekrarları engellenir).
- Submit olayları **yalnızca** sunucu lead'i veritabanına kaydettikten sonra
  atılır; başarısız kayıt dönüşüm üretmez.

### Proje Etkileşimi

| Olay | Tetik | Ek alanlar |
| --- | --- | --- |
| `project_list_view` | Proje listesi mount | `event_label`: "N proje" |
| `project_filter_apply` | Liste filtreleri veya ana sayfa proje arama paneli | `event_label`, `filter_location`, `filter_project_type`, `filter_project_status` |
| `project_card_click` | Proje kartı tıklaması | `project_id/slug/name/status/type` |
| `project_detail_view` | Proje detay sayfası görüntüleme | proje alanları |
| `project_gallery_open` | Proje galerisinde görsel açma | proje alanları |
| `project_pdf_click` | Proje dokümanı indirme | `event_label` |

### Haber ve Galeri

| Olay | Tetik |
| --- | --- |
| `news_list_view` | Haber listesi görüntüleme |
| `news_article_view` | Haber detay görüntüleme (`news_slug`, `news_category`) |
| `news_share_click` | Paylaşım butonu (`event_label`: kanal) |
| `gallery_filter_apply` | Galeri kategori filtresi (`gallery_category`) |
| `gallery_image_open` | Galeri lightbox açılışı |

### Çerez / Rıza

| Olay | Tetik |
| --- | --- |
| `cookie_banner_view` | Band ilk kez gösterildiğinde |
| `cookie_accept_all` | "Tümünü Kabul Et" |
| `cookie_reject_all` | "Tümünü Reddet" |
| `cookie_preferences_save` | Tercih panelinden kaydetme |

## Consent Mode v2

- Bootstrap (GTM yüklenmeden önce) tüm izinleri `denied` başlatır:
  `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`,
  `functionality_storage`, `personalization_storage` (`security_storage:
  granted`, `wait_for_update: 500`).
- Çerez bandı kararı `gtag('consent','update', …)` push eder:
  - Analitik → `analytics_storage`
  - Pazarlama → `ad_storage`, `ad_user_data`, `ad_personalization`
  - Tercih → `functionality_storage`, `personalization_storage`
- Karar `localStorage["kazanim_cookie_consent"]` + `kazanim_consent` çerezinde
  (180 gün) saklanır; sürüm değişirse band yeniden gösterilir.
- `NEXT_PUBLIC_ENABLE_CONSENT_MODE=false` ile tamamen kapatılabilir (önerilmez).

## Atıf (Attribution) Yakalama

- URL'den okunanlar: `utm_source/medium/campaign/term/content`, `gclid`,
  `gbraid`, `wbraid`, `fbclid`, `msclkid`.
- **First-touch**: ilk yakalanan değerler + `landing_page` + `referrer`;
  sonraki sayfalarda **üzerine yazılmaz**. Pazarlama rızası varsa
  `localStorage["kazanim_attribution_first"]` (kalıcı), yoksa yalnızca
  `sessionStorage` (oturum sonunda silinir).
- **Last-touch**: yeni kampanya parametreleri geldikçe
  `sessionStorage["kazanim_attribution_last"]` güncellenir.
- Form gönderiminde first-touch değerleri lead kaydına yazılır
  (`utmSource…msclkid`, `landingPage`, `referrer`, `sourcePage` sütunları).
  dataLayer'a değil — dataLayer yalnızca `lead_id` görür.

## GTM Kurulum Önerisi

Data Layer değişkenleri (Version 2): `event_id`, `site_id`, `page_type`,
`cta_location`, `contact_method`, `form_name`, `form_location`, `lead_type`,
`lead_id`, `project_slug`, `project_status`, `project_type`, `news_slug`,
`gallery_category`, `value`, `currency`.

Önerilen tetikleyiciler: her olay adı için bir "Custom Event" tetikleyicisi.

### GA4 Eşlemesi

| dataLayer olayı | GA4 olayı | Not |
| --- | --- | --- |
| `page_view_custom` | (gerek yok) | GA4 config otomatik page_view atar; SPA geçişleri için History Change ya da bu olay kullanılabilir |
| `lead_form_submit` | `generate_lead` | **key event** olarak işaretleyin |
| `phone_click` | `phone_call_click` | key event adayı |
| `whatsapp_click` | `whatsapp_click` | key event adayı |
| `project_detail_view` | `view_item` | `item_id: project_slug` |
| `project_filter_apply` | `search`/özel | isteğe bağlı |
| diğerleri | aynı adla özel olay | parametreleri geçirin |

### Google Ads Dönüşüm Önerileri

| Dönüşüm | Tetikleyici olay | Değer |
| --- | --- | --- |
| Form Lead (birincil) | `lead_form_submit` | `value`/`currency` (1 TRY sembolik) — `event_id` ile tekilleştirme |
| Telefon Tıklaması | `phone_click` | — |
| WhatsApp Tıklaması | `whatsapp_click` | — |

Enhanced Conversions **kullanmayın** — dataLayer'da PII yoktur ve olmamalıdır.

## Hata Ayıklama

- Geliştirmede veya `NEXT_PUBLIC_TRACKING_DEBUG=true` iken her push
  `console.debug("[tracking] <event>", payload)` olarak loglanır.
- Üretimde görsel debug paneli yoktur; GTM Preview kullanın.

## QA Kontrol Listesi

- [ ] GTM yalnızca geçerli `NEXT_PUBLIC_GTM_ID` varken yüklenir
- [ ] `/admin` altında GTM/analitik yüklenmez
- [ ] Her rota geçişinde `page_view_custom` **bir kez** atılır
- [ ] `*_form_start` form başına bir kez; sayfa yenilenmeden ikinci kez atılmaz
- [ ] Submit olayları yalnızca sunucu 200 + `leadId` döndükten sonra atılır
- [ ] `phone/whatsapp/email/directions_click` tıklama başına bir kez
- [ ] dataLayer'da hiçbir PII yok (adı/e-postayı dolduran test gönderimi yapıp
      `window.dataLayer`'ı gözle kontrol edin)
- [ ] Rıza öncesi hiçbir pazarlama/analitik çerezi yazılmıyor (Application →
      Cookies ile doğrulayın)
- [ ] `?utm_source=test&gclid=x` ile girişte first-touch yakalanıyor; ikinci
      sayfada üzerine yazılmıyor; lead kaydında görünüyor
- [ ] `cookie_*` olayları band etkileşimlerinde atılıyor
