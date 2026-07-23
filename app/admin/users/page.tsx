import Link from "next/link";

import { deleteUserAction } from "@/app/admin/_actions/operations";
import {
  AdminCard,
  AdminTable,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { UserForm, type EditableUser } from "@/components/admin/UserForm";
import { Icon } from "@/components/public/Icon";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { USER_ROLE_LABELS } from "@/lib/navigation";
import { cn, formatDateShortTR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const editId = typeof sp.edit === "string" ? sp.edit : "";

  let users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt: Date | null;
  }> = [];
  let editing: EditableUser | undefined;
  let currentUserId = "";

  try {
    const [rows, session] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true },
      }),
      getSession(),
    ]);
    users = rows;
    currentUserId = session?.id ?? "";
    const target = rows.find((u) => u.id === editId);
    if (target) {
      editing = {
        id: target.id,
        name: target.name,
        email: target.email,
        role: target.role,
        isActive: target.isActive,
      };
    }
  } catch (error) {
    console.error("[admin/users] load failed:", error);
  }

  const activeCount = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "ADMIN").length;

  return (
    <div>
      <PageHeader
        title="Kullanıcılar ve Yetki Yönetimi"
        description="Yönetim paneli kullanıcılarını, rollerini ve erişim durumlarını yönetin."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Toplam Kullanıcı" value={users.length} icon="users" tone="navy" />
        <StatCard label="Aktif" value={activeCount} icon="check-circle" tone="green" />
        <StatCard label="Yönetici" value={adminCount} icon="shield" tone="gold" />
        <StatCard label="Rol Sayısı" value={Object.keys(USER_ROLE_LABELS).length} icon="badge" tone="cyan" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminCard title="Kullanıcılar" padded={false}>
          {users.length === 0 ? (
            <div className="p-6">
              <EmptyState icon="users" title="Kullanıcı yok" description="Sağdaki formu kullanarak ilk kullanıcıyı ekleyin." />
            </div>
          ) : (
            <AdminTable headers={["Kullanıcı", "Rol", "Durum", "Son Giriş", "İşlemler"]}>
              {users.map((u) => (
                <tr key={u.id} className={cn(u.id === editId && "bg-forest-emerald/5")}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">
                      {u.name}
                      {u.id === currentUserId ? (
                        <span className="ml-2 text-[11px] font-normal text-slate">(siz)</span>
                      ) : null}
                    </p>
                    <p className="text-[12px] text-slate">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate">{USER_ROLE_LABELS[u.role] ?? u.role}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.isActive ? "DONE" : "ARCHIVED"} label={u.isActive ? "Aktif" : "Pasif"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate">
                    {u.lastLoginAt ? formatDateShortTR(u.lastLoginAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/users?edit=${u.id}`}
                        className="inline-flex items-center gap-1 text-body-sm font-semibold text-forest-emerald hover:underline"
                      >
                        <Icon name="edit" className="h-4 w-4" />
                        Düzenle
                      </Link>
                      {u.id === currentUserId ? null : (
                        <ConfirmDelete action={deleteUserAction} id={u.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>

        <AdminCard title={editing ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı"}>
          <UserForm user={editing} />
        </AdminCard>
      </div>
    </div>
  );
}
