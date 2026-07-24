/**
 * Local IAM store — ONLY when ALLOW_LOCAL_IAM=1 and not production.
 * Never used as a production security boundary.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { SUPER_ADMIN, allowLocalIamFallback } from "@/lib/iam/constants";
import type { SystemRoleSlug } from "@/lib/iam/roles";

const DATA_DIR = path.join(process.cwd(), ".data");
const REQUESTS_FILE = path.join(DATA_DIR, "access-requests.json");
const INVITES_FILE = path.join(DATA_DIR, "invitations.json");

export type AccessRequestStatus =
  | "submitted"
  | "under_review"
  | "pending"
  | "approved"
  | "rejected"
  | "withdrawn"
  | "expired";

export type AccessRequest = {
  id: string;
  fullName: string;
  email: string;
  preferredRoles: SystemRoleSlug[];
  note?: string;
  status: AccessRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  assignedRole?: SystemRoleSlug;
};

export type Invitation = {
  id: string;
  email: string;
  fullName: string;
  roleSlug: SystemRoleSlug;
  departmentSlug?: string;
  note?: string;
  token: string;
  status: "pending" | "accepted" | "expired" | "revoked" | "cancelled";
  createdAt: string;
  invitedBy: string;
  expiresAt: string;
};

export type TeamMember = {
  id: string;
  fullName: string;
  email: string;
  roleSlug: SystemRoleSlug;
  relationshipSlug?: string;
  status: "active" | "invited" | "pending" | "deactivated";
  lastLoginAt: string | null;
  mfaEnabled: boolean;
  createdAt: string;
  protected?: boolean;
};

function assertLocalAllowed() {
  if (!allowLocalIamFallback()) {
    throw new Error("Local IAM store is disabled.");
  }
}

async function ensureDir() {
  assertLocalAllowed();
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  assertLocalAllowed();
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function listAccessRequests(): Promise<AccessRequest[]> {
  return readJson(REQUESTS_FILE, []);
}

export async function saveAccessRequest(
  req: Omit<AccessRequest, "id" | "createdAt" | "status">,
): Promise<AccessRequest> {
  const list = await listAccessRequests();
  const existing = list.find(
    (r) =>
      r.email.toLowerCase() === req.email.toLowerCase() &&
      (r.status === "pending" ||
        r.status === "submitted" ||
        r.status === "under_review"),
  );
  if (existing) {
    throw new Error("A pending request already exists for this email.");
  }
  const row: AccessRequest = {
    ...req,
    id: crypto.randomUUID(),
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
  list.unshift(row);
  await writeJson(REQUESTS_FILE, list);
  return row;
}

export async function updateAccessRequest(
  id: string,
  patch: Partial<AccessRequest>,
): Promise<AccessRequest | null> {
  const list = await listAccessRequests();
  const i = list.findIndex((r) => r.id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch };
  await writeJson(REQUESTS_FILE, list);
  return list[i];
}

export async function listInvitations(): Promise<Invitation[]> {
  return readJson(INVITES_FILE, []);
}

export async function saveInvitation(
  inv: Omit<Invitation, "id" | "createdAt" | "status" | "token" | "expiresAt"> & {
    expiresInHours?: number;
  },
): Promise<Invitation> {
  const list = await listInvitations();
  const hours = inv.expiresInHours ?? 72;
  const row: Invitation = {
    id: crypto.randomUUID(),
    email: inv.email,
    fullName: inv.fullName,
    roleSlug: inv.roleSlug,
    departmentSlug: inv.departmentSlug,
    note: inv.note,
    token: crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, ""),
    status: "pending",
    createdAt: new Date().toISOString(),
    invitedBy: inv.invitedBy,
    expiresAt: new Date(Date.now() + hours * 3600e3).toISOString(),
  };
  list.unshift(row);
  await writeJson(INVITES_FILE, list);
  return row;
}

export async function listTeamMembers(): Promise<TeamMember[]> {
  const requests = await listAccessRequests();
  const invites = await listInvitations();

  const members: TeamMember[] = [
    {
      id: "super-admin",
      fullName: SUPER_ADMIN.fullName,
      email: SUPER_ADMIN.email,
      roleSlug: "super_administrator",
      relationshipSlug: "co_founder",
      status: "active",
      lastLoginAt: null,
      mfaEnabled: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      protected: true,
    },
  ];

  for (const inv of invites.filter((i) => i.status === "pending")) {
    members.push({
      id: `invite-${inv.id}`,
      fullName: inv.fullName,
      email: inv.email,
      roleSlug: inv.roleSlug,
      status: "invited",
      lastLoginAt: null,
      mfaEnabled: false,
      createdAt: inv.createdAt,
    });
  }

  for (const req of requests.filter(
    (r) =>
      r.status === "pending" ||
      r.status === "submitted" ||
      r.status === "under_review",
  )) {
    members.push({
      id: `request-${req.id}`,
      fullName: req.fullName,
      email: req.email,
      roleSlug: req.preferredRoles[0] ?? "read_only",
      status: "pending",
      lastLoginAt: null,
      mfaEnabled: false,
      createdAt: req.createdAt,
    });
  }

  for (const req of requests.filter(
    (r) => r.status === "approved" && r.assignedRole,
  )) {
    if (members.some((m) => m.email.toLowerCase() === req.email.toLowerCase())) {
      continue;
    }
    members.push({
      id: `approved-${req.id}`,
      fullName: req.fullName,
      email: req.email,
      roleSlug: req.assignedRole!,
      status: "active",
      lastLoginAt: null,
      mfaEnabled: false,
      createdAt: req.createdAt,
    });
  }

  return members;
}
