import { NextResponse } from "next/server";
import { listAccessRequests, listTeamMembers } from "@/lib/iam/store";
import { ROLES } from "@/lib/iam/roles";
import { SUPER_ADMIN } from "@/lib/iam/constants";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServiceSupabase();
  if (supabase) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, status, mfa_enabled, last_login_at, protected, is_super_admin, created_at")
      .order("created_at", { ascending: true });

    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("profile_id, roles(slug, name)");

    const { data: requests } = await supabase
      .from("access_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    return NextResponse.json({
      members: profiles ?? [],
      userRoles: userRoles ?? [],
      pendingRequests: requests ?? [],
      roles: ROLES,
      superAdmin: SUPER_ADMIN,
      source: "supabase",
    });
  }

  const members = await listTeamMembers();
  const pendingRequests = await listAccessRequests().then((r) =>
    r.filter((x) => x.status === "pending"),
  );

  return NextResponse.json({
    members,
    pendingRequests,
    roles: ROLES,
    superAdmin: SUPER_ADMIN,
    source: "local",
  });
}
