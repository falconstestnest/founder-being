import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function ExecutiveHomePage() {
  const { ctx, workspace } = await requireWorkspace("executive");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Executive"}
      cards={[
        { label: "Applications", value: "—" },
        { label: "Members", value: "—" },
        { label: "Patrons", value: "—" },
        { label: "Upcoming events", value: "—" },
        { label: "Open tasks", value: "—" },
        { label: "Revenue", value: "—" },
      ]}
      actions={[
        { href: "/executive/applications", label: "Pending approvals", primary: true },
        { href: "/events", label: "Event health" },
        { href: "/admin/team", label: "Team & Access" },
      ]}
    />
  );
}
