import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * OAuth / magic-link callback.
 * Always hand off to /workspace — never resolve role-specific paths here.
 * Embedding destinations in auth logic is forbidden; /workspace is the sole post-login hub.
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
        const dest = new URL("/workspace", origin);
        // Only forward next when it is an app-relative path; /workspace validates it
        if (next && next.startsWith("/") && !next.startsWith("//")) {
          dest.searchParams.set("next", next);
        }
        return NextResponse.redirect(dest);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
