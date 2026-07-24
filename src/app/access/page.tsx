"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { trackCta } from "@/lib/analytics/cta";
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
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
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
    if (!privacyConsent) {
      setError("Please confirm privacy consent to continue.");
      return;
    }
    setSubmitting(true);
    void trackCta("cta_started", {
      cta_name: "request_access",
      source_page: "/access",
      authenticated: false,
    });
    try {
      const res = await fetch("/api/iam/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          preferredRoles: selected,
          note: note || undefined,
          privacyConsent: true,
          website: website || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        void trackCta("cta_failed", {
          cta_name: "request_access",
          source_page: "/access",
          error_code: String(res.status),
        });
        setError(data.error || "Request failed.");
        return;
      }
      void trackCta("cta_completed", {
        cta_name: "request_access",
        source_page: "/access",
      });
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
            <h2 className="font-serif text-2xl">Your request has been received</h2>
            <p className="mt-4 text-sm text-fb-body">
              Access is reviewed manually. Submitting a request does not create
              an account or grant access. We&apos;ll contact you if further
              information is needed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-secondary inline-flex">
                Back home
              </Link>
              <Link href="/login" className="btn btn-secondary inline-flex">
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            {/* Honeypot */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden>
              <label>
                Website
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

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

            <label className="flex cursor-pointer gap-3 text-sm text-fb-body">
              <input
                type="checkbox"
                className="mt-1 accent-[#FFAB33]"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                required
              />
              <span>
                I understand this is a request only, and I agree to Founder-Being
                processing my details for access review in line with the{" "}
                <Link href="/privacy" className="link-inline">
                  Privacy Policy
                </Link>
                .
              </span>
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
