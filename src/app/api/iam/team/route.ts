import { NextResponse } from "next/server";
import { AuthzError, requireAuthz } from "@/lib/iam/authz";
import { SUPER_ADMIN, allowLocalIamFallback } from "@/lib/iam/constants";
import { RELATIONSHIPS, SYSTEM_ROLES } from "@/lib/iam/roles";
import { listAccessRequests, listTeamMembers } from "@/lib/iam/store";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    await requireAuthz("users.view");

    const supabase = getServiceSupabase();
    if (supabase) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select(
          "id, full_name, email, status, mfa_enabled, last_login_at, protected, is_super_admin, relationship_slug, created_at",
        )
        .order("created_at", { ascending: true });

      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("profile_id, roles(slug, name)");

      const { data: requests } = await supabase
        .from("access_requests")
        .select("*")
        .in("status", ["submitted", "under_review", "pending"])
        .order("created_at", { ascending: false });

      const { data: invitations } = await supabase
        .from("invitations")
        .select("id, email, full_name, status, expires_at, created_at, roles(slug, name)")
        .order("created_at", { ascending: false })
        .limit(50);

      return NextResponse.json({
        members: profiles ?? [],
        userRoles: userRoles ?? [],
        pendingRequests: requests ?? [],
        invitations: invitations ?? [],
        systemRoles: SYSTEM_ROLES,
        relationships: RELATIONSHIPS,
        superAdmin: SUPER_ADMIN,
        source: "supabase",
      });
    }

    if (!allowLocalIamFallback()) {
      return NextResponse.json(
        { error: "Identity service is not configured." },
        { status: 503 },
      );
    }

    const members = await listTeamMembers();
    const pendingRequests = await listAccessRequests().then((r) =>
      r.filter((x) => x.status === "pending" || x.status === "submitted"),
    );

    return NextResponse.json({
      members,
      pendingRequests,
      invitations: [],
      systemRoles: SYSTEM_ROLES,
      relationships: RELATIONSHIPS,
      superAdmin: SUPER_ADMIN,
      source: "local",
    });
  } catch (e) {
    if (e instanceof AuthzError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    throw e;
  }
}
