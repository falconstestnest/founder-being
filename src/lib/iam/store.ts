/**
 * Lightweight store for access requests / invitations when Supabase
 * is not configured. Replace with Supabase tables in production.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { SUPER_ADMIN } from "@/lib/iam/constants";
import type { RoleSlug } from "@/lib/iam/roles";

const DATA_DIR = path.join(process.cwd(), ".data");
const REQUESTS_FILE = path.join(DATA_DIR, "access-requests.json");
const INVITES_FILE = path.join(DATA_DIR, "invitations.json");

export type AccessRequest = {
  id: string;
  fullName: string;
  email: string;
  preferredRoles: RoleSlug[];
  note?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  assignedRole?: RoleSlug;
};

export type Invitation = {
  id: string;
  email: string;
  fullName: string;
  roleSlug: RoleSlug;
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
  roleSlug: RoleSlug;
  status: "active" | "invited" | "pending" | "deactivated";
  lastLoginAt: string | null;
  mfaEnabled: boolean;
  createdAt: string;
  protected?: boolean;
};

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
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
      r.status === "pending",
  );
  if (existing) {
    throw new Error("A pending request already exists for this email.");
  }
  const row: AccessRequest = {
    ...req,
    id: crypto.randomUUID(),
    status: "pending",
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
    expiresInDays?: number;
  },
): Promise<Invitation> {
  const list = await listInvitations();
  const days = inv.expiresInDays ?? 7;
  const row: Invitation = {
    id: crypto.randomUUID(),
    email: inv.email,
    fullName: inv.fullName,
    roleSlug: inv.roleSlug,
    departmentSlug: inv.departmentSlug,
    note: inv.note,
    token: crypto.randomUUID().replace(/-/g, ""),
    status: "pending",
    createdAt: new Date().toISOString(),
    invitedBy: inv.invitedBy,
    expiresAt: new Date(Date.now() + days * 864e5).toISOString(),
  };
  list.unshift(row);
  await writeJson(INVITES_FILE, list);
  return row;
}

/** Seed Super Admin + pending requests for Team UI when DB not connected. */
export async function listTeamMembers(): Promise<TeamMember[]> {
  const requests = await listAccessRequests();
  const invites = await listInvitations();

  const members: TeamMember[] = [
    {
      id: "super-admin",
      fullName: SUPER_ADMIN.fullName,
      email: SUPER_ADMIN.email,
      roleSlug: "super_administrator",
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

  for (const req of requests.filter((r) => r.status === "pending")) {
    members.push({
      id: `request-${req.id}`,
      fullName: req.fullName,
      email: req.email,
      roleSlug: req.preferredRoles[0] ?? "guest",
      status: "pending",
      lastLoginAt: null,
      mfaEnabled: false,
      createdAt: req.createdAt,
    });
  }

  for (const req of requests.filter((r) => r.status === "approved" && r.assignedRole)) {
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
