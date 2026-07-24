import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function VolunteerHomePage() {
  const { ctx, workspace } = await requireWorkspace("volunteer");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Volunteer"}
      cards={[
        {
          label: "Assigned events",
          emptyState: "No event assignments yet. Access is event-scoped.",
        },
        {
          label: "Shifts & tasks",
          emptyState: "No open tasks are assigned to you.",
        },
        {
          label: "Documents",
          emptyState: "Event documents will appear for your assignments.",
        },
      ]}
      actions={[
        { href: "/volunteer/events", label: "View assignments", primary: true },
        { href: "/volunteer/tasks", label: "Tasks" },
      ]}
    />
  );
}
