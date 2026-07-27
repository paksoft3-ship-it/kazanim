import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Kazanım Gayrimenkul",
  // Belt-and-braces alongside the X-Robots-Tag header in next.config.mjs.
  robots: { index: false, follow: false },
};

/**
 * Admin shell.
 *
 * Note: no GTM/analytics is mounted here — tracking is public-only, per the
 * privacy and performance requirements in the brief.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // The login page renders through this layout too, so bail out to a bare
  // shell when signed out rather than redirecting (middleware handles that).
  if (!session) {
    return <div className="min-h-screen bg-admin-bg">{children}</div>;
  }

  // Authoritative check: the JWT may still be valid for a deactivated user.
  const user = await prisma.user
    .findUnique({
      where: { id: session.id },
      select: { name: true, email: true, role: true, isActive: true },
    })
    .catch(() => null);

  if (!user || !user.isActive) {
    redirect("/admin/login");
  }

  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-admin-bg">
      <AdminSidebar
        companyName={settings.companyName}
        logoPath={settings.logoPath}
        logoLightPath={settings.logoLightPath}
        user={{ name: user.name, email: user.email, role: user.role }}
      />
      <div className="lg:pl-64">
        <main className="mx-auto max-w-[1400px] p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
