import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function MemberHomePage() {
  const { ctx, workspace } = await requireWorkspace("member");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Member"}
      cards={[
        { label: "Upcoming gatherings", value: "—" },
        { label: "Community updates", value: "—" },
        { label: "Resources", value: "—" },
      ]}
      actions={[
        { href: "/events", label: "Browse events", primary: true },
        { href: "/member/profile", label: "Profile" },
      ]}
    />
  );
}
