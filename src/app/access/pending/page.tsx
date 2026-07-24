import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { resolveWorkspaceSession } from "@/lib/iam/workspaceSession";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Access pending",
  robots: { index: false, follow: false },
};

/**
 * Authenticated but profile inactive / missing / role not yet assigned.
 * Dedicated page — avoids redirect loops with /workspace.
 */
export default async function AccessPendingPage() {
  const session = await resolveWorkspaceSession();

  if (session.state === "unauthenticated") {
    redirect("/login?next=/access/pending");
  }
  if (session.state === "authenticated_and_authorized" && session.path) {
    redirect(session.path);
  }
  if (session.state === "mfa_required") {
    redirect("/security/setup");
  }
  if (session.state === "access_suspended") {
    redirect("/forbidden?reason=suspended");
  }

  const title =
    session.state === "role_missing"
      ? "Access is awaiting approval"
      : "Your workspace is being prepared";
  const body =
    session.state === "role_missing"
      ? "Your account is active, but a workspace has not yet been assigned."
      : "Your account is signed in, but your Founder-Being profile has not yet been activated. Please contact the Founder-Being team.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-fb-text">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex" aria-label="Founder-Being home">
          <Logo variant="nav-white" height={28} />
        </Link>
        <p className="mt-12 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-fb-meta">
          Access
        </p>
        <h1 className="type-h1 mt-3">{title}</h1>
        <p className="section-lead mt-4">{body}</p>
        {session.profile?.email && (
          <p className="mt-6 text-sm text-fb-secondary">
            Signed in as{" "}
            <span className="text-fb-text">{session.profile.email}</span>
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/access" className="btn btn-secondary">
            Request access
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
