import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function ProgrammeHomePage() {
  const { ctx, workspace } = await requireWorkspace("programme");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Programme"}
      cards={[
        { label: "Applications pending", value: "—", hint: "Needs review" },
        { label: "Today's events", value: "—" },
        { label: "Upcoming retreats", value: "1" },
        { label: "Open tasks", value: "—" },
      ]}
      actions={[
        { href: "/programme/applications", label: "Review applications", primary: true },
        { href: "/events", label: "Publish / manage events" },
        { href: "/programme/communications", label: "Communications" },
      ]}
    />
  );
}
