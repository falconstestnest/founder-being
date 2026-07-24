import { redirect } from "next/navigation";
import { getAuthzContext } from "@/lib/iam/authz";
import {
  resolveWorkspace,
  type WorkspaceId,
  WORKSPACES,
} from "@/lib/iam/workspaces";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function requireWorkspace(expected: WorkspaceId) {
  const ctx = await getAuthzContext();
  if (!ctx) {
    redirect(`/login?next=/${expected === "admin" ? "admin" : expected}`);
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

  // Super admin may open any workspace for support
  if (ctx.isSuperAdmin) {
    return {
      ctx,
      workspace: expected === "admin" ? WORKSPACES.admin : WORKSPACES[expected],
      resolved: workspace,
    };
  }

  if (workspace.id !== expected) {
    redirect(workspace.path);
  }

  return { ctx, workspace, resolved: workspace };
}
