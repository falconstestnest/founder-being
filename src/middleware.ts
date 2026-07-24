import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/auth/callback"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all admin routes except login / auth callback
  const isAdmin = pathname.startsWith("/admin");
  if (!isAdmin) {
    return NextResponse.next();
  }

  const isPublicAdmin = PUBLIC_ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const { response, user, configured } = await updateSession(request);

  // Production without Supabase: lock the console
  if (!configured) {
    if (isPublicAdmin) return response;
    if (process.env.NODE_ENV === "production") {
      const login = request.nextUrl.clone();
      login.pathname = "/admin/login";
      login.searchParams.set("error", "auth_not_configured");
      return NextResponse.redirect(login);
    }
    // Development without Supabase: still force login page (no open console)
    if (!isPublicAdmin) {
      const login = request.nextUrl.clone();
      login.pathname = "/admin/login";
      login.searchParams.set("error", "auth_not_configured");
      return NextResponse.redirect(login);
    }
    return response;
  }

  if (!user && !isPublicAdmin) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  // Authenticated users on login → dashboard
  if (user && pathname === "/admin/login") {
    const dest = request.nextUrl.clone();
    dest.pathname = "/admin";
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};
