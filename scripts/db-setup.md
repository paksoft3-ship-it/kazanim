# Veritabanı Kurulumu (Neon + Prisma)

Bu proje **PostgreSQL** kullanır. Vercel'in **Neon** entegrasyonu `DATABASE_URL`
değişkenini otomatik enjekte eder. Lokal geliştirme ve ilk kurulum için:

## 1. Bağlantı dizesini ayarlayın

`.env.local` (veya `.env`) dosyasına Neon bağlantı dizenizi ekleyin:

```env
DATABASE_URL="postgresql://kullanici:sifre@ep-xxx.eu-central-1.aws.neon.tech/kazanim?sslmode=require"
AUTH_SECRET="<openssl rand -base64 32 ile üretin>"
ADMIN_EMAIL="admin@kazanimornek.dev"
ADMIN_PASSWORD="GucluBirSifre123!"
```

Vercel projesi zaten bağlıysa:

```bash
vercel env pull .env.local
```

## 2. Şemayı uygulayın ve seed'leyin (tek seferlik)

```bash
npx prisma migrate deploy   # prisma/migrations/0_init/ içindeki baseline'ı uygular
npm run db:seed             # Türkçe başlangıç içeriği + yönetici kullanıcı
```

Alternatif (geliştirmede, migration geçmişi tutmadan):

```bash
npm run db:push && npm run db:seed
```

## 3. Doğrulama

```bash
npm run db:studio           # Prisma Studio ile verileri görüntüleyin
npm run dev                 # http://localhost:3000
```

Yönetim paneli: `http://localhost:3000/admin/login`
(ADMIN_EMAIL / ADMIN_PASSWORD ile giriş yapın — **ilk girişten sonra şifreyi değiştirin**).

## Vercel'de dağıtım

`package.json` içindeki `build` script'i `prisma generate` çalıştırır.
Migration'ları prod'da uygulamak için Vercel build komutunu şu şekilde ayarlayın
veya bir kez elle çalıştırın:

```bash
prisma migrate deploy && next build
```

Seed'i prod'da bir kez çalıştırmak için (opsiyonel):

```bash
npm run db:seed
```
