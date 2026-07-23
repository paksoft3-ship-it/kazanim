import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Icon } from "@/components/public/Icon";
import { Logo } from "@/components/public/Logo";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Yönetim Paneli Girişi",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in — skip the form.
  const session = await getSession();
  if (session) redirect("/admin");

  const { next } = await searchParams;
  const settings = await getSettings();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-midnight-navy p-12 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden
          className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-forest-emerald/10 blur-3xl"
        />

        <Logo
          src={settings.logoPath}
          companyName={settings.companyName}
          href="/"
          onDark
          className="relative z-10 h-14"
        />

        <div className="relative z-10 max-w-md">
          <h2 className="font-serif text-4xl leading-tight text-white">
            Güvenli Yönetim Paneli
          </h2>
          <p className="mt-5 text-body-md leading-relaxed text-white/70">
            Web sitenizin projelerini, haberlerini, galerisini, form taleplerini ve SEO
            ayarlarını tek bir yerden yönetin.
          </p>
          <ul className="mt-8 space-y-3 text-body-sm text-white/60">
            {[
              "Şifreler güvenli şekilde saklanır",
              "Oturumlar HTTP-only çerezlerle korunur",
              "Yönetim sayfaları arama motorlarına kapalıdır",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Icon name="check-circle" className="h-5 w-5 shrink-0 text-forest-emerald" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-[12px] uppercase tracking-[0.15em] text-white/30">
          © {new Date().getFullYear()} {settings.companyName}
        </p>
      </div>

      {/* Right: login card */}
      <div className="flex items-center justify-center bg-admin-bg p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo src={settings.logoPath} companyName={settings.companyName} href="/" className="h-14" />
          </div>

          <div className="border border-warm-border bg-white p-8 shadow-sm">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-charcoal">Yönetim Paneli Girişi</h1>
              <p className="mt-2 text-body-sm text-slate">
                Devam etmek için hesap bilgilerinizi girin.
              </p>
            </div>

            <LoginForm next={next} />
          </div>

          <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-slate">
            <Icon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
            Bu alan yalnızca yetkili kullanıcılar içindir. Giriş denemeleri kayıt altına alınır.
          </p>
        </div>
      </div>
    </div>
  );
}
