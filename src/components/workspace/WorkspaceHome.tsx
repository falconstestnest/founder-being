import Link from "next/link";
import {
  AttentionCards,
  CaughtUp,
  type AttentionCard,
} from "@/components/workspace/AttentionCards";
import { firstName, timeGreeting } from "@/lib/iam/greeting";
import type { WorkspaceDef } from "@/lib/iam/workspaces";

export function WorkspaceHome({
  workspace,
  fullName,
  cards,
  actions,
  children,
}: {
  workspace: WorkspaceDef;
  fullName: string;
  cards: AttentionCard[];
  actions?: { href: string; label: string; primary?: boolean }[];
  children?: React.ReactNode;
}) {
  const name = firstName(fullName);
  const greet = timeGreeting();

  return (
    <>
      <header className="mb-8">
        <h1 className="admin-greeting">
          {greet}, {name}.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--admin-muted)]">
          Here is what needs your attention today.
        </p>
      </header>

      <AttentionCards cards={cards} />

      {actions && actions.length > 0 && (
        <section className="mt-10" aria-label="Quick actions">
          <h2 className="admin-section-title">Quick actions</h2>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <Link
                key={a.href + a.label}
                href={a.href}
                className={`admin-btn ${a.primary ? "admin-btn-primary" : ""}`}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10" aria-label="Priorities">
        <h2 className="admin-section-title">Today&apos;s attention</h2>
        <CaughtUp />
      </section>

      {children}
    </>
  );
}
