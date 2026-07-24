/**
 * Portal entitlements vs system permissions.
 *
 * Institutional relationship may grant a limited *portal* (own data only).
 * It must never unlock operational CMS permissions.
 */

import type { RelationshipSlug } from "@/lib/iam/roles";

/** Explicit portal entitlements — auditable, separate from CMS permissions */
export const PORTAL_ENTITLEMENTS = [
  "patron.portal",
  "founder.portal",
  "volunteer.portal",
  "member.portal",
] as const;

export type PortalEntitlement = (typeof PORTAL_ENTITLEMENTS)[number];

/**
 * Map institutional relationship → portal entitlement only.
 * Never maps to applications.review, payments.manage, users.assign, etc.
 */
export const RELATIONSHIP_PORTAL: Partial<
  Record<RelationshipSlug, PortalEntitlement>
> = {
  patron: "patron.portal",
  member: "founder.portal",
  volunteer: "volunteer.portal",
  guest: "member.portal",
  advisor: "member.portal",
  // co_founder / founding_team_member need system roles for CMS — not portals alone
};

export function portalForRelationship(
  relationship?: string | null,
): PortalEntitlement | null {
  if (!relationship) return null;
  return RELATIONSHIP_PORTAL[relationship as RelationshipSlug] ?? null;
}

export function portalWorkspacePath(
  entitlement: PortalEntitlement,
): "/patron" | "/founder" | "/volunteer" | "/member" {
  switch (entitlement) {
    case "patron.portal":
      return "/patron";
    case "founder.portal":
      return "/founder";
    case "volunteer.portal":
      return "/volunteer";
    case "member.portal":
    default:
      return "/member";
  }
}

/** CMS / system permissions — never granted by relationship alone */
export const SYSTEM_PERMISSION_EXAMPLES = [
  "applications.review",
  "payments.manage",
  "users.assign",
  "events.manage",
  "audit.view",
] as const;
