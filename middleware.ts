import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge guard for /admin/*.
 *
 * This only verifies the session JWT's signature and expiry — it cannot touch
 * the database from the Edge runtime. The authoritative check (user still
 * exists, is still active, current role) happens in `requireSession()` in
 * lib/auth.ts on every admin page and server action. This layer exists to
 * bounce signed-out visitors quickly, not as the sole authorisation check.
 */

const COOKIE_NAME = "kazanim_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable while signed out.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.AUTH_SECRET;

  let valid = false;
  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    // Preserve the intended destination so login can bounce back to it.
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("next", pathname);
    }
    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
