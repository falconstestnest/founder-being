import Link from "next/link";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Access denied",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ reason?: string }>;
};

/**
 * Clear 403-style page for authenticated users lacking permission,
 * or suspended accounts. Better than unexplained redirects.
 */
export default async function ForbiddenPage({ searchParams }: PageProps) {
  const { reason } = await searchParams;
  const suspended = reason === "suspended";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-fb-text">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex" aria-label="Founder-Being home">
          <Logo variant="nav-white" height={28} />
        </Link>
        <p className="mt-12 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-fb-meta">
          403
        </p>
        <h1 className="type-h1 mt-3">
          {suspended
            ? "Workspace access is currently unavailable"
            : "You do not have access to this page"}
        </h1>
        <p className="section-lead mt-4">
          {suspended
            ? "Please contact the Founder-Being team for assistance."
            : "If you believe this is a mistake, contact the Founder-Being team or return to your workspace."}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {!suspended && (
            <Link href="/workspace" className="btn btn-primary">
              Go to my workspace
            </Link>
          )}
          <Link href="/" className="btn btn-secondary">
            Home
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
