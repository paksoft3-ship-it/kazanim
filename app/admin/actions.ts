"use server";

import { redirect } from "next/navigation";

import {
  createSession,
  destroySession,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validators";

export type LoginState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Admin sign-in.
 *
 * Deliberately returns one generic message for "no such user", "wrong
 * password" and "deactivated account" so the form cannot be used to
 * enumerate valid admin e-mail addresses.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors, error: "Lütfen e-posta ve şifrenizi kontrol edin." };
  }

  const GENERIC_ERROR = "E-posta veya şifre hatalı.";

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user || !user.isActive) {
    return { error: GENERIC_ERROR };
  }

  const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!passwordOk) {
    return { error: GENERIC_ERROR };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const next = String(formData.get("next") || "/admin");
  // Only allow internal redirects — never bounce to an attacker-supplied host.
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
