"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/login/callback?next=${encodeURIComponent("/login/reset-password")}`,
      });
      if (err) {
        setError(err.message);
        return;
      }
      // Always show success — never reveal whether the email exists
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't send a reset link. Please try again.",
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

        <h1 className="type-h1 mt-12">Forgot your password?</h1>
        <p className="section-lead mt-4">
          Enter your email and we&apos;ll send you a secure reset link.
        </p>

        {sent ? (
          <div className="mt-8 border border-white/10 bg-[#131313] p-6">
            <h2 className="font-serif text-xl">Check your email</h2>
            <p className="mt-3 text-sm text-fb-body">
              If an account exists for that address, you will receive a secure
              password reset link shortly. The link expires for your security.
            </p>
            <Link href="/login" className="btn btn-secondary mt-6 inline-flex">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-4 border border-white/10 bg-[#131313] p-6"
          >
            <label className="block">
              <span className="field-label">Email</span>
              <input
                className="field"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Please wait…" : "Send reset link"}
            </button>
            <p className="text-center type-small">
              <Link href="/login" className="link-inline">
                Back to sign in
              </Link>
            </p>
          </form>
        )}

        <p className="mt-8 text-center type-small text-fb-meta">
          Prefer passwordless?{" "}
          <Link href="/login" className="link-inline">
            Use a magic link on Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
