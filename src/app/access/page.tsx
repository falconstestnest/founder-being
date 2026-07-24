"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import {
  requestableSystemRoles,
  type SystemRoleSlug,
} from "@/lib/iam/roles";

export default function AccessRequestPage() {
  const roles = requestableSystemRoles();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<SystemRoleSlug[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function toggle(slug: SystemRoleSlug) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (selected.length === 0) {
      setError("Select at least one preferred role.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/iam/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          preferredRoles: selected,
          note: note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed.");
        return;
      }
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-fb-text">
      <div className="mx-auto max-w-xl px-6 py-16">
        <Link href="/" className="inline-flex">
          <Logo variant="nav-white" height={28} />
        </Link>
        <p className="mt-12 font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
          Access
        </p>
        <h1 className="mt-3 font-serif text-4xl">Request access</h1>
        <p className="mt-4 text-sm leading-relaxed text-fb-body">
          Founder-Being administration is invite- and approval-only. This form is
          a request, not registration. Preferred system roles never grant access
          automatically—an authorised administrator must approve and assign final
          permissions.
        </p>

        {done ? (
          <div className="mt-12 border border-white/10 p-8">
            <h2 className="font-serif text-2xl">Request received</h2>
            <p className="mt-4 text-sm text-fb-body">
              Thank you. If approved, you will receive next steps by email. Your
              preferred role is a request only—final permissions are assigned by
              Super Administrator.
            </p>
            <Link href="/" className="btn btn-secondary mt-8 inline-flex">
              Back home
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
                Full name
              </span>
              <input
                className="field mt-2"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
                Email
              </span>
              <input
                className="field mt-2"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <fieldset>
              <legend className="font-mono text-xs uppercase tracking-wider text-fb-meta">
                Preferred role(s) — select up to 3
              </legend>
              <ul className="mt-4 space-y-3">
                {roles.map((r) => {
                  const on = selected.includes(r.slug);
                  return (
                    <li key={r.slug}>
                      <label
                        className={`flex cursor-pointer gap-3 border p-4 transition-colors ${
                          on
                            ? "border-[#FFAB33]/50 bg-[#FFAB33]/05"
                            : "border-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 accent-[#FFAB33]"
                          checked={on}
                          onChange={() => toggle(r.slug)}
                        />
                        <span>
                          <span className="block text-sm font-medium text-white">
                            {r.name}
                          </span>
                          <span className="mt-1 block text-xs text-fb-meta">
                            {r.description}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <label className="block">
              <span className="font-mono text-xs uppercase tracking-wider text-fb-meta">
                Note (optional)
              </span>
              <textarea
                className="field mt-2 min-h-[100px] resize-y"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                placeholder="How you relate to Founder-Being…"
              />
            </label>

            {error && (
              <p className="text-sm text-red-300" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit access request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
