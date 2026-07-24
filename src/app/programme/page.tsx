import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function ProgrammeHomePage() {
  const { ctx, workspace } = await requireWorkspace("programme");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Programme"}
      cards={[
        {
          label: "Applications",
          emptyState:
            "No applications are connected yet. This workspace will update once programme data is connected.",
        },
        {
          label: "Today's events",
          emptyState: "No events are live today.",
        },
        {
          label: "Upcoming retreats",
          value: "1",
          hint: "From Events catalogue",
        },
        {
          label: "Open tasks",
          emptyState: "No open tasks yet.",
        },
      ]}
      actions={[
        {
          href: "/admin/events",
          label: "Manage events",
          primary: true,
        },
        { href: "/programme/applications", label: "Review applications" },
        { href: "/programme/communications", label: "Communications" },
      ]}
    />
  );
}
