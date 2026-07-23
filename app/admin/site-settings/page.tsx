import { AdminCard, PageHeader } from "@/components/admin/AdminUI";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings, SETTING_GROUPS, SETTING_LABELS } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  let settings: Record<string, string> = {};
  try {
    settings = await getSettings();
  } catch (error) {
    console.error("[admin/site-settings] load failed:", error);
  }

  return (
    <div>
      <PageHeader
        title="Site Ayarları"
        description="Firma bilgileri, iletişim, sosyal medya ve ana sayfa içeriklerini yönetin."
      />
      <AdminCard>
        <SettingsForm groups={SETTING_GROUPS} settings={settings} labels={SETTING_LABELS} />
      </AdminCard>
    </div>
  );
}
