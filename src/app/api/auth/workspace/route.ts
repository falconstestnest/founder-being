import { NextResponse } from "next/server";
import { resolveWorkspaceSession } from "@/lib/iam/workspaceSession";

/**
 * Routing helper only — not a security boundary.
 * Clients must not treat a returned path as proof of authorization.
 * Every destination still enforces its own guards.
 */
export async function GET() {
  const session = await resolveWorkspaceSession();

  if (session.state === "unauthenticated") {
    return NextResponse.json(
      { state: session.state, path: null, error: "Not authenticated." },
      { status: 401 },
    );
  }

  if (session.state === "configuration_missing") {
    return NextResponse.json(
      {
        state: session.state,
        path: null,
        title: session.title,
        body: session.body,
      },
      { status: 503 },
    );
  }

  if (session.state !== "authenticated_and_authorized") {
    return NextResponse.json(
      {
        state: session.state,
        path: "/workspace",
        title: session.title,
        body: session.body,
        // Always send fallback surfaces through /workspace
        redirect: `/workspace?state=${session.state}`,
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    state: session.state,
    path: session.path,
    workspace: session.workspace?.id ?? null,
    title: session.workspace?.title ?? null,
    redirect: session.path,
  });
}
