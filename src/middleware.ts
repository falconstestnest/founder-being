import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_AUTH_PATHS = [
  "/login",
  "/login/callback",
  "/admin/login",
  "/admin/auth/callback",
  "/access",
];

const PROTECTED_PREFIXES = [
  "/admin",
  "/founder",
  "/patron",
  "/programme",
  "/review",
  "/finance",
  "/communications",
  "/volunteer",
  "/member",
  "/executive",
];

function isPublicAuth(pathname: string) {
  return PUBLIC_AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Legacy admin login → institutional sign-in
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (!isProtected(pathname) && pathname !== "/login") {
    return NextResponse.next();
  }

  // Allow public auth pages through session refresh when configured
  if (isPublicAuth(pathname) && pathname.startsWith("/login")) {
    const { response, user, configured } = await updateSession(request);
    if (configured && user && pathname === "/login") {
      // Let client call /api/auth/workspace; optional soft redirect to member
      // Stay on login if they need to switch accounts — only auto-redirect with next
      const next = request.nextUrl.searchParams.get("next");
      if (next) {
        const dest = request.nextUrl.clone();
        dest.pathname = next;
        dest.search = "";
        return NextResponse.redirect(dest);
      }
    }
    return response;
  }

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const isAuthSurface =
    pathname.startsWith("/admin/auth") || pathname === "/admin/logout";

  const { response, user, configured } = await updateSession(request);

  if (!configured) {
    if (isAuthSurface) return response;
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("error", "auth_not_configured");
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (!user && !isAuthSurface) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/login/:path*",
    "/admin",
    "/admin/:path*",
    "/founder",
    "/founder/:path*",
    "/patron",
    "/patron/:path*",
    "/programme",
    "/programme/:path*",
    "/review",
    "/review/:path*",
    "/finance",
    "/finance/:path*",
    "/communications",
    "/communications/:path*",
    "/volunteer",
    "/volunteer/:path*",
    "/member",
    "/member/:path*",
    "/executive",
    "/executive/:path*",
  ],
};
