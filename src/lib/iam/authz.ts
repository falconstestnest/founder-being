import type { User } from "@supabase/supabase-js";
import {
  anyRoleHasPermission,
  type PermissionKey,
  type SystemRoleSlug,
} from "@/lib/iam/roles";
import { createSupabaseServerClient, getServiceSupabase } from "@/lib/supabase/server";

export type AuthzContext = {
  user: User;
  profileId: string;
  email: string;
  fullName: string;
  status: string;
  systemRoles: SystemRoleSlug[];
  isSuperAdmin: boolean;
  protected: boolean;
  mfaEnabled: boolean;
};

export class AuthzError extends Error {
  status: number;
  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
  }
}

/**
 * Load the authenticated user and their active CMS profile + system roles.
 * Does NOT grant access by email match.
 */
export async function getAuthzContext(): Promise<AuthzContext | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const service = getServiceSupabase();
  const db = service ?? supabase;

  const { data: profile } = await db
    .from("profiles")
    .select(
      "id, email, full_name, status, is_super_admin, protected, mfa_enabled, auth_user_id",
    )
    .or(`auth_user_id.eq.${user.id},email.eq.${user.email ?? ""}`)
    .maybeSingle();

  if (!profile) return null;
  if (profile.status !== "active") return null;

  // Link auth user on first successful load
  if (!profile.auth_user_id && service) {
    await service
      .from("profiles")
      .update({ auth_user_id: user.id, last_login_at: new Date().toISOString() })
      .eq("id", profile.id);
  }

  const { data: roleRows } = await db
    .from("user_roles")
    .select("roles(slug)")
    .eq("profile_id", profile.id);

  const systemRoles: SystemRoleSlug[] = [];
  for (const row of roleRows ?? []) {
    const roles = row.roles as { slug?: string } | { slug?: string }[] | null;
    const slug = Array.isArray(roles) ? roles[0]?.slug : roles?.slug;
    if (slug) systemRoles.push(slug as SystemRoleSlug);
  }

  if (profile.is_super_admin && !systemRoles.includes("super_administrator")) {
    systemRoles.push("super_administrator");
  }

  // No CMS role → no operations access
  const cmsRoles = systemRoles.filter((r) => r !== "none");
  if (cmsRoles.length === 0 && !profile.is_super_admin) {
    return null;
  }

  return {
    user,
    profileId: profile.id as string,
    email: profile.email as string,
    fullName: (profile.full_name as string) || "",
    status: profile.status as string,
    systemRoles: cmsRoles.length ? cmsRoles : systemRoles,
    isSuperAdmin: Boolean(profile.is_super_admin),
    protected: Boolean(profile.protected),
    mfaEnabled: Boolean(profile.mfa_enabled),
  };
}

export async function requireAuthz(
  permission?: PermissionKey,
): Promise<AuthzContext> {
  const ctx = await getAuthzContext();
  if (!ctx) {
    throw new AuthzError("Authentication required.", 401);
  }
  if (ctx.status !== "active") {
    throw new AuthzError("Account is not active.", 403);
  }
  if (permission && !ctx.isSuperAdmin) {
    if (!anyRoleHasPermission(ctx.systemRoles, permission)) {
      throw new AuthzError("You do not have permission for this action.", 403);
    }
  }
  return ctx;
}

export function hasPermission(ctx: AuthzContext, permission: PermissionKey) {
  if (ctx.isSuperAdmin) return true;
  return anyRoleHasPermission(ctx.systemRoles, permission);
}

export async function writeAuditEvent(input: {
  actorProfileId?: string | null;
  action: string;
  objectType?: string;
  objectId?: string;
  meta?: Record<string, unknown>;
  ipHash?: string | null;
  userAgent?: string | null;
}) {
  const service = getServiceSupabase();
  if (!service) return;
  await service.from("audit_logs").insert({
    actor_profile_id: input.actorProfileId ?? null,
    action: input.action,
    object_type: input.objectType ?? null,
    object_id: input.objectId ?? null,
    meta: input.meta ?? {},
    ip_hash: input.ipHash ?? null,
    user_agent: input.userAgent ?? null,
  });
}
