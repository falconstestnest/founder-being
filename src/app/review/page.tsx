import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function ReviewHomePage() {
  const { ctx, workspace } = await requireWorkspace("review");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Reviewer"}
      cards={[
        { label: "Assigned reviews", value: "—" },
        { label: "Pending", value: "—", hint: "In your queue" },
        { label: "Completed", value: "—" },
        { label: "Avg. review time", value: "—" },
      ]}
      actions={[
        { href: "/review/queue", label: "Open review queue", primary: true },
      ]}
    >
      <section className="mt-10 admin-card">
        <h2 className="admin-section-title">Queue</h2>
        <p className="text-sm text-[var(--admin-muted)]">
          You&apos;re all caught up. Assigned applications will appear here for
          Approve · Waitlist · Decline.
        </p>
      </section>
    </WorkspaceHome>
  );
}
