# Kazanım Gayrimenkul — Yönetim Paneli Rehberi

Panel adresi: `/admin` — giriş: `/admin/login`

## Giriş ve Roller

- Giriş e-posta + şifre iledir; oturum 8 saatlik HTTP-only çerezle tutulur.
- Roller: `SUPER_ADMIN`, `ADMIN`, `EDITOR` (içerik yazabilir), `SALES`, `HR`,
  `VIEWER` (salt okunur). Yetkiler sunucu tarafında da denetlenir; buton
  gizlemek tek başına güvenlik sağlamaz.
- Kullanıcı yönetimi (`/admin/users`) yalnızca `SUPER_ADMIN`/`ADMIN` içindir.
- Pasifleştirilen kullanıcı bir sonraki istekte oturum kaybeder.

## Genel Bakış (`/admin`)

Özet sayılar, son form talepleri ve son güncellenen projeler. **Demo içerik
uyarısı**: seed'lenen örnek kayıtlar dururken turuncu bir bant görünür. Gerçek
içerik girildikten sonra Site Ayarları'ndaki `demoContentSeeded` değerini
`false` yapın.

## Projeler (`/admin/projects`)

- **Yeni proje**: başlık, slug (otomatik önerilir), durum
  (Devam Eden / Tamamlanan / Yakında), yayın durumu (Yayında / Taslak / Gizli),
  tür, lokasyon, kısa açıklama, detay metni, kapak görseli, galeri, genel
  ilerleme yüzdesi + kalem bazlı ilerlemeler, özellikler, teknik detaylar,
  dokümanlar, teslim tarihi, öne çıkarma ve sıralama.
- **Teslim tarihi** ana sayfadaki proje arama panelinin "Teslim Dönemi"
  filtresini besler; **lokasyon** ve **tür** de aynı panelin seçeneklerini
  oluşturur — tutarlı yazın (örn. hep "Sarıyer, İstanbul" biçiminde).
- SEO bölümü: başlık, açıklama, OG görseli, canonical, robots.
- Taslak/Gizli projeler sitede ve sitemap'te görünmez.

## Sayfalar (`/admin/pages`)

Kurumsal sayfalar (Hakkımızda, Tarihçe, Vizyon-Misyon, Kalite, Faaliyet
Alanları), İK, İletişim ve yasal metinler yapılandırılmış JSON içerikle
düzenlenir. Her sayfada hero başlık/alt başlık/görsel + SEO alanları vardır.
Yasal sayfalardaki taslak metinler **hukuk kontrolünden geçmeden** nihai kabul
edilmemelidir (yalnızca panelde görünen bir nottur, sitede gösterilmez).

## Galeri (`/admin/gallery`)

Görsel yükleme (tür/boyut doğrulanır), başlık, **alt metin** (erişilebilirlik
ve SEO için doldurun), kategori (dış cephe, iç mekân, sosyal alanlar, şantiye,
kat planları) ve proje ilişkilendirme.

## Haberler (`/admin/news`)

Başlık, slug, özet, içerik, kapak görseli, kategori, ilgili proje, yayın tarihi
ve durumu + SEO alanları. Yayında olmayan haber sitede görünmez.

## Form Talepleri (`/admin/forms`)

İletişim ve proje bilgi talepleri (lead'ler): durum akışı
(Yeni → Okundu → İşlemde → Tamamlandı → Arşiv), iç notlar, kaynak sayfa ve
kampanya atıf bilgileri (UTM, gclid/gbraid/wbraid/fbclid/msclkid, açılış
sayfası, referrer). CSV dışa aktarma listede mevcuttur.

## İnsan Kaynakları (`/admin/hr`)

Açık pozisyonlar (başlık, departman, lokasyon, tür, açıklama, gereksinimler,
sorumluluklar, yayın durumu) ve gelen başvurular (CV indirme, durum akışı,
iç notlar).

## Site Ayarları (`/admin/site-settings`)

- **Genel**: firma adı, resmi unvan, footer açıklaması
- **Logo ve Marka**: logo/favicon yolları
- **İletişim**: telefon, WhatsApp, e-posta, adres, harita, çalışma saatleri —
  boş bırakılan alanlar sitede **gösterilmez** (resmî bilgiler kesinleşmeden
  doldurmayın)
- **Sosyal Medya**: boş bırakılan profil ikonu görünmez
- **Yüzen Butonlar**: WhatsApp / Ara / Yol Tarifi / Form açma-kapama
- **Ana Sayfa — Hero**: eyebrow, başlık, açıklama, görsel, buton metin/linkleri,
  proje arama paneli görünürlüğü
- **Ana Sayfa — İstatistikler**: `statsVisible` **varsayılan kapalıdır**;
  değerler yönetim onayından geçmeden açmayın (doğrulanmamış iddia
  yayımlamamak için)
- **Ana Sayfa — Bölümler**: her bölümün başlık/metin/görünürlüğü ve
  `homeSectionOrder` ile bölüm sıralaması
  (virgülle: `about,featured,services,trust,process,news,leadform`)

## SEO Ayarları (`/admin/seo`)

Varsayılan başlık/açıklama/OG görseli, Google Search Console doğrulama kodu ve
GTM/GA4/Pixel ID'leri (env değişkeni doluysa env kazanır).

## Medya Yükleme Notları

- İzin verilen türler ve boyut sınırı sunucuda doğrulanır; dosya adları
  güvenli üretilir.
- `BLOB_READ_WRITE_TOKEN` tanımlıysa Vercel Blob'a, değilse (yalnızca yerel)
  `public/uploads`'a yazılır.
