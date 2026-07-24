"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SUPER_ADMIN } from "@/lib/iam/constants";
import { DEPARTMENTS, ROLES } from "@/lib/iam/roles";

export default function InvitePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleSlug, setRoleSlug] = useState("reviewer");
  const [departmentSlug, setDepartmentSlug] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/iam/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          roleSlug,
          departmentSlug: departmentSlug || undefined,
          note: note || undefined,
          actorEmail: SUPER_ADMIN.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invite failed.");
        return;
      }
      setResult(data.acceptPath as string);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <Link
        href="/admin/team"
        className="text-sm text-[var(--admin-muted)] hover:text-white"
      >
        ← Team & Access
      </Link>
      <h1 className="admin-page-title mt-4">Invite person</h1>
      <p className="admin-page-desc">
        Invite-only administration. Choose a role carefully—least privilege by
        default. Super Administrator cannot be invited.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5 admin-card">
        <label className="block">
          <span className="admin-kpi-label">Full name</span>
          <input
            className="field mt-2 w-full"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="admin-kpi-label">Email</span>
          <input
            className="field mt-2 w-full"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="admin-kpi-label">Role</span>
          <select
            className="field mt-2 w-full"
            value={roleSlug}
            onChange={(e) => setRoleSlug(e.target.value)}
          >
            {ROLES.filter((r) => r.slug !== "super_administrator").map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="admin-kpi-label">Department (optional)</span>
          <select
            className="field mt-2 w-full"
            value={departmentSlug}
            onChange={(e) => setDepartmentSlug(e.target.value)}
          >
            <option value="">—</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="admin-kpi-label">Note (optional)</span>
          <textarea
            className="field mt-2 min-h-[80px] w-full resize-y"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        {error && (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
        {result && (
          <div className="rounded-md border border-[var(--admin-border)] p-4 text-sm">
            <p className="text-white font-medium">Invitation created</p>
            <p className="mt-2 text-[var(--admin-muted)]">
              Share this accept link (email delivery wires with Supabase Auth
              later):
            </p>
            <a
              className="mt-2 block break-all text-[var(--admin-gold)]"
              href={result}
            >
              {result}
            </a>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Create invite"}
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => router.push("/admin/team")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
