import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function ReviewHomePage() {
  const { ctx, workspace } = await requireWorkspace("review");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Reviewer"}
      cards={[
        {
          label: "Assigned reviews",
          emptyState: "No applications are assigned to you yet.",
        },
        {
          label: "Pending",
          emptyState: "Your review queue is empty.",
        },
        {
          label: "Completed",
          emptyState: "Completed reviews will appear here.",
        },
      ]}
      actions={[
        { href: "/review/queue", label: "Open review queue", primary: true },
      ]}
    >
      <section className="mt-10 admin-card">
        <h2 className="admin-section-title">Review principles</h2>
        <p className="text-sm text-[var(--admin-muted)]">
          You only see applications assigned to you. Reviewer notes, decisions,
          and conflicts of interest are kept separate from applicant-facing
          records.
        </p>
      </section>
    </WorkspaceHome>
  );
}
