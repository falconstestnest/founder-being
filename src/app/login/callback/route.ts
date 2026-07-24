import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * OAuth / magic-link / password-recovery callback.
 *
 * Password recovery: next=/login/reset-password is allowed as a recovery destination.
 * All other successful auths hand off to /workspace (never embed role paths here).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const cookieStore = await cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (url && key) {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Recovery flow must reach the password form, not the workspace resolver
        if (next === "/login/reset-password") {
          return NextResponse.redirect(`${origin}/login/reset-password`);
        }

        const dest = new URL("/workspace", origin);
        if (next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/login")) {
          dest.searchParams.set("next", next);
        }
        return NextResponse.redirect(dest);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
