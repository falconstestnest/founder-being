import { redirect } from "next/navigation";
import {
  outcomePathForState,
  resolveWorkspaceSession,
  safeWorkspaceNext,
} from "@/lib/iam/workspaceSession";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

/**
 * Stable post-auth hub.
 * Resolves once, then sends to authorized home or a dedicated outcome page.
 * Does not re-render fallback UI here (avoids loops with guards).
 */
export default async function WorkspaceResolverPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const session = await resolveWorkspaceSession();

  if (session.state === "authenticated_and_authorized" && session.path) {
    const deep = safeWorkspaceNext(
      next,
      session.path,
      session.profile?.isSuperAdmin ?? false,
    );
    redirect(deep || session.path);
  }

  redirect(outcomePathForState(session.state));
}
