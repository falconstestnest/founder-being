import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function VolunteerHomePage() {
  const { ctx, workspace } = await requireWorkspace("volunteer");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Volunteer"}
      cards={[
        { label: "Assigned events", value: "—" },
        { label: "Open checklist items", value: "—" },
        { label: "Tasks", value: "—" },
      ]}
      actions={[
        { href: "/volunteer/events", label: "View assignments", primary: true },
        { href: "/volunteer/tasks", label: "Tasks" },
      ]}
    />
  );
}
