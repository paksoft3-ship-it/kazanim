# Kazanım Gayrimenkul — Kurumsal Web Sitesi

Kazanım Gayrimenkul'ün kurumsal web sitesi ve yönetim paneli. Next.js 15 (App
Router), Prisma + PostgreSQL, Tailwind CSS ve tam kapsamlı bir dataLayer/GTM
altyapısıyla geliştirilmiştir. Site dili Türkçedir.

## Özellikler

- **Kamuya açık site** — premium koyu zümrüt/lacivert + şampanya altını tasarım
  sistemi; ana sayfa (hero + proje arama paneli + bölümler), kurumsal sayfalar,
  proje listeleme/detay, galeri, haberler, insan kaynakları, iletişim ve yasal
  sayfalar.
- **Yönetim paneli** (`/admin`) — projeler, sayfa içerikleri, galeri, haberler,
  form talepleri (lead'ler), İK pozisyonları/başvuruları, site ayarları, SEO
  ayarları ve kullanıcı yönetimi. Rol bazlı yetkilendirme sunucu tarafında
  uygulanır.
- **Formlar** — iletişim, proje bilgi talebi ve kariyer başvurusu (CV yükleme);
  Zod doğrulaması, honeypot, IP bazlı rate limit, UTM/click-ID atıf yakalama.
- **Tracking** — `window.dataLayer` tabanlı olay altyapısı, Consent Mode v2
  varsayılanları, Türkçe çerez bandı. Google Ads dönüşümleri koda gömülmez;
  GTM üzerinden eşlenir. Ayrıntılar: [`docs/tracking.md`](docs/tracking.md).
- **SEO** — dinamik metadata, canonical, Open Graph, JSON-LD (Organization,
  WebSite, BreadcrumbList, Article, JobPosting, Place), dinamik sitemap,
  robots.txt, `llms.txt`. Üretim alan adı yapılandırılana kadar tüm dağıtımlar
  `noindex` kalır.

## Yerel Kurulum

Gereksinimler: Node.js 20+, npm, PostgreSQL (yerel için Docker önerilir).

```bash
# 1. Bağımlılıklar
npm install

# 2. Ortam değişkenleri
cp .env.example .env
# .env içinde en az DATABASE_URL ve AUTH_SECRET doldurun:
#   AUTH_SECRET → openssl rand -base64 32

# 3. Yerel veritabanı (Docker)
docker compose up -d
# .env → DATABASE_URL=postgresql://kazanim:kazanim_dev@localhost:5433/kazanim

# 4. Şema + başlangıç içeriği
npm run db:deploy   # prisma/migrations uygular
npm run db:seed     # ayarlar, sayfalar, yönetici + (geliştirmede) demo içerik

# 5. Geliştirme sunucusu
npm run dev
```

Yönetim paneli: `http://localhost:3000/admin`

- Geliştirmede seed, `ADMIN_EMAIL`/`ADMIN_PASSWORD` tanımlı değilse
  `admin@kazanim.local` / `KazanimDev123!` hesabını oluşturur (yalnızca yerel).
- Üretimde bu env değişkenleri tanımlı olmadan **hiçbir yönetici hesabı
  oluşturulmaz**.

### Demo içerik

Geliştirme ortamında seed; örnek projeler (Kazanım Vadi, Kazanım Bosphorus,
Kazanım Cadde, …), örnek haberler, galeri görselleri ve pozisyonlar oluşturur.
Bunlar **örnek kayıtlardır** — yönetim paneli ana sayfasında uyarı bandı ile
işaretlenir. Üretim dağıtımında (`VERCEL_ENV=production`) demo içerik
seed'lenmez; zorlamak için `SEED_DEMO_CONTENT=true` gerekir.

## Komutlar

| Komut                 | Açıklama                                            |
| --------------------- | --------------------------------------------------- |
| `npm run dev`         | Geliştirme sunucusu                                 |
| `npm run build`       | Üretim build (önce `prisma generate` çalışır)       |
| `npm run lint`        | ESLint                                              |
| `npm run typecheck`   | TypeScript kontrolü                                 |
| `npm run test`        | Birim testleri (node:test + tsx)                    |
| `npm run audit:brand` | Eski marka kalıntısı taraması                       |
| `npm run db:migrate`  | Geliştirmede migration oluştur/uygula               |
| `npm run db:deploy`   | Migration'ları uygula (üretim)                      |
| `npm run db:seed`     | Seed verisi                                         |
| `npm run db:studio`   | Prisma Studio                                       |

## Ortam Değişkenleri

Tam liste ve açıklamalar için [`.env.example`](.env.example) dosyasına bakın.
Kritik olanlar:

| Değişken               | Zorunlu | Not                                                       |
| ---------------------- | ------- | --------------------------------------------------------- |
| `DATABASE_URL`         | Evet    | **Yeni** bir Kazanım veritabanı. Başka projeninkini asla kullanmayın. |
| `AUTH_SECRET`          | Evet    | `openssl rand -base64 32`                                  |
| `ADMIN_EMAIL/PASSWORD` | Üretimde | Üretim seed'i yönetici hesabını yalnızca bunlardan oluşturur. |
| `NEXT_PUBLIC_SITE_URL` | Yayında | Alan adı kesinleşince ayarlanır; boşken site `noindex` kalır. |
| `BLOB_READ_WRITE_TOKEN`| Hayır   | Boşken yüklemeler `public/uploads`'a düşer (yalnızca geliştirme). |
| `NEXT_PUBLIC_GTM_ID`   | Hayır   | Kazanım'a ait **yeni** GTM container ID.                   |
| `SMTP_*`               | Hayır   | Boşken e-posta bildirimi atlanır; lead kaydı etkilenmez.   |

## GitHub

Proje, temiz geçmişe sahip bağımsız bir depo olarak tasarlanmıştır:

```bash
git init
git add -A
git commit -m "Kazanım Gayrimenkul — ilk sürüm"
git remote add origin git@github.com:<hesap>/kazanim-gayrimenkul.git
git push -u origin main
```

`.env` dosyaları ve `public/uploads` gitignore'dadır; hiçbir gizli değer
commit'lenmez.

## Vercel Dağıtımı

1. **Ayrı bir Vercel projesi** oluşturun ve GitHub deposunu bağlayın
   (build komutu varsayılan `npm run build`; `vercel.json` gerekmez).
2. **Ayrı veritabanı**: Vercel'de Neon (veya başka Postgres) entegrasyonunu bu
   projeye bağlayın — `DATABASE_URL` otomatik enjekte edilir. İlk dağıtımdan
   sonra bir kez `npx prisma migrate deploy` çalıştırın
   (`vercel env pull` sonrası yerelden veya CI adımıyla).
3. **Ayrı depolama**: Vercel Blob store oluşturup `BLOB_READ_WRITE_TOKEN`
   ekleyin.
4. **Ortam değişkenleri**: `.env.example` içindeki listeyi Vercel'e girin.
   `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` üretim için zorunludur.
   Üretim seed'i (yalnızca ayarlar + sayfalar + yönetici):
   `npm run db:seed` (demo içerik üretimde otomatik atlanır).
5. **Alan adı kesinleşince**: alan adını Vercel projesine ekleyin,
   `NEXT_PUBLIC_SITE_URL=https://www.<alanadi>` değişkenini girin ve yeniden
   deploy edin. Bu adım; canonical URL'leri, sitemap'i, robots.txt'yi ve
   `noindex` durumunu otomatik olarak üretime çevirir.
6. **GTM / GA4 / Google Ads**: Kazanım'a ait yeni container/property açın,
   `NEXT_PUBLIC_GTM_ID` ve `NEXT_PUBLIC_GA4_ID` değerlerini girin. Olay → GA4 /
   Ads dönüşüm eşlemesi için [`docs/tracking.md`](docs/tracking.md).
7. **Yayın öncesi kontrol**: `/{sitemap.xml,robots.txt}` çıktıları, canonical
   davranışı, çerez bandı/Consent Mode ve yönetim panelindeki demo içerik
   uyarısının kapatılmış olduğunu doğrulayın. Yasal metinler hukuk kontrolünden
   geçmelidir.

## Dokümantasyon

- [`docs/tracking.md`](docs/tracking.md) — dataLayer olayları, GTM/GA4/Ads eşleme, rıza davranışı, QA listesi
- [`docs/admin.md`](docs/admin.md) — yönetim paneli kullanım rehberi
- [`docs/migration-from-ittifak.md`](docs/migration-from-ittifak.md) — teknik temelin nereden geldiği ve nasıl bağımsızlaştırıldığı
- [`scripts/db-setup.md`](scripts/db-setup.md) — veritabanı kurulum notları

## Sorun Giderme

- **`AUTH_SECRET is missing`** — `.env` içinde `AUTH_SECRET` tanımlayın.
- **Build sırasında veritabanı hatası görünmüyor ama sayfalar boş** — içerik
  yardımcıları veritabanına ulaşamayınca boş liste döndürür; `DATABASE_URL` ve
  migration durumunu kontrol edin.
- **Yüklemeler çalışmıyor** — yerelde `public/uploads` yazılabilir olmalı;
  üretimde `BLOB_READ_WRITE_TOKEN` gerekli.
- **Site Google'da görünmüyor** — `NEXT_PUBLIC_SITE_URL` ayarlanmadan tüm
  dağıtımlar bilinçli olarak `noindex`tir.
