/**
 * Founder-Being IAM
 *
 * Two separate concepts:
 * 1. Institutional relationship — who someone is to Founder-Being
 * 2. System access role — what they can do in the CMS
 *
 * Titles never auto-grant operational permissions.
 */

// ─── Institutional relationship (not CMS permissions) ───────────────────────

export const RELATIONSHIP_SLUGS = [
  "co_founder",
  "founding_team_member",
  "patron",
  "member",
  "volunteer",
  "advisor",
  "guest",
] as const;

export type RelationshipSlug = (typeof RELATIONSHIP_SLUGS)[number];

export const RELATIONSHIPS: {
  slug: RelationshipSlug;
  name: string;
  description: string;
}[] = [
  {
    slug: "co_founder",
    name: "Co-Founder",
    description: "Institutional co-founder relationship.",
  },
  {
    slug: "founding_team_member",
    name: "Founding Team Member",
    description: "Part of the founding team community.",
  },
  {
    slug: "patron",
    name: "Patron",
    description: "Founding Patron Circle.",
  },
  {
    slug: "member",
    name: "Member",
    description: "Founder-Being community member.",
  },
  {
    slug: "volunteer",
    name: "Volunteer",
    description: "Volunteer contributor.",
  },
  {
    slug: "advisor",
    name: "Advisor",
    description: "Advisory relationship.",
  },
  {
    slug: "guest",
    name: "Guest",
    description: "Invitation-only guest relationship.",
  },
];

// ─── System access roles (CMS permissions) ──────────────────────────────────

export const SYSTEM_ROLE_SLUGS = [
  "super_administrator",
  "administrator",
  "programme_manager",
  "reviewer",
  "finance",
  "content_editor",
  "communications",
  "read_only",
  "none",
] as const;

export type SystemRoleSlug = (typeof SYSTEM_ROLE_SLUGS)[number];

/** @deprecated Use SystemRoleSlug — kept for gradual migration */
export type RoleSlug = SystemRoleSlug;

export type SystemRoleDefinition = {
  slug: SystemRoleSlug;
  name: string;
  description: string;
  /** May be requested on /access as preferred operational access */
  requestable: boolean;
  mfaRequired: boolean;
  cmsAccess: boolean;
};

export const SYSTEM_ROLES: SystemRoleDefinition[] = [
  {
    slug: "super_administrator",
    name: "Super Administrator",
    description: "Full system access. Protected ownership.",
    requestable: false,
    mfaRequired: true,
    cmsAccess: true,
  },
  {
    slug: "administrator",
    name: "Administrator",
    description: "Broad operational CMS access without ownership controls.",
    requestable: true,
    mfaRequired: true,
    cmsAccess: true,
  },
  {
    slug: "programme_manager",
    name: "Programme Manager",
    description: "Retreats, gatherings, attendees, schedules.",
    requestable: true,
    mfaRequired: true,
    cmsAccess: true,
  },
  {
    slug: "reviewer",
    name: "Reviewer",
    description: "Review and decide on founder applications.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: true,
  },
  {
    slug: "finance",
    name: "Finance",
    description: "Payments, refunds, invoices, reports only.",
    requestable: true,
    mfaRequired: true,
    cmsAccess: true,
  },
  {
    slug: "content_editor",
    name: "Content Editor",
    description: "Publish and edit public content.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: true,
  },
  {
    slug: "communications",
    name: "Communications",
    description: "Founder and patron communications.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: true,
  },
  {
    slug: "read_only",
    name: "Read Only",
    description: "View operational data without mutations.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: true,
  },
  {
    slug: "none",
    name: "No CMS access",
    description: "Authenticated relationship only — no operations console.",
    requestable: false,
    mfaRequired: false,
    cmsAccess: false,
  },
];

/** Alias for UI that still says ROLES */
export const ROLES = SYSTEM_ROLES;

export const PERMISSION_CATEGORIES = [
  "dashboard",
  "applications",
  "retreats",
  "events",
  "members",
  "patrons",
  "communications",
  "payments",
  "reports",
  "content",
  "settings",
  "users",
  "audit_logs",
  "api",
] as const;

export type PermissionCategory = (typeof PERMISSION_CATEGORIES)[number];

export const PERMISSION_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "export",
  "approve",
  "publish",
  "assign",
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export type PermissionKey = `${PermissionCategory}.${PermissionAction}` | "*";

export const ROLE_PERMISSIONS: Record<SystemRoleSlug, PermissionKey[]> = {
  super_administrator: ["*"],
  administrator: [
    "dashboard.view",
    "applications.view",
    "applications.create",
    "applications.edit",
    "applications.approve",
    "applications.export",
    "retreats.view",
    "retreats.create",
    "retreats.edit",
    "retreats.publish",
    "events.view",
    "events.create",
    "events.edit",
    "events.publish",
    "members.view",
    "members.edit",
    "patrons.view",
    "patrons.edit",
    "communications.view",
    "communications.create",
    "communications.edit",
    "content.view",
    "content.edit",
    "content.publish",
    "reports.view",
    "reports.export",
    "payments.view",
    "users.view",
  ],
  programme_manager: [
    "dashboard.view",
    "retreats.view",
    "retreats.create",
    "retreats.edit",
    "events.view",
    "events.create",
    "events.edit",
    "members.view",
    "communications.view",
    "communications.create",
    "applications.view",
  ],
  reviewer: [
    "dashboard.view",
    "applications.view",
    "applications.approve",
    "applications.edit",
  ],
  finance: [
    "dashboard.view",
    "payments.view",
    "payments.create",
    "payments.edit",
    "payments.export",
    "reports.view",
    "reports.export",
    "applications.view",
  ],
  content_editor: [
    "dashboard.view",
    "content.view",
    "content.create",
    "content.edit",
    "content.publish",
  ],
  communications: [
    "dashboard.view",
    "communications.view",
    "communications.create",
    "communications.edit",
    "members.view",
    "patrons.view",
  ],
  read_only: [
    "dashboard.view",
    "applications.view",
    "retreats.view",
    "events.view",
    "members.view",
    "patrons.view",
    "content.view",
    "reports.view",
  ],
  none: [],
};

/** Preferred system roles selectable on /access (never auto-granted). */
export function requestableSystemRoles(): SystemRoleDefinition[] {
  return SYSTEM_ROLES.filter((r) => r.requestable && r.cmsAccess);
}

/** @deprecated use requestableSystemRoles */
export function requestableRoles() {
  return requestableSystemRoles();
}

export function roleBySlug(slug: string): SystemRoleDefinition | undefined {
  return SYSTEM_ROLES.find((r) => r.slug === slug);
}

export function roleHasPermission(
  role: SystemRoleSlug,
  permission: PermissionKey,
): boolean {
  const grants = ROLE_PERMISSIONS[role] ?? [];
  if (grants.includes("*")) return true;
  if (grants.includes(permission)) return true;
  return false;
}

export function anyRoleHasPermission(
  roles: SystemRoleSlug[],
  permission: PermissionKey,
): boolean {
  return roles.some((r) => roleHasPermission(r, permission));
}

export const DEPARTMENTS = [
  { slug: "executive_office", name: "Executive Office" },
  { slug: "founding_team", name: "Founding Team" },
  { slug: "retreat_operations", name: "Retreat Operations" },
  { slug: "finance", name: "Finance" },
  { slug: "community", name: "Community" },
  { slug: "marketing", name: "Marketing" },
  { slug: "advisory_council", name: "Advisory Council" },
  { slug: "patron_circle", name: "Patron Circle" },
  { slug: "volunteers", name: "Volunteers" },
] as const;

/** Matrix summary for Team & Access UI */
export const PERMISSION_MATRIX: {
  role: SystemRoleSlug;
  applications: string;
  payments: string;
  content: string;
  users: string;
  settings: string;
}[] = [
  {
    role: "super_administrator",
    applications: "Full",
    payments: "Full",
    content: "Full",
    users: "Full",
    settings: "Full",
  },
  {
    role: "administrator",
    applications: "Full",
    payments: "View",
    content: "Publish",
    users: "View",
    settings: "None",
  },
  {
    role: "programme_manager",
    applications: "View",
    payments: "None",
    content: "None",
    users: "None",
    settings: "None",
  },
  {
    role: "reviewer",
    applications: "Review",
    payments: "None",
    content: "None",
    users: "None",
    settings: "None",
  },
  {
    role: "finance",
    applications: "View limited",
    payments: "Full",
    content: "None",
    users: "None",
    settings: "None",
  },
  {
    role: "content_editor",
    applications: "None",
    payments: "None",
    content: "Publish",
    users: "None",
    settings: "None",
  },
  {
    role: "communications",
    applications: "None",
    payments: "None",
    content: "None",
    users: "None",
    settings: "None",
  },
  {
    role: "read_only",
    applications: "View",
    payments: "None",
    content: "View",
    users: "None",
    settings: "None",
  },
];
