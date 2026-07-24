import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_AUTH_PATHS = [
  "/login",
  "/login/callback",
  "/login/forgot-password",
  "/login/reset-password",
  "/admin/login",
  "/admin/auth/callback",
  "/access",
  "/forbidden",
];

const PROTECTED_PREFIXES = [
  "/workspace",
  "/access/pending",
  "/security",
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

  // Public access request form (not pending)
  if (pathname === "/access" || pathname === "/forbidden") {
    return NextResponse.next();
  }

  if (!isProtected(pathname) && !pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Exact /login only: already authenticated → /workspace
  // Do not auto-redirect forgot-password or reset-password
  if (pathname === "/login") {
    const { response, user, configured } = await updateSession(request);
    if (configured && user) {
      const dest = request.nextUrl.clone();
      dest.pathname = "/workspace";
      const next = request.nextUrl.searchParams.get("next");
      dest.search = "";
      if (
        next &&
        next.startsWith("/") &&
        !next.startsWith("//") &&
        !next.startsWith("/login")
      ) {
        dest.searchParams.set("next", next);
      }
      return NextResponse.redirect(dest);
    }
    return response;
  }

  if (isPublicAuth(pathname) && pathname.startsWith("/login/")) {
    const { response } = await updateSession(request);
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
    "/workspace",
    "/workspace/:path*",
    "/access",
    "/access/:path*",
    "/security",
    "/security/:path*",
    "/forbidden",
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
