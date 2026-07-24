import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthzContext } from "@/lib/iam/authz";
import { resolveWorkspace } from "@/lib/iam/workspaces";
import { getServiceSupabase } from "@/lib/supabase/server";

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
        if (next) {
          return NextResponse.redirect(`${origin}${next}`);
        }
        // Resolve workspace
        const ctx = await getAuthzContext();
        if (ctx) {
          let relationship: string | null = null;
          const service = getServiceSupabase();
          if (service) {
            const { data } = await service
              .from("profiles")
              .select("relationship_slug")
              .eq("id", ctx.profileId)
              .maybeSingle();
            relationship = (data?.relationship_slug as string) ?? null;
          }
          const ws = resolveWorkspace(ctx.systemRoles, relationship);
          return NextResponse.redirect(`${origin}${ws.path}`);
        }
        return NextResponse.redirect(`${origin}/member`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
