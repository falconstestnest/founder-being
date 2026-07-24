import Link from "next/link";
import { SUPER_ADMIN } from "@/lib/iam/constants";
import { ROLE_PERMISSIONS, roleBySlug } from "@/lib/iam/roles";

type PageProps = { params: Promise<{ userId: string }> };

const tabs = [
  "Overview",
  "Permissions",
  "Activity",
  "Sessions",
  "Audit Log",
  "Devices",
  "Security",
  "Notes",
] as const;

export default async function TeamMemberPage({ params }: PageProps) {
  const { userId } = await params;
  const isSuper = userId === "super-admin";
  const name = isSuper ? SUPER_ADMIN.fullName : "Team member";
  const email = isSuper ? SUPER_ADMIN.email : "—";
  const role = isSuper
    ? roleBySlug("super_administrator")
    : roleBySlug("reviewer");
  const perms = ROLE_PERMISSIONS[role?.slug ?? "none"] ?? [];

  return (
    <div>
      <Link
        href="/admin/team"
        className="text-sm text-[var(--admin-muted)] hover:text-white"
      >
        ← Team & Access
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="admin-page-title">{name}</h1>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">{email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="admin-badge">{role?.name}</span>
            {isSuper && <span className="admin-badge">Protected</span>}
            <span className="admin-badge">Active</span>
          </div>
        </div>
        {!isSuper && (
          <button type="button" className="admin-btn" disabled>
            Deactivate (requires auth)
          </button>
        )}
      </div>

      {isSuper && (
        <p className="mt-6 max-w-2xl text-sm text-[var(--admin-muted)]">
          Super Administrator cannot be removed from the system through the UI.
          Ownership changes require another Super Administrator.
        </p>
      )}

      <div
        className="mt-10 flex flex-wrap gap-1 border-b border-[var(--admin-border)]"
        role="tablist"
        aria-label="Profile sections"
      >
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={i === 0}
            className="admin-nav-link rounded-none border-b-2 border-transparent px-3 py-2 data-[active=true]:border-[var(--admin-gold)]"
            data-active={i === 0}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="admin-card">
          <h2 className="admin-section-title">Overview</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--admin-muted)]">Role</dt>
              <dd>{role?.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--admin-muted)]">MFA required</dt>
              <dd>{role?.mfaRequired ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--admin-muted)]">CMS access</dt>
              <dd>{role?.cmsAccess ? "Yes" : "Portal only"}</dd>
            </div>
          </dl>
        </article>

        <article className="admin-card">
          <h2 className="admin-section-title">Permissions</h2>
          <ul className="max-h-64 space-y-1 overflow-y-auto font-mono text-xs text-[var(--admin-muted)]">
            {perms.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </article>

        <article className="admin-card lg:col-span-2">
          <h2 className="admin-section-title">Sessions · Security · Audit</h2>
          <p className="admin-empty">
            Device sessions, trusted devices, and immutable audit history connect
            when Supabase Auth is enabled. Every login, role change, export, and
            approval will appear here.
          </p>
        </article>
      </div>
    </div>
  );
}
