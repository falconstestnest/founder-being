import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function PatronHomePage() {
  const { ctx, workspace } = await requireWorkspace("patron");
  const name = ctx.fullName || "Patron";

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={name}
      cards={[
        {
          label: "Supported programmes",
          emptyState: "Programme links will appear once your patronage is recorded.",
        },
        {
          label: "Impact updates",
          emptyState: "Impact reports are not available yet.",
        },
        {
          label: "Patron gatherings",
          emptyState: "No patron gatherings are scheduled yet.",
        },
        {
          label: "Meetings",
          emptyState: "No meetings are connected yet.",
        },
      ]}
      actions={[
        { href: "/patron/meetings", label: "Schedule meeting", primary: true },
        { href: "/patron/reports", label: "View reports" },
        {
          href: "mailto:hello@founderbeing.org",
          label: "Contact Executive Office",
        },
      ]}
    >
      <section className="mt-10 admin-card max-w-xl">
        <h2 className="admin-section-title">Your contribution</h2>
        <p className="text-sm text-[var(--admin-muted)]">
          Thank you for supporting healthier founders. Patron level, recognition
          and projects supported will appear here. Operational financial data is
          not shown in this portal.
        </p>
      </section>
    </WorkspaceHome>
  );
}
