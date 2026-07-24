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
 * MFA setup shell — privileged roles land here when mfa_required.
 * Full authenticator enrollment ships with OS v0.2 security gate.
 */
export default async function WorkspaceSecurityPage() {
  const session = await resolveWorkspaceSession();

  if (session.state === "unauthenticated") {
    redirect("/login?next=/workspace/security");
  }

  if (session.state === "authenticated_and_authorized") {
    redirect(session.path || "/workspace");
  }

  if (session.state !== "mfa_required") {
    redirect(`/workspace?state=${session.state}`);
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
          Authenticator enrollment will complete here once the security gate is
          live.
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
          <Link href="/workspace" className="btn btn-secondary">
            Back
          </Link>
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
