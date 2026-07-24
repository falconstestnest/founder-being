/**
 * Founder-Being IAM — role hierarchy and permission matrix.
 * Permissions are data (not hardcoded only in UI). Super Admin = *.
 */

export const ROLE_SLUGS = [
  "super_administrator",
  "co_founder",
  "founding_team",
  "patron",
  "programme_lead",
  "finance",
  "reviewer",
  "operations",
  "volunteer",
  "member",
  "guest",
] as const;

export type RoleSlug = (typeof ROLE_SLUGS)[number];

/** Higher index = lower privilege (for inheritance / display). */
export const ROLE_RANK: Record<RoleSlug, number> = {
  super_administrator: 0,
  co_founder: 1,
  founding_team: 2,
  patron: 3,
  programme_lead: 4,
  finance: 5,
  reviewer: 6,
  operations: 7,
  volunteer: 8,
  member: 9,
  guest: 10,
};

export type RoleDefinition = {
  slug: RoleSlug;
  name: string;
  description: string;
  /** Shown on access-request signup as selectable preferred role */
  requestable: boolean;
  mfaRequired: boolean;
  cmsAccess: boolean;
  portalOnly: boolean;
};

export const ROLES: RoleDefinition[] = [
  {
    slug: "super_administrator",
    name: "Super Administrator",
    description: "Full system access. Protected ownership.",
    requestable: false,
    mfaRequired: true,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "co_founder",
    name: "Co-Founder",
    description: "Operational leadership across programmes and community.",
    requestable: true,
    mfaRequired: true,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "founding_team",
    name: "Founding Team",
    description: "Leadership team: events, founders, content, communications.",
    requestable: true,
    mfaRequired: true,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "patron",
    name: "Patron",
    description: "Founding Patron Circle — read-only portal access.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: false,
    portalOnly: true,
  },
  {
    slug: "programme_lead",
    name: "Programme Lead",
    description: "Retreats, gatherings, attendees, schedules.",
    requestable: true,
    mfaRequired: true,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "finance",
    name: "Finance",
    description: "Payments, refunds, invoices, reports only.",
    requestable: true,
    mfaRequired: true,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "reviewer",
    name: "Reviewer",
    description: "Review and decide on founder applications.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "operations",
    name: "Operations",
    description: "Logistics, travel, rooms, participants.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "volunteer",
    name: "Volunteer",
    description: "Limited access, often scoped to a specific retreat.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: true,
    portalOnly: false,
  },
  {
    slug: "member",
    name: "Member",
    description: "Portal only — no CMS.",
    requestable: true,
    mfaRequired: false,
    cmsAccess: false,
    portalOnly: true,
  },
  {
    slug: "guest",
    name: "Guest",
    description: "Invitation-only, read-only access.",
    requestable: false,
    mfaRequired: false,
    cmsAccess: false,
    portalOnly: true,
  },
];

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

/** Explicit grants per role (Super Admin = *). */
export const ROLE_PERMISSIONS: Record<RoleSlug, PermissionKey[]> = {
  super_administrator: ["*"],
  co_founder: [
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
  ],
  founding_team: [
    "dashboard.view",
    "applications.view",
    "applications.approve",
    "events.view",
    "events.create",
    "events.edit",
    "members.view",
    "communications.view",
    "communications.create",
    "content.view",
    "content.edit",
    "retreats.view",
  ],
  patron: ["dashboard.view", "patrons.view", "events.view", "content.view"],
  programme_lead: [
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
  reviewer: [
    "dashboard.view",
    "applications.view",
    "applications.approve",
    "applications.edit",
  ],
  operations: [
    "dashboard.view",
    "retreats.view",
    "retreats.edit",
    "events.view",
    "members.view",
    "communications.view",
    "communications.create",
  ],
  volunteer: ["dashboard.view", "retreats.view", "events.view", "members.view"],
  member: ["dashboard.view", "events.view", "content.view"],
  guest: ["dashboard.view", "content.view"],
};

export function roleBySlug(slug: string): RoleDefinition | undefined {
  return ROLES.find((r) => r.slug === slug);
}

export function requestableRoles(): RoleDefinition[] {
  return ROLES.filter((r) => r.requestable);
}

export function roleHasPermission(
  role: RoleSlug,
  permission: PermissionKey,
): boolean {
  const grants = ROLE_PERMISSIONS[role] ?? [];
  if (grants.includes("*")) return true;
  if (grants.includes(permission)) return true;
  const [cat, action] = permission.split(".") as [
    PermissionCategory,
    PermissionAction,
  ];
  if (grants.includes(`${cat}.*` as PermissionKey)) return true;
  if (action && grants.includes(`*.${action}` as PermissionKey)) return true;
  return false;
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
