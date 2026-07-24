"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SUPER_ADMIN } from "@/lib/iam/constants";
import { ROLES, type RoleSlug } from "@/lib/iam/roles";

type Member = {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  roleSlug?: RoleSlug;
  status: string;
  lastLoginAt?: string | null;
  last_login_at?: string | null;
  mfaEnabled?: boolean;
  mfa_enabled?: boolean;
  createdAt?: string;
  created_at?: string;
  protected?: boolean;
};

type AccessRequest = {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  preferredRoles?: RoleSlug[];
  preferred_role_slugs?: string[];
  note?: string;
  createdAt?: string;
  created_at?: string;
};

function nameOf(m: Member | AccessRequest) {
  return (
    ("fullName" in m && m.fullName) ||
    ("full_name" in m && m.full_name) ||
    "—"
  );
}

export function TeamAccessClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pending, setPending] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/iam/team");
      const data = await res.json();
      setMembers(data.members ?? []);
      setPending(data.pendingRequests ?? []);
    } catch {
      setError("We couldn't load this information. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const name = nameOf(m).toLowerCase();
      const email = m.email.toLowerCase();
      const q = query.trim().toLowerCase();
      if (q && !name.includes(q) && !email.includes(q)) return false;
      if (filter === "all") return true;
      if (filter === "active") return m.status === "active";
      if (filter === "pending") return m.status === "pending";
      if (filter === "invited") return m.status === "invited";
      if (filter === "role") return true;
      return m.status === filter;
    });
  }, [members, filter, query]);

  async function decide(
    id: string,
    action: "approve" | "reject",
    assignedRole?: string,
  ) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/iam/access-request/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          assignedRole,
          actorEmail: SUPER_ADMIN.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Action failed.");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="admin-primary-row">
        <div>
          <h1 className="admin-page-title">Team & Access</h1>
          <p className="admin-page-desc">
            Identity & Access Management for the Founder-Being institution.
            Invite people, review access requests, assign roles—never a flat
            “Users” list without governance.
          </p>
        </div>
        <Link href="/admin/team/invite" className="admin-btn admin-btn-primary">
          Invite person
        </Link>
      </div>

      {/* IAM KPIs */}
      <section className="admin-kpi-grid" aria-label="Team metrics">
        {[
          { label: "Total people", value: String(members.length) },
          {
            label: "Active",
            value: String(members.filter((m) => m.status === "active").length),
          },
          { label: "Pending requests", value: String(pending.length) },
          {
            label: "Invited",
            value: String(members.filter((m) => m.status === "invited").length),
          },
        ].map((k) => (
          <article key={k.label} className="admin-card">
            <p className="admin-kpi-label">{k.label}</p>
            <p className="admin-kpi-value">{k.value}</p>
          </article>
        ))}
      </section>

      {error && (
        <div
          role="alert"
          className="admin-card text-sm"
          style={{ borderColor: "rgba(248,113,113,0.4)", color: "#fecaca" }}
        >
          {error}
        </div>
      )}

      {/* Pending access requests — Super Admin queue */}
      <section aria-labelledby="pending-heading">
        <h2 id="pending-heading" className="admin-section-title">
          Access requests
        </h2>
        {pending.length === 0 ? (
          <div className="admin-card admin-empty">
            <strong>No pending requests</strong>
            People who request access and select preferred roles will appear
            here for Super Administrator approval.
          </div>
        ) : (
          <ul className="space-y-3">
            {pending.map((req) => {
              const roles =
                req.preferredRoles ??
                (req.preferred_role_slugs as RoleSlug[] | undefined) ??
                [];
              const defaultRole = roles[0] ?? "reviewer";
              return (
                <li key={req.id} className="admin-card">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {nameOf(req)}
                      </p>
                      <p className="mt-1 text-sm text-[var(--admin-muted)]">
                        {req.email}
                      </p>
                      <p className="mt-3 text-xs text-[var(--admin-muted)]">
                        Preferred:{" "}
                        <span className="text-white">
                          {roles
                            .map(
                              (s) =>
                                ROLES.find((r) => r.slug === s)?.name ?? s,
                            )
                            .join(", ") || "—"}
                        </span>
                      </p>
                      {req.note && (
                        <p className="mt-2 text-sm text-[var(--admin-muted)]">
                          {req.note}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="sr-only" htmlFor={`role-${req.id}`}>
                        Assign role
                      </label>
                      <select
                        id={`role-${req.id}`}
                        className="admin-btn"
                        defaultValue={defaultRole}
                        style={{ minHeight: 36 }}
                      >
                        {ROLES.filter((r) => r.slug !== "super_administrator").map(
                          (r) => (
                            <option key={r.slug} value={r.slug}>
                              {r.name}
                            </option>
                          ),
                        )}
                      </select>
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary"
                        disabled={busyId === req.id}
                        onClick={() => {
                          const sel = document.getElementById(
                            `role-${req.id}`,
                          ) as HTMLSelectElement | null;
                          void decide(req.id, "approve", sel?.value);
                        }}
                      >
                        Approve & assign
                      </button>
                      <button
                        type="button"
                        className="admin-btn"
                        disabled={busyId === req.id}
                        onClick={() => void decide(req.id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Directory */}
      <section aria-labelledby="directory-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 id="directory-heading" className="admin-section-title mb-0">
            Directory
          </h2>
          <div className="flex flex-wrap gap-2">
            <input
              className="admin-search-trigger"
              style={{ cursor: "text" }}
              placeholder="Search name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search team"
            />
            <select
              className="admin-btn"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="invited">Invited</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        <div className="admin-card overflow-x-auto p-0">
          {loading ? (
            <div className="p-6 admin-empty">Loading directory…</div>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
                  <th className="px-5 py-3 font-medium">Person</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">2FA</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const roleSlug =
                    m.roleSlug ??
                    (m.email === SUPER_ADMIN.email
                      ? "super_administrator"
                      : "guest");
                  const roleName =
                    ROLES.find((r) => r.slug === roleSlug)?.name ?? roleSlug;
                  const created = m.createdAt ?? m.created_at;
                  const mfa = m.mfaEnabled ?? m.mfa_enabled;
                  return (
                    <tr
                      key={m.id}
                      className="border-b border-[var(--admin-border)] last:border-0"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/team/${m.id}`}
                          className="font-medium text-white hover:underline"
                        >
                          {nameOf(m)}
                        </Link>
                        <p className="text-xs text-[var(--admin-muted)]">
                          {m.email}
                          {(m.protected ||
                            m.email === SUPER_ADMIN.email) && (
                            <span className="admin-badge ml-2">Protected</span>
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[var(--admin-muted)]">
                        {roleName}
                      </td>
                      <td className="px-5 py-4 capitalize text-[var(--admin-muted)]">
                        {m.status}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-[var(--admin-muted)]">
                        {mfa ? "On" : "Off"}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-[var(--admin-muted)]">
                        {created
                          ? new Date(created).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
