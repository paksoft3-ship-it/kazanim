import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

const COOKIE_NAME = "kazanim_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Generate one with: openssl rand -base64 32",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Issue a signed session JWT and set it as an HTTP-only cookie. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Read and verify the current session. Returns null when signed out. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

/**
 * Session guard for admin server components and actions.
 * Re-checks the database so deactivated users lose access immediately,
 * rather than staying valid until their JWT expires.
 */
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) throw new Error("UNAUTHORIZED");

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

/** Roles allowed to mutate content. VIEWER is read-only. */
const WRITE_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export function canWrite(role: UserRole): boolean {
  return WRITE_ROLES.includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export async function requireWrite(): Promise<SessionUser> {
  const session = await requireSession();
  if (!canWrite(session.role)) throw new Error("FORBIDDEN");
  return session;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
