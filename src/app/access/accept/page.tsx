import Link from "next/link";
import { Logo } from "@/components/Logo";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AcceptInvitePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-fb-text">
      <div className="mx-auto max-w-lg px-6 py-16">
        <Link href="/" className="inline-flex">
          <Logo variant="nav-white" height={28} />
        </Link>
        <p className="mt-12 font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
          Invitation
        </p>
        <h1 className="mt-3 font-serif text-4xl">Accept invite</h1>
        <p className="mt-4 text-sm leading-relaxed text-fb-body">
          {token
            ? "Your invitation token was received. Password setup and MFA enrollment will complete when Supabase Auth is connected."
            : "This invitation link is missing a token. Ask your Super Administrator to resend the invite."}
        </p>
        {token && (
          <p className="mt-6 font-mono text-xs text-fb-meta break-all">
            Token: {token.slice(0, 8)}…
          </p>
        )}
        <ol className="mt-10 space-y-3 text-sm text-fb-text">
          <li>1. Verify email</li>
          <li>2. Create password</li>
          <li>3. Enable MFA (required for privileged roles)</li>
          <li>4. Sign in to Operations</li>
        </ol>
        <Link href="/admin" className="btn btn-secondary mt-10 inline-flex">
          Go to Operations
        </Link>
      </div>
    </div>
  );
}
