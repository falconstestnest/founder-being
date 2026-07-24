import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function ExecutiveHomePage() {
  const { ctx, workspace } = await requireWorkspace("executive");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Executive"}
      cards={[
        {
          label: "Applications",
          emptyState: "No applications need attention yet.",
        },
        {
          label: "People",
          emptyState: "People metrics will appear once the directory is connected.",
        },
        {
          label: "Patrons",
          emptyState: "Patron pipeline is not connected yet.",
        },
        {
          label: "Events",
          emptyState: "Event health will update from the Events catalogue.",
        },
        {
          label: "Open tasks",
          emptyState: "No open tasks yet.",
        },
        {
          label: "Reporting",
          emptyState: "Institution reports are not available yet.",
        },
      ]}
      actions={[
        {
          href: "/executive/applications",
          label: "Pending approvals",
          primary: true,
        },
        { href: "/admin/events", label: "Event health" },
        { href: "/admin/team", label: "Team & Access" },
      ]}
    />
  );
}
