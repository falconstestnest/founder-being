import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { resolveWorkspaceSession } from "@/lib/iam/workspaceSession";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Security setup",
  robots: { index: false, follow: false },
};

/**
 * MFA required for privileged roles.
 * Dedicated path — not nested under /workspace to avoid resolver loops.
 */
export default async function SecuritySetupPage() {
  const session = await resolveWorkspaceSession();

  if (session.state === "unauthenticated") {
    redirect("/login?next=/security/setup");
  }
  if (session.state === "authenticated_and_authorized" && session.path) {
    redirect(session.path);
  }
  if (
    session.state === "profile_missing" ||
    session.state === "profile_inactive" ||
    session.state === "role_missing"
  ) {
    redirect("/access/pending");
  }
  if (session.state === "access_suspended") {
    redirect("/forbidden?reason=suspended");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-fb-text">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex" aria-label="Founder-Being home">
          <Logo variant="nav-white" height={28} />
        </Link>
        <h1 className="type-h1 mt-12">Complete your security setup</h1>
        <p className="section-lead mt-4">
          Your role requires multi-factor authentication before you can continue.
          Authenticator enrollment completes here once the security gate is live.
        </p>
        <div className="mt-8 border border-white/10 bg-[#131313] p-6 text-sm text-fb-secondary">
          <p>
            Contact the Founder-Being team if you need MFA enabled on your
            account for immediate access.
          </p>
          {session.profile?.email && (
            <p className="mt-4 font-mono text-xs text-fb-meta">
              {session.profile.email}
            </p>
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <form action="/admin/logout" method="post">
            <button type="submit" className="btn btn-secondary">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
