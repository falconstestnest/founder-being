"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const configError = search.get("error") === "auth_not_configured";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(
    configError
      ? "Authentication is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
      : "",
  );
  const [loading, setLoading] = useState(false);

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
      router.replace(next);
      router.refresh();
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
          emailRedirectTo: `${origin}/admin/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      setMessage("Check your email for a magic link.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't send a magic link.",
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
          redirectTo: `${origin}/admin/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) setError(err.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Google sign-in failed.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-[#F8F8F8]">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex">
          <Logo variant="nav-white" height={28} />
        </Link>
        <p className="mt-10 font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
          Operations
        </p>
        <h1 className="mt-3 font-serif text-3xl md:text-4xl">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#E8E8EC]">
          Founder-Being console access is invite-only. Authentication alone is
          not enough—you also need an active profile and system role.
        </p>

        <div className="mt-8 flex gap-2">
          <button
            type="button"
            className={`admin-btn flex-1 ${mode === "password" ? "admin-btn-primary" : ""}`}
            onClick={() => setMode("password")}
          >
            Password
          </button>
          <button
            type="button"
            className={`admin-btn flex-1 ${mode === "magic" ? "admin-btn-primary" : ""}`}
            onClick={() => setMode("magic")}
          >
            Magic link
          </button>
        </div>

        <form
          onSubmit={mode === "password" ? signInPassword : signInMagic}
          className="mt-6 space-y-4 rounded-lg border border-[#222] bg-[#131313] p-6"
        >
          <label className="block">
            <span className="text-xs text-[#A8A8B2]">Email</span>
            <input
              className="field mt-2"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {mode === "password" && (
            <label className="block">
              <span className="text-xs text-[#A8A8B2]">Password</span>
              <input
                className="field mt-2"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}

          {error && (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-[#FFAB33]" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="admin-btn admin-btn-primary w-full"
            disabled={loading || configError}
          >
            {loading
              ? "Please wait…"
              : mode === "password"
                ? "Sign in"
                : "Send magic link"}
          </button>

          <button
            type="button"
            className="admin-btn w-full"
            disabled={loading || configError}
            onClick={() => void signInGoogle()}
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#A8A8B2]">
          Need access?{" "}
          <Link href="/access" className="text-[#E8E8EC] underline-offset-4 hover:underline">
            Request access
          </Link>
          {" · "}
          <Link href="/" className="text-[#E8E8EC] underline-offset-4 hover:underline">
            Public site
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] text-[#A8A8B2]">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
