"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";

function SignInForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "";
  const configError = search.get("error") === "auth_not_configured";
  const callbackError = search.get("error") === "auth_callback";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(
    configError
      ? "Secure access is not configured yet. Please contact the Founder-Being team."
      : callbackError
        ? "We couldn't complete sign-in. Please try again."
        : "",
  );
  const [loading, setLoading] = useState(false);

  async function afterAuth() {
    // Always resolve through one stable /workspace entry — never embed role routes in auth.
    // The server re-checks authorization; client path is routing only.
    const qs = next ? `?next=${encodeURIComponent(next)}` : "";
    router.replace(`/workspace${qs}`);
    router.refresh();
  }

  async function signInPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError(err.message);
        return;
      }
      await afterAuth();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't sign you in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function signInMagic(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/login/callback?next=${encodeURIComponent(next || "/workspace")}`,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      setMessage("Check your email for a magic link.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't send a magic link.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function signInGoogle() {
    setLoading(true);
    setError("");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/login/callback?next=${encodeURIComponent(next || "/workspace")}`,
        },
      });
      if (err) setError(err.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-fb-text">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex" aria-label="Founder-Being home">
          <Logo variant="nav-white" height={28} />
        </Link>

        <h1 className="type-h1 mt-12">Welcome back</h1>
        <p className="section-lead mt-4">
          Continue your Founder-Being journey. Sign in to access your personal
          workspace, applications, gatherings and community updates.
        </p>

        <div className="mt-8 flex gap-2">
          <button
            type="button"
            className={`btn flex-1 ${mode === "password" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setMode("password")}
          >
            Password
          </button>
          <button
            type="button"
            className={`btn flex-1 ${mode === "magic" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setMode("magic")}
          >
            Magic link
          </button>
        </div>

        <form
          onSubmit={mode === "password" ? signInPassword : signInMagic}
          className="mt-6 space-y-4 border border-white/10 bg-[#131313] p-6"
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
          {mode === "password" && (
            <label className="block">
              <span className="field-label">Password</span>
              <input
                className="field"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="field-success" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading || configError}
          >
            {loading
              ? "Please wait…"
              : mode === "password"
                ? "Sign in"
                : "Email me a magic link"}
          </button>

          <button
            type="button"
            className="btn btn-secondary w-full"
            disabled={loading || configError}
            onClick={() => void signInGoogle()}
          >
            Continue with Google
          </button>

          {mode === "password" && (
            <p className="text-center type-small">
              <Link href="/login/forgot-password" className="link-inline">
                Forgot your password?
              </Link>
            </p>
          )}
        </form>

        <p className="mt-8 text-center type-small">
          Need access?{" "}
          <Link href="/access" className="link-inline">
            Request access
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-fb-meta">
          Secure access for members, patrons, volunteers, reviewers and the
          Founder-Being team.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] text-fb-meta">
          Loading…
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
