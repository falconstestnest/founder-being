"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 10) {
      setError("Use at least 10 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message);
        return;
      }
      setDone(true);
      // After password change, land on workspace resolver
      setTimeout(() => {
        router.replace("/workspace");
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't update your password. Request a new reset link.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-fb-text">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex" aria-label="Founder-Being home">
          <Logo variant="nav-white" height={28} />
        </Link>

        <h1 className="type-h1 mt-12">Choose a new password</h1>
        <p className="section-lead mt-4">
          Set a strong password for your Founder-Being account. You will then
          continue to your workspace.
        </p>

        {done ? (
          <div className="mt-8 border border-white/10 bg-[#131313] p-6">
            <p className="text-sm text-fb-body">
              Password updated. Taking you to your workspace…
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-4 border border-white/10 bg-[#131313] p-6"
          >
            <label className="block">
              <span className="field-label">New password</span>
              <input
                className="field"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="field-label">Confirm password</span>
              <input
                className="field"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Please wait…" : "Update password"}
            </button>
            <p className="text-center type-small">
              <Link href="/login/forgot-password" className="link-inline">
                Request a new reset link
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
