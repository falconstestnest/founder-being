import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  resolveWorkspaceSession,
  safeWorkspaceNext,
  WORKSPACE_STATE_COPY,
  type WorkspaceResolveState,
} from "@/lib/iam/workspaceSession";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ next?: string; state?: string }>;
};

const KNOWN_STATES = new Set<string>([
  "profile_missing",
  "profile_inactive",
  "role_missing",
  "mfa_required",
  "access_suspended",
  "configuration_missing",
]);

export default async function WorkspaceResolverPage({ searchParams }: PageProps) {
  const { next, state: stateHint } = await searchParams;
  const session = await resolveWorkspaceSession();

  if (session.state === "unauthenticated") {
    redirect("/login?next=/workspace");
  }

  if (session.state === "authenticated_and_authorized" && session.path) {
    const deep = safeWorkspaceNext(
      next,
      session.path,
      session.profile?.isSuperAdmin ?? false,
    );
    redirect(deep || session.path);
  }

  // After redirects, only fallback states remain
  const fallbackState =
    session.state === "profile_missing" ||
    session.state === "profile_inactive" ||
    session.state === "role_missing" ||
    session.state === "mfa_required" ||
    session.state === "access_suspended" ||
    session.state === "configuration_missing"
      ? session.state
      : KNOWN_STATES.has(stateHint ?? "")
        ? (stateHint as keyof typeof WORKSPACE_STATE_COPY)
        : "role_missing";

  const copy = WORKSPACE_STATE_COPY[fallbackState];
  const title = session.title || copy.title;
  const body = session.body || copy.body;
  const state: WorkspaceResolveState = fallbackState;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-fb-text">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex" aria-label="Founder-Being home">
          <Logo variant="nav-white" height={28} />
        </Link>

        <p className="mt-12 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-fb-meta">
          Workspace
        </p>
        <h1 className="type-h1 mt-3">{title}</h1>
        <p className="section-lead mt-4">{body}</p>

        <div className="mt-10 space-y-3 border border-white/10 bg-[#131313] p-6 text-sm text-fb-secondary">
          {session.profile?.email && (
            <p>
              Signed in as{" "}
              <span className="text-fb-text">{session.profile.email}</span>
            </p>
          )}
          <p className="font-mono text-xs text-fb-meta">
            state: {session.state}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {state === "mfa_required" && (
            <Link href="/workspace/security" className="btn btn-primary">
              Set up multi-factor authentication
            </Link>
          )}
          <Link href="/access" className="btn btn-secondary">
            Request access
          </Link>
          <form action="/admin/logout" method="post">
            <button type="submit" className="btn btn-secondary">
              Sign out
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-xs text-fb-meta">
          Need help? Contact the Founder-Being team.
        </p>
      </div>
    </div>
  );
}
