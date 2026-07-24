/**
 * Institutional workspaces — system determines destination after sign-in.
 * Users never pick a dashboard.
 */

import type { SystemRoleSlug } from "@/lib/iam/roles";
import type { RelationshipSlug } from "@/lib/iam/roles";

export type WorkspaceId =
  | "admin"
  | "programme"
  | "review"
  | "finance"
  | "communications"
  | "volunteer"
  | "patron"
  | "founder"
  | "member"
  | "executive";

export type WorkspaceDef = {
  id: WorkspaceId;
  path: string;
  title: string;
  purpose: string;
  nav: { href: string; label: string }[];
};

/** Priority order: first matching system role wins (most privileged first). */
const ROLE_WORKSPACE_PRIORITY: {
  role: SystemRoleSlug;
  workspace: WorkspaceId;
}[] = [
  { role: "super_administrator", workspace: "admin" },
  { role: "administrator", workspace: "executive" },
  { role: "programme_manager", workspace: "programme" },
  { role: "reviewer", workspace: "review" },
  { role: "finance", workspace: "finance" },
  { role: "communications", workspace: "communications" },
  { role: "content_editor", workspace: "programme" },
  { role: "read_only", workspace: "member" },
  { role: "none", workspace: "member" },
];

/**
 * Relationship → portal workspace only (own limited data).
 * Never grants CMS / ops (applications.review, payments.manage, users.assign).
 * co_founder / founding_team_member require system roles — not relationship alone.
 * See portalEntitlements.ts: patron.portal · founder.portal · volunteer.portal
 */
const RELATIONSHIP_WORKSPACE: Partial<Record<RelationshipSlug, WorkspaceId>> = {
  patron: "patron",
  volunteer: "volunteer",
  member: "founder",
  advisor: "member",
  guest: "member",
};

export const WORKSPACES: Record<WorkspaceId, WorkspaceDef> = {
  admin: {
    id: "admin",
    path: "/admin",
    title: "Institution Operations",
    purpose: "System health, security, and institutional operations.",
    nav: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/events", label: "Events" },
      { href: "/admin/applications", label: "Applications" },
      { href: "/admin/team", label: "Team & Access" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
  executive: {
    id: "executive",
    path: "/executive",
    title: "Executive Office",
    purpose: "Institution health and today's attention.",
    nav: [
      { href: "/executive", label: "Dashboard" },
      { href: "/executive/people", label: "People" },
      { href: "/executive/events", label: "Events" },
      { href: "/executive/applications", label: "Applications" },
      { href: "/executive/analytics", label: "Analytics" },
      { href: "/login", label: "Profile" },
    ],
  },
  programme: {
    id: "programme",
    path: "/programme",
    title: "Programme Operations",
    purpose: "Events, applications, communications, tasks.",
    nav: [
      { href: "/programme", label: "Dashboard" },
      { href: "/programme/events", label: "Events" },
      { href: "/programme/applications", label: "Applications" },
      { href: "/programme/tasks", label: "Tasks" },
      { href: "/programme/communications", label: "Communications" },
    ],
  },
  review: {
    id: "review",
    path: "/review",
    title: "Application Review",
    purpose: "Review applications. Nothing else.",
    nav: [
      { href: "/review", label: "Dashboard" },
      { href: "/review/queue", label: "Review Queue" },
      { href: "/review/completed", label: "Completed" },
    ],
  },
  finance: {
    id: "finance",
    path: "/finance",
    title: "Finance",
    purpose: "Payments, refunds, invoices, reports.",
    nav: [
      { href: "/finance", label: "Dashboard" },
      { href: "/finance/payments", label: "Payments" },
      { href: "/finance/reports", label: "Reports" },
    ],
  },
  communications: {
    id: "communications",
    path: "/communications",
    title: "Communications",
    purpose: "Campaigns, reminders, community updates.",
    nav: [
      { href: "/communications", label: "Dashboard" },
      { href: "/communications/campaigns", label: "Campaigns" },
      { href: "/communications/messages", label: "Messages" },
    ],
  },
  volunteer: {
    id: "volunteer",
    path: "/volunteer",
    title: "Volunteer",
    purpose: "Assigned events, checklists, contacts.",
    nav: [
      { href: "/volunteer", label: "Home" },
      { href: "/volunteer/events", label: "Assigned Events" },
      { href: "/volunteer/tasks", label: "Tasks" },
    ],
  },
  patron: {
    id: "patron",
    path: "/patron",
    title: "Patron Portal",
    purpose: "Relationship, impact, visibility.",
    nav: [
      { href: "/patron", label: "Home" },
      { href: "/patron/impact", label: "Impact" },
      { href: "/patron/events", label: "Events" },
      { href: "/patron/reports", label: "Reports" },
      { href: "/patron/meetings", label: "Meetings" },
    ],
  },
  founder: {
    id: "founder",
    path: "/founder",
    title: "Founder Workspace",
    purpose: "Your relationship with Founder-Being.",
    nav: [
      { href: "/founder", label: "Home" },
      { href: "/events", label: "Upcoming Gatherings" },
      { href: "/founder/applications", label: "My Applications" },
      { href: "/founder/retreats", label: "My Retreats" },
      { href: "/founder/resources", label: "Resources" },
      { href: "/founder/messages", label: "Messages" },
      { href: "/founder/profile", label: "Profile" },
    ],
  },
  member: {
    id: "member",
    path: "/member",
    title: "Member Home",
    purpose: "Community updates and gatherings.",
    nav: [
      { href: "/member", label: "Home" },
      { href: "/events", label: "Events" },
      { href: "/member/resources", label: "Resources" },
      { href: "/member/profile", label: "Profile" },
    ],
  },
};

/**
 * Resolve workspace from system roles + optional institutional relationship.
 * Never user-selected.
 */
export function resolveWorkspace(
  systemRoles: SystemRoleSlug[],
  relationship?: RelationshipSlug | string | null,
): WorkspaceDef {
  for (const { role, workspace } of ROLE_WORKSPACE_PRIORITY) {
    if (systemRoles.includes(role)) {
      // Refine none/read_only via relationship
      if (
        (role === "none" || role === "read_only") &&
        relationship &&
        RELATIONSHIP_WORKSPACE[relationship as RelationshipSlug]
      ) {
        const id = RELATIONSHIP_WORKSPACE[relationship as RelationshipSlug]!;
        return WORKSPACES[id];
      }
      return WORKSPACES[workspace];
    }
  }

  if (relationship && RELATIONSHIP_WORKSPACE[relationship as RelationshipSlug]) {
    return WORKSPACES[RELATIONSHIP_WORKSPACE[relationship as RelationshipSlug]!];
  }

  return WORKSPACES.member;
}

export const WORKSPACE_PATHS = Object.values(WORKSPACES).map((w) => w.path);

export function isWorkspacePath(pathname: string): boolean {
  if (pathname === "/login" || pathname.startsWith("/login/")) return false;
  if (pathname === "/workspace" || pathname.startsWith("/workspace/")) {
    return true;
  }
  return WORKSPACE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Stable post-auth entry — email links, OAuth, magic link, session recovery */
export const WORKSPACE_ENTRY_PATH = "/workspace";

