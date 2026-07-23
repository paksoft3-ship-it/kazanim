# Claude Code Master Build Prompt — Kazanım Gayrimenkul

You are Claude Code working on a local development machine. Your task is to create a complete, production-ready **Kazanım Gayrimenkul** Next.js project by using the existing local **İttifak İnşaat** project as the proven technical foundation, while rebuilding the public-facing design, content, branding, SEO identity, analytics configuration and infrastructure separation for Kazanım.

The result must be a genuinely independent website, not a simple color-swapped clone.

---

## 1. Confirmed Project Context

- Target project folder: `HusynBeyProjeleri/kazanalim`
- The existing İttifak project is currently available locally under the same general workspace.
- Do not depend on GitHub to obtain the source project. Use the local filesystem.
- The Kazanım logo is already somewhere inside the `kazanalim` folder. Locate it before changing files.
- Kazanım will later have its own GitHub repository.
- Kazanım will later be deployed as a separate Vercel project.
- Kazanım must use a separate database, storage configuration, authentication secrets, analytics identifiers and environment variables.
- The final domain has not yet been confirmed. Never hard-code a production domain.
- Website language: Turkish only.
- Page structure and admin modules: broadly the same as the completed İttifak project.
- Business positioning: similar to İttifak — construction, real estate and project development — but Kazanım should have a stronger premium investment-value presentation.
- Content must be written specifically for Kazanım. Do not merely replace the company name inside İttifak copy.

---

## 2. Non-Negotiable Safety Rules

Before writing or deleting anything:

1. Verify that the active target path resolves to `HusynBeyProjeleri/kazanalim`.
2. Locate the source İttifak project under the parent workspace by looking for a Next.js project containing clear references to `İttifak İnşaat`, the existing public pages and the admin routes.
3. Never modify, rename, migrate, clean or delete the source İttifak project.
4. Never copy the source `.git`, `.vercel`, `.next`, `node_modules`, local database files, uploaded user files, caches or secret environment files.
5. Never reuse the İttifak production database, storage tokens, auth secret, email credentials, GTM ID, GA4 ID, Google Ads ID or any other secret.
6. Preserve the Kazanım logo already present in the target folder before copying files.
7. If more than one possible İttifak source project is found and the correct source cannot be identified confidently, stop before changing files and report the candidate paths.
8. Do not stop for minor design or content uncertainties. Make sensible, reversible assumptions and document them in the final implementation report.

Create a temporary local backup or copy plan before large changes. Do not overwrite unique files already present in `kazanalim` without first inspecting them.

---

## 3. High-Level Execution Strategy

Complete the work in these phases:

### Phase A — Discover and Copy the Technical Foundation

- Inspect the local İttifak project thoroughly.
- Understand its Next.js version, App Router structure, database layer, authentication, admin CRUD, upload adapter, forms, SEO implementation, tracking utilities, tests and deployment configuration.
- Copy the reusable technical project into `HusynBeyProjeleri/kazanalim` while excluding generated files, secrets and repository metadata.
- Keep proven architecture where it is sound.
- Do not rewrite working systems merely for novelty.

### Phase B — Make the Project Independent

- Change the package name and internal project identity to Kazanım.
- Remove inherited Git/Vercel metadata.
- Create a clean independent `.gitignore`.
- If the target is not already a repository, initialize a new local Git repository after the project is stable. Do not push automatically.
- Create a Kazanım-specific `.env.example` with blank values.
- Remove all inherited environment files and service bindings.
- Require a new `DATABASE_URL` and new service credentials.
- Update README and deployment instructions for the Kazanım project.

### Phase C — Purge İttifak Branding and Content

Search the complete target codebase, database seed, static files, metadata and configuration for all inherited İttifak references, including:

- `İttifak`
- `ittifak`
- old company names
- old domains
- old emails and phone numbers
- old addresses
- old logos and favicon files
- blue/cyan-specific design tokens
- old project names
- old organization schema
- old social metadata
- old analytics IDs
- old cookie names
- old localStorage keys
- old image alt text
- old footer/legal references

Remove or replace them deliberately. Do not perform a blind text replacement that creates awkward Turkish content.

Add a script such as `npm run audit:brand` that scans production source files for forbidden legacy brand terms and fails if unapproved İttifak references remain. Exclude migration notes and documentation only when necessary.

### Phase D — Rebuild the Kazanım Public Experience

Keep the underlying functionality but rebuild the public visual system and front-end composition according to the approved Kazanım design direction below.

### Phase E — Verify Admin, SEO, Tracking and Deployment

Run database checks, CRUD tests, form tests, tracking validation, accessibility checks, lint, typecheck and production build. Fix all blocking issues before reporting completion.

---

## 4. Approved Kazanım Design Direction

The user selected the **first generated homepage concept** as the visual reference.

The design must communicate:

- premium real-estate investment value
- trust and long-term value
- modern Istanbul property development
- strong corporate credibility
- refined, calm luxury
- clear conversion paths

It must not look like:

- a generic property listing portal
- a cheap marketplace
- a black-and-gold template
- a clone of İttifak
- a noisy dashboard placed on a public website
- an over-animated agency landing page

### Approved Color System

Create semantic design tokens and Tailwind/CSS variables:

```css
--deep-emerald: #063E36;
--forest-emerald: #0B5145;
--dark-navy: #071D2B;
--midnight-navy: #061824;
--champagne-gold: #C7A45B;
--soft-gold: #E3D0A4;
--warm-ivory: #F7F2E8;
--soft-cream: #FBF8F1;
--soft-white: #FFFFFF;
--charcoal: #1E262B;
--slate: #6A7479;
--warm-border: #DDD4C4;
--admin-background: #F4F6F7;
--success: #28765C;
--warning: #B97A2F;
--danger: #B44B4B;
```

Use emerald and dark navy as the dominant brand colors. Use champagne gold with restraint for borders, icons, numbers, active states and premium accents. Warm ivory must provide breathing room and readability.

### Typography

- Large public headings: an elegant high-quality serif using `next/font`, such as Cormorant Garamond, Playfair Display or another well-supported equivalent.
- Body, navigation, buttons, forms and admin: a modern sans-serif such as Inter or Manrope.
- Avoid ultra-thin text.
- Maintain high contrast and comfortable Turkish typography.

### Logo Rules

- Locate the Kazanım logo inside the target folder.
- Use the actual logo image, not typed replacement text.
- Preserve proportions and visual integrity.
- Do not stretch, distort or redesign it.
- If only one logo variant exists, place it on a suitable contrasting background rather than applying destructive filters.
- Copy the approved asset into a clear path such as `public/brand/kazanim-logo.*` while retaining the original source file.
- Generate favicon/app icons from the provided logo only when technically possible without changing the mark.

---

## 5. Homepage Visual Composition

The homepage should closely follow the selected first concept in visual rhythm, hierarchy and section contrast, while remaining responsive and technically realistic.

### 5.1 Premium Header

- Dark navy/emerald header.
- Kazanım logo on the left.
- Navigation in Turkish:
  - Ana Sayfa
  - Kurumsal
  - Projeler
  - Galeri
  - Haberler
  - İnsan Kaynakları
  - İletişim
- Phone/contact action on the right.
- Premium gold CTA button: `Bilgi Al`.
- Sticky behavior with a compact scrolled state.
- Accessible mobile drawer.
- Active link indicated with a restrained gold or emerald detail.

### 5.2 Hero

Create a large cinematic hero using a premium Istanbul residence/city/property visual when a legitimate Kazanım-owned asset exists. If no suitable asset exists, use a high-quality neutral architectural placeholder and make it easy to replace from admin. Do not fabricate a real project claim.

Hero content direction:

- Eyebrow: `DEĞER KATAN PROJELER`
- Main heading: `Doğru Konum. Güvenli Yatırım. Kalıcı Değer.`
- Supporting text written specifically for Kazanım.
- Primary CTA: `Projeleri İncele`
- Secondary CTA: `Bilgi Al`
- Optional subtle video/view action only if a real media asset is available.

Use a dark emerald/navy image overlay for readability, with gold emphasis on selected words.

### 5.3 Overlapping Project Finder

Place a premium search/filter panel overlapping the lower hero boundary. This is a finder for Kazanım's own projects, not a public property marketplace.

Suggested filters:

- Lokasyon
- Proje Türü
- Proje Durumu
- Teslim Dönemi
- Search button: `Projeleri Bul`

Filters must connect to the actual project data model and `/projeler` query parameters. Do not create nonfunctional decorative controls.

### 5.4 About / Value Introduction

Use a light warm-ivory section with:

- large architectural image
- Kazanım-specific company introduction
- trust and value language
- a restrained statistic row
- CTA to the corporate page

Do not publish unverified claims. Any numeric values must be editable and clearly seeded as placeholders or hidden until approved.

### 5.5 Featured Projects

Use a dark emerald section containing premium project cards:

- large image
- status badge
- project title
- location
- short description
- type/status details
- `Detayları İncele` CTA

Cards must look editorial and premium, not like a crowded classifieds portal.

### 5.6 Services / Activity Areas

Use a warm ivory/white section with refined icon-led cards for:

- Proje Geliştirme
- Konut Projeleri
- Ticari Projeler
- Gayrimenkul Değerlendirme
- Satış ve Pazarlama Süreçleri
- Satış Sonrası İletişim

Keep all wording editable from admin. Avoid regulated-service claims that are not confirmed.

### 5.7 Trust Strip

Use a dark navy/emerald strip highlighting:

- Doğru Lokasyon
- Nitelikli Proje
- Şeffaf Süreç
- Sürdürülebilir Değer
- Güvenilir İletişim

### 5.8 Process Timeline

Use a light section with a horizontal desktop and vertical mobile timeline:

1. İhtiyaç Analizi
2. Proje ve Lokasyon Değerlendirmesi
3. Bilgilendirme
4. Karar Süreci
5. Teslim ve İletişim

### 5.9 News and Insights

Use a dark premium section or alternating dark/light composition for Kazanım news, project announcements and market insights.

### 5.10 Lead Form

Create a strong but compact lead section with:

- Ad Soyad
- Telefon
- E-posta
- İlgilenilen Proje / Talep Türü
- Mesaj
- KVKK checkbox
- `Bilgi Talep Et` button

The form must be connected to the database and tracking system.

### 5.11 Footer

Use a deep navy/emerald footer with:

- actual Kazanım logo
- short corporate summary
- quick links
- project links
- contact information
- social links
- legal links
- copyright text

---

## 6. Public Route Structure

Keep the same practical page structure as İttifak, but rebuild the visual presentation and write Kazanım-specific content.

1. `/` — Ana Sayfa
2. `/kurumsal/hakkimizda` — Hakkımızda
3. `/kurumsal/tarihcemiz` — Tarihçemiz
4. `/kurumsal/vizyon-misyon` — Vizyon ve Misyon
5. `/kurumsal/kalite-politikamiz` — Kalite Politikamız
6. `/kurumsal/faaliyet-alanlari` — Faaliyet Alanları
7. `/projeler` — Tüm Projeler
8. `/projeler/devam-eden` — Devam Eden Projeler
9. `/projeler/tamamlanan` — Tamamlanan Projeler
10. `/projeler/[slug]` — Proje Detayı
11. `/galeri` — Galeri
12. `/haberler` — Haberler ve Duyurular
13. `/haberler/[slug]` — Haber Detayı
14. `/insan-kaynaklari` — İnsan Kaynakları
15. `/iletisim` — İletişim
16. `/kvkk` — KVKK Aydınlatma Metni
17. `/gizlilik-politikasi` — Gizlilik Politikası
18. `/cerez-politikasi` — Çerez Politikası
19. `/kullanim-kosullari` — Kullanım Koşulları
20. Custom `not-found` page

Public page requirements:

- shared premium header and footer
- responsive layouts
- breadcrumbs where appropriate
- admin-editable content
- server-rendered content where practical
- semantic HTML
- keyboard accessibility
- visible focus states
- correct empty states
- clear CTA hierarchy
- no lorem ipsum
- no inherited İttifak copy

---

## 7. Kazanım-Specific Content Rules

Write polished Turkish content for Kazanım. The content must feel natural and corporate, not machine-translated.

### Positioning

Kazanım should be presented as a real estate and project development company focused on:

- carefully considered locations
- quality living and commercial spaces
- transparent project communication
- long-term value
- modern architecture
- responsible development

### Avoid Unsupported Claims

Do not invent:

- exact years of experience
- project counts
- customer counts
- total investment volume
- awards
- certificates
- partnerships
- guaranteed returns
- exact delivery records
- legal approvals

Where the design requires statistics, create editable settings with safe placeholder labels and keep them hidden by default until an administrator approves values. In local development, clearly mark demo content in the admin panel.

### Seed Project Content

Create Kazanım-specific example projects only as editable demo/draft content, for example:

- Kazanım Vadi
- Kazanım Bosphorus
- Kazanım Cadde
- Kazanım Residence
- Kazanım İş Merkezi
- Kazanım Yaşam Evleri

Mark these as demo records in development. Do not imply they are real published projects unless the administrator explicitly publishes them.

Use neutral owned/local placeholders if no approved project imagery exists. Never present generated or unrelated architecture as a completed real project without a visible demo status in the admin workflow.

### Legal Content

Create editable Turkish legal-page starter text, but include an admin-only notice that legal counsel should review it before production launch. Do not display alarming draft warnings publicly.

---

## 8. Admin Panel Requirements

The admin panel should remain simple, practical and complete enough to manage the entire website without code changes.

Base route:

```text
/admin
```

### Required Admin Screens

1. `/admin/login`
2. `/admin` — dashboard
3. `/admin/projects`
4. `/admin/projects/new`
5. `/admin/projects/[id]`
6. `/admin/pages`
7. `/admin/gallery`
8. `/admin/news`
9. `/admin/forms`
10. `/admin/hr`
11. `/admin/site-settings`
12. `/admin/seo`
13. `/admin/users`

### Admin Sidebar

- Genel Bakış
- Projeler
- Galeri
- Haberler
- Sayfalar
- Form Talepleri
- İnsan Kaynakları
- Site Ayarları
- SEO Ayarları
- Kullanıcılar
- Çıkış Yap

### Admin Visual Style

The admin may reuse the proven İttifak admin interaction patterns but must be branded for Kazanım:

- deep navy/emerald sidebar
- white content cards
- warm borders
- emerald primary buttons
- restrained gold accents
- clean tables and forms
- actual Kazanım logo

The public site must be visually distinct; the admin does not need an expensive redesign if the existing system is usable.

### Admin Must Control

The administrator must be able to manage:

- logo and favicon references
- company name and short description
- phone, WhatsApp, email and address
- social links
- header navigation labels/order/visibility
- footer columns and legal links
- floating contact buttons
- homepage hero content and media
- homepage section text, images, visibility and ordering
- project finder options
- project records, status, type, location and delivery information
- project cover and gallery images
- project features and technical details
- featured projects
- gallery albums/assets
- news and announcements
- page content
- legal-page content
- job positions
- career applications
- contact/project lead submissions
- SEO title and description per page/project/article
- canonical override
- Open Graph image
- robots directives
- global SEO defaults
- basic redirects if the source already supports them
- basic users and roles

### Content Editing Approach

Do not build a heavy free-form page builder. Use structured, predefined section editors:

- section title
- eyebrow
- body text
- image/media selection
- CTA label and URL
- visibility toggle
- sort order
- theme variant where appropriate

Allow editors to reorder homepage sections using simple up/down controls or a stable sortable interface. Keep content schemas typed and validated.

### Suggested Roles

- `SUPER_ADMIN`
- `ADMIN`
- `EDITOR`
- `SALES`
- `HR`
- `VIEWER`

Enforce permissions server-side, not only by hiding buttons.

---

## 9. Data and Infrastructure Separation

Kazanım must be technically independent from İttifak.

### Database

- Preserve the proven ORM/database architecture from İttifak if it is sound.
- Use a completely new `DATABASE_URL`.
- Never copy or connect to the İttifak production database.
- Do not copy local SQLite/Postgres data files containing İttifak records.
- Create fresh migrations/seed for Kazanım when appropriate.
- If local database setup is missing, provide a safe documented local PostgreSQL option, such as Docker Compose, without embedding passwords in source control.

### Storage

- Use a separate storage token/bucket/project.
- Keep the storage abstraction from İttifak if it works.
- Never copy private uploaded files from the source.
- Validate type, extension, MIME type and size.
- Generate safe filenames.
- Store image alt text and metadata.

### Authentication

- Use a separate auth secret.
- Seed a new Kazanım admin account from environment variables.
- Never copy password hashes or user records from İttifak.
- Use secure, HTTP-only cookies.
- Protect all admin mutations server-side.

### Email

- Use separate email credentials and destination settings.
- Sending must remain optional when email env values are absent.
- Saving a lead to the database must not depend on email delivery succeeding.

---

## 10. Forms and Lead Management

Implement or preserve these working forms:

### Contact Form

- Ad Soyad
- Telefon
- E-posta
- Talep Türü
- Mesaj
- KVKK checkbox

### Project Information Form

- Ad Soyad
- Telefon
- E-posta
- İlgilenilen Proje
- Mesaj
- KVKK checkbox

### Career Application Form

- Ad Soyad
- Telefon
- E-posta
- Pozisyon
- Mesaj
- CV upload, optional
- KVKK checkbox

### Requirements

- Zod or equivalent server-side validation
- client-side usability validation
- honeypot field
- rate limiting
- safe error messages
- database persistence
- UTM and click-ID attribution capture
- optional email notification
- status workflow in admin
- internal notes
- CSV export if the source already includes it or it can be added simply
- never place name, email, phone, message or CV details in `dataLayer`

Push success/conversion events only after the server confirms that the lead was saved.

---

## 11. Complete DataLayer, GTM, GA4 and Google Ads Foundation

The website will run Google Ads later. Build a clean event-driven tracking system now.

### Core Principle

Public components must push structured events to `window.dataLayer`. Do not hard-code Google Ads conversion labels in individual buttons or forms. GTM will map events to GA4 and Google Ads later.

### Tracking Identity

Use:

```ts
site_id: 'kazanim'
site_name: 'Kazanım Gayrimenkul'
language: 'tr'
```

### Environment Variables

Create `.env.example` containing at least:

```env
# Public site identity — final domain not confirmed yet
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME="Kazanım Gayrimenkul"

# Tracking — use separate Kazanım IDs
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_ENABLE_DATALAYER=true
NEXT_PUBLIC_ENABLE_CONSENT_MODE=true
NEXT_PUBLIC_TRACKING_DEBUG=false

# Database and authentication — never reuse İttifak values
DATABASE_URL=
AUTH_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Storage
BLOB_READ_WRITE_TOKEN=
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# Optional email
RESEND_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FORM_NOTIFICATION_EMAIL=
```

Only retain environment variables actually supported by the implementation, but keep provider interfaces clear.

### GTM Installation

- Initialize `window.dataLayer` before any event push.
- Load the GTM script only when a valid `NEXT_PUBLIC_GTM_ID` is present.
- Include the noscript fallback.
- Track public routes only; do not load marketing analytics in `/admin`.
- Avoid duplicate GTM injection.
- Support App Router navigation.

### Consent Mode v2 Foundation

Before marketing/analytics tags can fire, support these consent keys:

- `analytics_storage`
- `ad_storage`
- `ad_user_data`
- `ad_personalization`

Default to denied before consent when consent mode is enabled. Provide a Turkish cookie banner and preference panel with:

- Gerekli
- Analitik
- Pazarlama

Persist consent safely. Update consent when preferences change. Provide links to the cookie and privacy policies.

Do not pretend to provide legal compliance automatically. Make the content and categories editable and document that production legal review is required.

### Tracking Utility

Create a typed central module, for example:

```text
lib/tracking/
  types.ts
  data-layer.ts
  attribution.ts
  consent.ts
  events.ts
```

Provide safe helpers such as:

- `pushDataLayer`
- `trackPageView`
- `trackNavigationClick`
- `trackCtaClick`
- `trackContactClick`
- `trackFormStart`
- `trackFormSubmit`
- `trackFormError`
- `trackProjectListView`
- `trackProjectFilter`
- `trackProjectCardClick`
- `trackProjectDetailView`
- `trackGalleryOpen`
- `trackNewsView`
- `trackCookieAction`

All helpers must:

- work only in the browser
- fail safely when tracking is disabled
- never throw into the user experience
- never push PII
- include a unique `event_id`
- include an ISO timestamp
- avoid duplicate events caused by React Strict Mode, rerenders or repeated observers
- make `form_start` fire only once per form interaction session
- make form success fire only once per successful saved submission

### Common Event Payload

Use a consistent schema:

```ts
type KazanimDataLayerEvent = {
  event: string;
  event_id: string;
  timestamp: string;
  site_id: 'kazanim';
  site_name: 'Kazanım Gayrimenkul';
  language: 'tr';
  page_type?: string;
  page_path?: string;
  page_title?: string;
  content_group?: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  cta_text?: string;
  cta_location?: string;
  contact_method?: 'phone' | 'whatsapp' | 'email' | 'directions' | 'form';
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
  currency?: 'TRY';
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
```

Do not include undefined fields unnecessarily.

### Required Events

#### Page and Navigation

- `page_view_custom`
- `navigation_click`
- `footer_link_click`
- `mobile_sticky_bar_click`

#### CTA and Contact

- `hero_cta_click`
- `section_cta_click`
- `project_cta_click`
- `phone_click`
- `whatsapp_click`
- `email_click`
- `directions_click`

#### Forms

- `contact_form_start`
- `contact_form_submit`
- `contact_form_error`
- `project_form_start`
- `project_form_submit`
- `project_form_error`
- `career_form_start`
- `career_form_submit`
- `career_form_error`
- `lead_form_submit`

`lead_form_submit` is the normalized conversion event and must fire after a successful contact or project enquiry submission with the generated non-PII `lead_id`.

#### Project Engagement

- `project_list_view`
- `project_filter_apply`
- `project_card_click`
- `project_detail_view`
- `project_gallery_open`
- `project_pdf_click`

#### News and Gallery

- `news_list_view`
- `news_article_view`
- `news_share_click`
- `gallery_filter_apply`
- `gallery_image_open`

#### Consent

- `cookie_banner_view`
- `cookie_accept_all`
- `cookie_reject_all`
- `cookie_preferences_save`

### Automatic Contact Tracking

Create reusable tracked components for:

- `tel:` links
- WhatsApp links
- `mailto:` links
- map/directions links
- header CTA
- floating contact buttons
- mobile sticky actions

Do not rely on a fragile global DOM click listener when typed React components can provide reliable tracking.

### Attribution Persistence

Capture and persist first-touch and last-touch attribution values:

- UTM source, medium, campaign, term and content
- `gclid`
- `gbraid`
- `wbraid`
- `fbclid`
- `msclkid`
- landing page
- referrer

Use a first-party cookie or localStorage strategy appropriate to consent status. Save permitted attribution values with lead records. Do not overwrite first-touch values on every page. Document retention behavior.

### Tracking Debugging

In development or when `NEXT_PUBLIC_TRACKING_DEBUG=true`:

- log structured tracking events clearly
- provide no production visual debug panel by default
- include a small developer documentation table mapping event names, triggers and GTM usage

---

## 12. SEO Requirements

The site must be technically SEO-ready and completely separate from İttifak.

### Domain Handling

The final Kazanım domain is not confirmed.

- Never hard-code a canonical host.
- Derive canonical URLs from `NEXT_PUBLIC_SITE_URL` only when it is configured.
- Vercel preview deployments must be `noindex, nofollow`.
- Admin, API and authentication routes must be noindex.
- Document the exact production step for setting the final domain and regenerating metadata/sitemap.

### Technical SEO

Implement:

- Next.js `generateMetadata` or equivalent dynamic metadata
- unique Turkish title and meta description for each page
- canonical URLs
- Open Graph metadata
- Twitter metadata
- favicon and web manifest
- dynamic sitemap including published pages, projects, articles and job posts
- robots.txt
- breadcrumb UI and valid `BreadcrumbList` JSON-LD
- `Organization` JSON-LD
- `WebSite` and `WebPage` JSON-LD
- `Article` JSON-LD for news
- `JobPosting` JSON-LD for active jobs where data is complete
- appropriate valid structured data for project pages without inventing schema types or unsupported attributes
- clean slugs
- 301 redirect support where needed
- noindex for draft, hidden or internal content
- meaningful image alt text
- semantic heading hierarchy
- internal links
- correct pagination/indexing behavior if lists become paginated

Do not keyword-stuff. Do not generate doorway pages. Do not create fake location pages.

### Local SEO Settings

Keep these editable and empty until confirmed:

- legal company name
- full address
- map URL
- coordinates
- phone
- email
- business hours
- social profiles

Do not publish guessed contact information.

### Content SEO

Write natural Turkish copy around relevant themes such as:

- gayrimenkul projeleri
- konut projeleri
- ticari projeler
- proje geliştirme
- modern yaşam alanları
- İstanbul gayrimenkul projeleri

Use these naturally and only where supported by the content.

---

## 13. Performance, Accessibility and Responsive Quality

### Performance

- Use `next/image` correctly.
- Prioritize only true above-the-fold hero media.
- Use responsive `sizes`.
- Avoid shipping oversized original images.
- Lazy-load below-the-fold media.
- Avoid heavy animation libraries unless the source already uses one efficiently.
- Use server components where appropriate.
- Minimize client JavaScript.
- Prevent layout shift.
- Optimize fonts with `next/font`.
- Cache public data safely and revalidate after admin updates.
- Do not cache personalized admin data publicly.

Target strong Lighthouse and Core Web Vitals results, but do not claim guaranteed scores.

### Accessibility

- semantic landmarks
- keyboard-operable navigation and dialogs
- visible focus styles
- correct labels and error descriptions
- adequate contrast
- reduced-motion support
- accessible mobile menu
- alt text management
- accessible form success/error announcements
- no interaction available only by hover

### Responsive Behavior

Support at minimum:

- 360px mobile
- modern mobile widths
- tablet
- laptop
- large desktop

The overlapping project finder must stack cleanly on mobile. Project cards, timelines, admin tables and forms must remain usable without horizontal-page overflow.

---

## 14. Security and Reliability

Preserve or improve the source project's security:

- server-side authorization checks
- secure session cookies
- password hashing
- rate limiting for public forms and login
- validated/sanitized input
- safe rich-text handling
- CSRF-aware mutation approach
- upload MIME/type/size validation
- no arbitrary file execution
- no exposed stack traces
- no secrets in client bundles
- no default production password
- audit log for important admin changes if already available or easy to preserve
- admin and auth pages excluded from public analytics
- security headers that do not break GTM, images or required services

Do not deploy with a seeded password unless the administrator credentials are explicitly supplied through environment variables.

---

## 15. Suggested Data Models

Reuse and adapt the proven İttifak models. At minimum support:

- `User`
- `SiteSetting`
- `Page`
- `Project`
- `MediaAsset`
- `GalleryAlbum` if present
- `NewsArticle`
- `Lead`
- `JobPosition`
- `JobApplication`
- `Redirect`
- optional `AuditLog`

Useful project fields:

- title
- slug
- status: ongoing/completed/upcoming/draft
- type
- location
- short description
- full rich content
- cover image
- gallery
- features
- technical details
- delivery period
- progress information
- featured flag
- publish status
- SEO fields

Useful lead attribution fields:

- source page
- landing page
- referrer
- UTM fields
- gclid
- gbraid
- wbraid
- fbclid
- msclkid
- consent state/version

Do not store unnecessary sensitive information.

---

## 16. Media and Image Handling

- Use the Kazanım logo already in the target folder.
- Do not reuse the İttifak logo anywhere.
- Remove inherited logo references from manifests, emails, metadata and admin.
- Do not copy misleading project photos as if they belong to Kazanım.
- Allow admin upload and media selection.
- Save alt text, title and optional caption.
- Generate reasonable thumbnails if the existing storage system supports it.
- Use safe placeholders when approved images are missing.
- Clearly indicate demo assets inside admin.

---

## 17. Testing and Quality Assurance

Before completion, run and fix:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run audit:brand
```

If `test` does not exist, add focused tests rather than an empty passing script.

At minimum verify:

### Public

- all routes render
- navigation links work
- project filters work
- project detail pages work
- news pages work
- gallery works
- forms save valid submissions
- invalid forms show usable errors
- mobile menu works
- floating contact actions work
- no obvious İttifak remnants remain

### Admin

- login/logout
- role protection
- create/edit/delete project
- publish/unpublish project
- manage page sections
- upload/select media
- manage news
- view/update leads
- manage jobs/applications
- edit site and SEO settings

### Tracking

- GTM loads only with a configured ID
- no GTM on admin
- page-view events fire once per route
- phone/WhatsApp/email/directions events fire once
- form-start events fire once
- submit conversion fires only after persistence succeeds
- no PII appears in dataLayer
- consent defaults and updates work
- UTM/click IDs are captured correctly

### SEO

- unique metadata
- no hard-coded İttifak domain
- sitemap contains only published indexable content
- robots excludes admin/API
- preview deployment noindex behavior
- valid canonical behavior after `NEXT_PUBLIC_SITE_URL` is set
- structured data is syntactically valid

---

## 18. Vercel and GitHub Readiness

Prepare the target as an independent project:

- clean Git repository history for Kazanım
- correct package name
- complete `.gitignore`
- no `.env` committed
- no `.vercel` directory copied
- no source-project remote inherited
- no secret values in code or documentation
- Vercel-compatible build command
- migration/deployment notes
- storage notes
- environment variable checklist
- production seed/admin bootstrap instructions

Do not create a custom `vercel.json` unless it is genuinely needed.

Because the final domain is not confirmed, README must explain:

1. deploy as a separate Vercel project
2. configure a separate database and storage
3. add Kazanım environment variables
4. set the final `NEXT_PUBLIC_SITE_URL` after the domain is confirmed
5. configure the custom domain
6. add the final GTM/GA4/Google Ads values later
7. verify sitemap, robots, canonical and consent behavior before launch

---

## 19. Required Documentation

Create or update:

### `README.md`

Include:

- project overview
- local setup
- database setup
- migration and seed commands
- admin bootstrap
- upload/storage setup
- email setup
- environment variables
- GitHub steps
- Vercel deployment
- final-domain setup
- troubleshooting

### `docs/tracking.md`

Include:

- every dataLayer event
- exact trigger
- payload example
- GTM variable recommendations
- GA4 event mapping
- suggested Google Ads conversions
- consent behavior
- QA checklist
- explicit warning not to send PII

### `docs/admin.md`

Include:

- login
- projects
- media
- pages
- news
- leads
- HR
- SEO
- site settings

### `docs/migration-from-ittifak.md`

Record:

- what technical systems were reused
- what was replaced
- how infrastructure was separated
- how the brand audit was performed
- any remaining manual actions

---

## 20. Definition of Done

The work is complete only when:

- the project exists inside `HusynBeyProjeleri/kazanalim`
- the source İttifak project remains untouched
- Kazanım is independent and ready for its own GitHub/Vercel setup
- the Kazanım logo is used correctly
- the public website follows the selected deep emerald/dark navy/warm ivory/champagne-gold design
- the public site is visibly different from İttifak
- all expected public routes exist
- the admin can manage projects, text, images, news, pages, forms, HR, settings and SEO
- content is written specifically for Kazanım
- unsupported claims are not published
- no legacy İttifak branding or credentials remain
- the database/storage/auth configuration is separate
- DataLayer, consent, GTM and GA4 foundations are complete
- Google Ads conversion events are ready to configure through GTM
- no PII is pushed to tracking
- SEO is dynamic and does not hard-code an unconfirmed domain
- lint, typecheck, tests, build and brand audit pass
- documentation is complete

---

## 21. Final Claude Code Response

After implementation, provide a concise but complete report containing:

1. Source project path used.
2. Target path created/updated.
3. Important systems reused.
4. Major Kazanım-specific design changes.
5. Legacy-brand audit result.
6. Database/storage/auth separation status.
7. Public pages completed.
8. Admin modules completed.
9. Tracking and consent events implemented.
10. SEO features implemented.
11. Commands executed and results.
12. Environment variables still required.
13. Manual steps remaining for GitHub, Vercel, domain, GTM, GA4 and Google Ads.
14. Any assumptions or limitations.

Do not report a feature as complete unless it is actually implemented and tested.
