import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function MemberHomePage() {
  const { ctx, workspace } = await requireWorkspace("member");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Member"}
      cards={[
        {
          label: "Upcoming events",
          emptyState: "No upcoming events are connected yet.",
        },
        {
          label: "Community updates",
          emptyState: "Updates will appear once communications are connected.",
        },
        {
          label: "Resources",
          emptyState: "Resources are not available yet.",
        },
      ]}
      actions={[
        { href: "/events", label: "Browse events", primary: true },
        { href: "/member/profile", label: "Profile" },
      ]}
    />
  );
}
