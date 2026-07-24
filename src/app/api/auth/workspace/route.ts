import { NextResponse } from "next/server";
import { getAuthzContext } from "@/lib/iam/authz";
import { resolveWorkspace } from "@/lib/iam/workspaces";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function GET() {
  const ctx = await getAuthzContext();
  if (!ctx) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

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

  const workspace = resolveWorkspace(ctx.systemRoles, relationship);

  return NextResponse.json({
    path: workspace.path,
    workspace: workspace.id,
    title: workspace.title,
  });
}
