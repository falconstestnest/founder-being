/**
 * Workspace session resolver — explicit states, never user-selected destination.
 *
 * Security rule: this resolver is routing only. Every workspace route, API,
 * and data query must still enforce authorization independently.
 */

import type { User } from "@supabase/supabase-js";
import {
  SYSTEM_ROLES,
  type SystemRoleSlug,
} from "@/lib/iam/roles";
import {
  resolveWorkspace,
  type WorkspaceDef,
} from "@/lib/iam/workspaces";
import {
  createSupabaseServerClient,
  getServiceSupabase,
} from "@/lib/supabase/server";

export const WORKSPACE_RESOLVE_STATES = [
  "authenticated_and_authorized",
  "unauthenticated",
  "profile_missing",
  "profile_inactive",
  "role_missing",
  "mfa_required",
  "access_suspended",
  "configuration_missing",
] as const;

export type WorkspaceResolveState = (typeof WORKSPACE_RESOLVE_STATES)[number];

export type WorkspaceSessionProfile = {
  id: string;
  email: string;
  fullName: string;
  status: string;
  systemRoles: SystemRoleSlug[];
  relationship: string | null;
  isSuperAdmin: boolean;
  protected: boolean;
  mfaEnabled: boolean;
  authUserId: string | null;
};

export type WorkspaceSessionResult = {
  state: WorkspaceResolveState;
  /** Destination path when state is authenticated_and_authorized */
  path: string | null;
  workspace: WorkspaceDef | null;
  user: User | null;
  profile: WorkspaceSessionProfile | null;
  /** Human-facing title for fallback screens */
  title: string;
  /** Human-facing body for fallback screens */
  body: string;
};

export const WORKSPACE_STATE_COPY: Record<
  Exclude<WorkspaceResolveState, "authenticated_and_authorized" | "unauthenticated">,
  { title: string; body: string }
> = {
  configuration_missing: {
    title: "Secure access is not available",
    body: "Authentication is not configured in this environment. Please contact the Founder-Being team.",
  },
  profile_missing: {
    title: "Your workspace is being prepared",
    body: "Your account is signed in, but your Founder-Being profile has not yet been activated. Please contact the Founder-Being team.",
  },
  profile_inactive: {
    title: "Your workspace is being prepared",
    body: "Your account is signed in, but your Founder-Being profile has not yet been activated. Please contact the Founder-Being team.",
  },
  role_missing: {
    title: "Access is awaiting approval",
    body: "Your account is active, but a workspace has not yet been assigned.",
  },
  mfa_required: {
    title: "Complete your security setup",
    body: "Your role requires multi-factor authentication before you can continue.",
  },
  access_suspended: {
    title: "Workspace access is currently unavailable",
    body: "Please contact the Founder-Being team for assistance.",
  },
};

function emptyResult(
  state: WorkspaceResolveState,
  extras?: Partial<WorkspaceSessionResult>,
): WorkspaceSessionResult {
  const copy =
    state === "authenticated_and_authorized" || state === "unauthenticated"
      ? { title: "", body: "" }
      : WORKSPACE_STATE_COPY[state];
  return {
    state,
    path: null,
    workspace: null,
    user: null,
    profile: null,
    title: copy.title,
    body: copy.body,
    ...extras,
  };
}

function roleRequiresMfa(roles: SystemRoleSlug[]): boolean {
  return roles.some((slug) => {
    const def = SYSTEM_ROLES.find((r) => r.slug === slug);
    return def?.mfaRequired === true;
  });
}

/**
 * Full session resolve for /workspace and guards.
 * Relationship may open portals; it never grants CMS permissions by itself.
 */
export async function resolveWorkspaceSession(): Promise<WorkspaceSessionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return emptyResult("configuration_missing");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return emptyResult("unauthenticated", { user: null });
  }

  const service = getServiceSupabase();
  const db = service ?? supabase;

  const { data: profile } = await db
    .from("profiles")
    .select(
      "id, email, full_name, status, is_super_admin, protected, mfa_enabled, auth_user_id, relationship_slug, person_id",
    )
    .or(`auth_user_id.eq.${user.id},email.eq.${user.email ?? ""}`)
    .maybeSingle();

  if (!profile) {
    return emptyResult("profile_missing", { user });
  }

  const status = String(profile.status ?? "");

  if (status === "suspended") {
    return emptyResult("access_suspended", {
      user,
      profile: mapProfile(profile, [], null),
    });
  }

  if (status !== "active") {
    return emptyResult("profile_inactive", {
      user,
      profile: mapProfile(profile, [], null),
    });
  }

  // Link auth user on first successful load
  if (!profile.auth_user_id && service) {
    await service
      .from("profiles")
      .update({ auth_user_id: user.id, last_login_at: new Date().toISOString() })
      .eq("id", profile.id);
  }

  // profiles = access; ensure linked people row (CRM human) — never use profile as CRM
  if (service) {
    const { ensureProfilePerson } = await import(
      "@/lib/people/ensureProfilePerson"
    );
    await ensureProfilePerson({
      profileId: profile.id as string,
      email: (profile.email as string) || user.email || "",
      fullName: (profile.full_name as string) || "",
      relationshipSlug:
        (profile.relationship_slug as string | null | undefined) ?? null,
      existingPersonId:
        (profile.person_id as string | null | undefined) ?? null,
    });
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

  const relationship =
    (profile.relationship_slug as string | null | undefined) ?? null;

  const mapped = mapProfile(profile, systemRoles, relationship);

  const cmsRoles = systemRoles.filter((r) => r !== "none");
  const hasCms = Boolean(profile.is_super_admin) || cmsRoles.length > 0;
  const workspace = resolveWorkspace(
    systemRoles.length ? systemRoles : (["none"] as SystemRoleSlug[]),
    relationship,
  );

  // Active profile but nothing that maps to a real assigned workspace
  // (relationship guest + no roles → member is still a soft home; role_missing
  // is for pending assignment when we have neither CMS role nor relationship)
  if (!hasCms && !relationship) {
    return emptyResult("role_missing", { user, profile: mapped });
  }

  // Privileged roles: block until MFA when REQUIRE_WORKSPACE_MFA=1
  // Enrollment UI: /security/setup
  const enforceMfa = process.env.REQUIRE_WORKSPACE_MFA === "1";
  if (
    enforceMfa &&
    roleRequiresMfa(systemRoles) &&
    !profile.mfa_enabled
  ) {
    return emptyResult("mfa_required", {
      user,
      profile: mapped,
      workspace,
      path: null,
    });
  }

  return {
    state: "authenticated_and_authorized",
    path: workspace.path,
    workspace,
    user,
    profile: mapped,
    title: workspace.title,
    body: workspace.purpose,
  };
}

/**
 * Dedicated outcome routes — avoid bouncing between /workspace and guards.
 *
 * Unauthenticated → /login
 * Inactive / role missing → /access/pending
 * MFA required → /security/setup
 * Suspended → /forbidden?reason=suspended
 * Permission denied → /forbidden
 */
export function outcomePathForState(
  state: WorkspaceResolveState,
): string {
  switch (state) {
    case "unauthenticated":
      return "/login";
    case "configuration_missing":
      return "/login?error=auth_not_configured";
    case "profile_missing":
    case "profile_inactive":
    case "role_missing":
      return "/access/pending";
    case "mfa_required":
      return "/security/setup";
    case "access_suspended":
      return "/forbidden?reason=suspended";
    case "authenticated_and_authorized":
      return "/workspace";
    default:
      return "/access/pending";
  }
}

function mapProfile(
  profile: Record<string, unknown>,
  systemRoles: SystemRoleSlug[],
  relationship: string | null,
): WorkspaceSessionProfile {
  return {
    id: profile.id as string,
    email: (profile.email as string) || "",
    fullName: (profile.full_name as string) || "",
    status: String(profile.status ?? ""),
    systemRoles,
    relationship,
    isSuperAdmin: Boolean(profile.is_super_admin),
    protected: Boolean(profile.protected),
    mfaEnabled: Boolean(profile.mfa_enabled),
    authUserId: (profile.auth_user_id as string) || null,
  };
}

/**
 * Safe deep-link after resolve: only same workspace tree (or /admin for super admin).
 * Never trust client-supplied next as a security boundary.
 */
export function safeWorkspaceNext(
  next: string | null | undefined,
  authorizedPath: string,
  isSuperAdmin: boolean,
): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  if (next.startsWith("/login") || next.startsWith("/api/")) return null;

  if (isSuperAdmin) {
    // Super admin may deep-link into any workspace for support
    return next;
  }

  if (next === authorizedPath || next.startsWith(`${authorizedPath}/`)) {
    return next;
  }

  return null;
}
