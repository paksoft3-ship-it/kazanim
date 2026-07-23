"use server";

import { revalidatePath } from "next/cache";

import { hashPassword, requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SETTING_DEFAULTS } from "@/lib/settings";
import {
  applicationUpdateSchema,
  leadUpdateSchema,
  userSchema,
} from "@/lib/validators";
import {
  checkbox,
  fail,
  formToObject,
  guard,
  nullify,
  ok,
  toFieldErrors,
  type ActionState,
} from "./shared";

// ─── Leads ───────────────────────────────────────────────────────────────────

export async function updateLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz kayıt.");

  const parsed = leadUpdateSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return fail("Güncelleme geçersiz.", toFieldErrors(parsed.error));
  }

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.internalNotes !== undefined
          ? { internalNotes: nullify(parsed.data.internalNotes) }
          : {}),
      },
    });
  } catch (error) {
    console.error("[admin] updateLead failed:", error);
    return fail("Kayıt güncellenemedi.");
  }

  revalidatePath("/admin/forms");
  revalidatePath("/admin");
  return ok("Form talebi güncellendi.");
}

export async function deleteLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz kayıt.");

  try {
    await prisma.lead.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteLead failed:", error);
    return fail("Kayıt silinemedi.");
  }

  revalidatePath("/admin/forms");
  revalidatePath("/admin");
  return ok("Form talebi silindi.");
}

// ─── Job applications ────────────────────────────────────────────────────────

export async function updateApplicationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz başvuru.");

  const parsed = applicationUpdateSchema.safeParse(formToObject(formData));
  if (!parsed.success) {
    return fail("Güncelleme geçersiz.", toFieldErrors(parsed.error));
  }

  try {
    await prisma.jobApplication.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.internalNotes !== undefined
          ? { internalNotes: nullify(parsed.data.internalNotes) }
          : {}),
      },
    });
  } catch (error) {
    console.error("[admin] updateApplication failed:", error);
    return fail("Başvuru güncellenemedi.");
  }

  revalidatePath("/admin/hr");
  revalidatePath("/admin");
  return ok("Başvuru güncellendi.");
}

export async function deleteApplicationAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz başvuru.");

  try {
    await prisma.jobApplication.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteApplication failed:", error);
    return fail("Başvuru silinemedi.");
  }

  revalidatePath("/admin/hr");
  return ok("Başvuru silindi.");
}

// ─── Site settings ───────────────────────────────────────────────────────────

const VALID_SETTING_KEYS = new Set(Object.keys(SETTING_DEFAULTS));

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard();
  if (!auth.ok) return auth.state;

  /**
   * Boolean settings are rendered as checkboxes, which are simply absent from
   * FormData when unticked — so "not present" is indistinguishable from "not
   * on this tab". The form therefore declares which boolean keys it manages
   * via a hidden `__booleans` field, and we resolve exactly those to
   * "true"/"false". Everything else is taken at face value.
   */
  const declaredBooleans = new Set(
    String(formData.get("__booleans") ?? "")
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean),
  );

  // Only persist keys we actually define — a crafted form post cannot inject
  // arbitrary settings rows.
  const updates: Array<{ key: string; value: string }> = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    if (!VALID_SETTING_KEYS.has(key)) continue;
    if (declaredBooleans.has(key)) continue; // handled below
    updates.push({ key, value: String(value) });
  }

  for (const key of declaredBooleans) {
    if (!VALID_SETTING_KEYS.has(key)) continue;
    updates.push({ key, value: checkbox(formData, key) ? "true" : "false" });
  }

  if (updates.length === 0) {
    return fail("Kaydedilecek bir değişiklik bulunamadı.");
  }

  try {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.siteSetting.upsert({
          where: { key: update.key },
          update: { value: update.value },
          create: { key: update.key, value: update.value, group: "general" },
        }),
      ),
    );
  } catch (error) {
    console.error("[admin] saveSettings failed:", error);
    return fail("Ayarlar kaydedilemedi.");
  }

  // Settings feed the layout, so refresh the whole public tree.
  revalidatePath("/", "layout");
  revalidatePath("/admin/site-settings");
  revalidatePath("/admin/seo");
  return ok("Ayarlar kaydedildi.");
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function saveUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard("users");
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));

  const parsed = userSchema.safeParse({
    ...formToObject(formData),
    isActive: checkbox(formData, "isActive"),
  });
  if (!parsed.success) {
    return fail("Lütfen formdaki hatalı alanları düzeltin.", toFieldErrors(parsed.error));
  }

  const d = parsed.data;
  const email = d.email.toLowerCase();

  // A new user must have a password; on edit it is optional (blank = unchanged).
  if (!id && !d.password) {
    return fail("Yeni kullanıcı için şifre zorunludur.", {
      password: "Şifre zorunludur.",
    });
  }

  try {
    const clash = await prisma.user.findFirst({
      where: { email, ...(id ? { NOT: { id } } : {}) },
      select: { id: true },
    });
    if (clash) {
      return fail("Bu e-posta adresi zaten kayıtlı.", {
        email: "Bu e-posta adresi kullanımda.",
      });
    }

    // Never let an admin lock everyone out by demoting/deactivating the
    // last remaining active SUPER_ADMIN.
    if (id) {
      const target = await prisma.user.findUnique({
        where: { id },
        select: { role: true, isActive: true },
      });
      if (target?.role === "SUPER_ADMIN" && target.isActive) {
        const losingSuperAdmin = d.role !== "SUPER_ADMIN" || d.isActive === false;
        if (losingSuperAdmin) {
          const activeSuperAdmins = await prisma.user.count({
            where: { role: "SUPER_ADMIN", isActive: true },
          });
          if (activeSuperAdmins <= 1) {
            return fail(
              "Sistemdeki son aktif süper yönetici pasifleştirilemez veya yetkisi düşürülemez.",
            );
          }
        }
      }
    }

    const data = {
      name: d.name,
      email,
      role: d.role,
      isActive: d.isActive ?? true,
      ...(d.password ? { passwordHash: await hashPassword(d.password) } : {}),
    };

    if (id) {
      await prisma.user.update({ where: { id }, data });
    } else {
      await prisma.user.create({
        data: { ...data, passwordHash: await hashPassword(d.password as string) },
      });
    }
  } catch (error) {
    console.error("[admin] saveUser failed:", error);
    return fail("Kullanıcı kaydedilemedi.");
  }

  revalidatePath("/admin/users");
  return ok(id ? "Kullanıcı güncellendi." : "Kullanıcı oluşturuldu.");
}

export async function deleteUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const auth = await guard("users");
  if (!auth.ok) return auth.state;

  const id = nullify(formData.get("id"));
  if (!id) return fail("Geçersiz kullanıcı.");

  try {
    const session = await requireSession();
    if (session.id === id) {
      return fail("Kendi hesabınızı silemezsiniz.");
    }

    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true, isActive: true },
    });
    if (target?.role === "SUPER_ADMIN" && target.isActive) {
      const activeSuperAdmins = await prisma.user.count({
        where: { role: "SUPER_ADMIN", isActive: true },
      });
      if (activeSuperAdmins <= 1) {
        return fail("Sistemdeki son aktif süper yönetici silinemez.");
      }
    }

    await prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] deleteUser failed:", error);
    return fail("Kullanıcı silinemedi.");
  }

  revalidatePath("/admin/users");
  return ok("Kullanıcı silindi.");
}
