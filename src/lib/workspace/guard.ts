import { redirect } from "next/navigation";
import {
  anyRoleHasPermission,
  roleBySlug,
  type PermissionKey,
  type SystemRoleSlug,
} from "@/lib/iam/roles";
import {
  resolveWorkspaceSession,
  type WorkspaceSessionResult,
} from "@/lib/iam/workspaceSession";
import {
  type WorkspaceDef,
  type WorkspaceId,
  WORKSPACES,
} from "@/lib/iam/workspaces";

/** Layout-compatible context (not a substitute for requireAuthz on APIs). */
export type WorkspaceAuthCtx = {
  profileId: string;
  email: string;
  fullName: string;
  status: string;
  systemRoles: SystemRoleSlug[];
  isSuperAdmin: boolean;
  protected: boolean;
  mfaEnabled: boolean;
};

/**
 * Enforce that this request may use `expected` workspace.
 *
 * The workspace resolver is routing only — this guard re-checks session every
 * time. A user manually visiting another route is redirected to their home
 * (or /workspace for blocked states), not merely shown a hidden sidebar.
 */
function primaryRoleLabel(roles: SystemRoleSlug[]): string | undefined {
  for (const slug of roles) {
    if (slug === "none") continue;
    const def = roleBySlug(slug);
    if (def) return def.name;
  }
  return undefined;
}

export async function requireWorkspace(
  expected: WorkspaceId,
  options?: { permission?: PermissionKey },
): Promise<{
  ctx: WorkspaceAuthCtx;
  workspace: WorkspaceDef;
  resolved: WorkspaceDef;
  session: WorkspaceSessionResult;
  /** Discreet label for profile menu only */
  roleLabel?: string;
}> {
  const session = await resolveWorkspaceSession();

  if (session.state === "unauthenticated") {
    redirect(`/login?next=/${expected === "admin" ? "admin" : expected}`);
  }

  if (session.state === "configuration_missing") {
    redirect("/login?error=auth_not_configured");
  }

  if (session.state !== "authenticated_and_authorized" || !session.profile) {
    redirect(`/workspace?state=${session.state}`);
  }

  const profile = session.profile;
  const resolved = session.workspace ?? WORKSPACES.member;
  const isSuperAdmin = profile.isSuperAdmin;

  const ctx: WorkspaceAuthCtx = {
    profileId: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    status: profile.status,
    systemRoles: profile.systemRoles,
    isSuperAdmin: profile.isSuperAdmin,
    protected: profile.protected,
    mfaEnabled: profile.mfaEnabled,
  };

  const roleLabel = primaryRoleLabel(profile.systemRoles);

  if (isSuperAdmin) {
    return {
      ctx,
      workspace: expected === "admin" ? WORKSPACES.admin : WORKSPACES[expected],
      resolved,
      session,
      roleLabel: roleLabel ?? "Super Administrator",
    };
  }

  if (resolved.id !== expected) {
    redirect(resolved.path);
  }

  if (options?.permission) {
    if (!anyRoleHasPermission(profile.systemRoles, options.permission)) {
      redirect(`/workspace?state=role_missing&denied=${options.permission}`);
    }
  }

  return {
    ctx,
    workspace: WORKSPACES[expected],
    resolved,
    session,
    roleLabel,
  };
}
