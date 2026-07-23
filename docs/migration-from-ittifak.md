# Kazanım Gayrimenkul — İttifak Temelinden Bağımsızlaştırma Kaydı

Bu belge, Kazanım projesinin yerel İttifak İnşaat projesini teknik temel olarak
kullanarak nasıl oluşturulduğunu ve nasıl bağımsızlaştırıldığını kayıt altına
alır. Eski markaya referans içermesine izin verilen **tek** dosyadır
(`npm run audit:brand` bu dosyayı bilinçli olarak atlar).

## Kaynak ve Hedef

- Kaynak: `HusynBeyProjeleri/ittifak` (yalnızca okundu, hiçbir dosyası
  değiştirilmedi)
- Hedef: `HusynBeyProjeleri/kazanalim`

## Yeniden Kullanılan Teknik Sistemler

- Next.js 15 App Router yapısı, route organizasyonu (public/admin ayrımı)
- Prisma şeması ve `0_init` migration (Lead modeline atıf sütunları eklendi)
- Auth katmanı (jose JWT + bcrypt, sunucu tarafı rol denetimi) — çerez adı
  `kazanim_session` olarak değiştirildi, **yeni `AUTH_SECRET` zorunlu**
- Form altyapısı (Zod doğrulama, honeypot, rate limit, CV yükleme)
- Depolama soyutlaması (Vercel Blob / yerel uploads fallback)
- SEO altyapısı (buildMetadata, JSON-LD üreticileri, sitemap, robots, llms.txt)
- Tracking altyapısı (dataLayer yardımcıları, GTMProvider, Consent Mode, çerez
  bandı) — genişletildi (aşağıda)
- Admin panel bileşenleri ve CRUD aksiyonları
- Placeholder SVG üretici script'i (Kazanım paletiyle yeniden parametrelendi)

## Değiştirilen / Yeniden Yazılanlar

- **Tasarım sistemi**: Tailwind paleti tamamen değişti — lacivert/cyan yerine
  koyu zümrüt (#063E36/#0B5145) + koyu lacivert (#071D2B/#061824) + şampanya
  altını (#C7A45B/#E3D0A4). Cyan tamamen kaldırıldı.
- **Ana sayfa**: yeni kompozisyon — sinematik hero (altın vurgulu başlık),
  hero'ya bindirmeli **proje arama paneli** (gerçek `/projeler` filtrelerine
  bağlı), hakkımızda + gizlenebilir istatistikler, koyu zümrüt öne çıkan
  projeler, hizmetler (6 kart), güven şeridi (5 madde), süreç zaman çizelgesi
  (5 adım), koyu haber bölümü, lead form bölümü. Bölüm sırası/görünürlüğü
  admin'den yönetilir (`homeSectionOrder`).
- **İçerik**: tüm sayfa metinleri, seed projeleri (Kazanım Vadi, Bosphorus,
  Cadde, Residence, İş Merkezi, Yaşam Evleri), haberler, pozisyonlar ve yasal
  taslaklar Kazanım için yeniden yazıldı. Demo kayıtlar panelde işaretlenir ve
  üretim seed'inde atlanır.
- **Tracking genişletmeleri**: `site_id`, `event_id`, `gbraid/wbraid/msclkid`,
  first-touch + last-touch atıf, `landing_page`/`referrer` yakalama, rızaya
  duyarlı saklama, debug logu. (Ayrıca kaynaktan gelen bir hata düzeltildi:
  atıf anahtarları snake_case gönderilip camelCase şemayla ayrıştırıldığından
  UTM değerleri lead kaydına hiç yazılmıyordu.)
- **Lead modeli**: `landingPage`, `referrer`, `gbraid`, `wbraid`, `msclkid`
  sütunları eklendi.
- **SEO**: hard-coded alan adı kaldırıldı; `NEXT_PUBLIC_SITE_URL` yokken veya
  preview ortamında tüm sayfalar `noindex` + robots tam engelleme.

## Altyapı Ayrımı

| Bileşen | Durum |
| --- | --- |
| Veritabanı | Yeni `DATABASE_URL` zorunlu; İttifak verisi/dosyası kopyalanmadı; yerel için `docker-compose.yml` (port 5433) eklendi |
| Depolama | Yeni `BLOB_READ_WRITE_TOKEN` gerekli; hiçbir yüklenmiş dosya kopyalanmadı |
| Auth | Yeni `AUTH_SECRET`; kullanıcı/şifre hash'i kopyalanmadı; üretimde env'siz yönetici oluşturulmaz |
| Analitik | GTM/GA4/Pixel ID'leri boş; Kazanım'a ait yeni ID'ler girilecek |
| E-posta | Yeni SMTP değerleri; boşken bildirim atlanır |
| Git/Vercel | `.git`, `.vercel`, `.env` kopyalanmadı; temiz depo olarak başlatılır |
| Çerez/storage anahtarları | `kazanim_session`, `kazanim_cookie_consent`, `kazanim_consent`, `kazanim_attribution_*` |

## Kopyalanmayanlar

`.git`, `.vercel`, `.next`, `node_modules`, `.env`, İttifak logo/görselleri,
İttifak tasarım dokümanları (`ittifak_design.md`, stitch prompt'ları,
`WholeProject/`), yüklenmiş kullanıcı dosyaları, `tsconfig.tsbuildinfo`.

## Marka Denetimi

`npm run audit:brand` → `scripts/audit-brand.mjs`; `app/ components/ lib/
prisma/ scripts/ public/ tests/ docs/` + kök konfigürasyon dosyalarında
`ittifak/İttifak/İTTİFAK` desenlerini tarar, bulursa çıkış kodu 1 ile düşer.
Bu dosya ve audit script'inin kendisi izin listesindedir.

## Kalan Manuel Adımlar

1. GitHub deposu oluşturup ilk commit/push (README'deki adımlar).
2. Ayrı Vercel projesi + Neon/Postgres + Blob store + env değişkenleri.
3. Alan adı kesinleşince `NEXT_PUBLIC_SITE_URL` + domain bağlama.
4. Kazanım'a ait GTM container + GA4 property + (sonra) Google Ads bağlantısı.
5. Resmî iletişim bilgileri ve istatistiklerin panelden girilip onaylanması.
6. Yasal metinlerin hukuk kontrolü.
7. Gerçek proje görselleri/içeriği girilip demo kayıtların kaldırılması.
