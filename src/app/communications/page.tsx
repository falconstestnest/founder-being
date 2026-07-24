import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function CommunicationsHomePage() {
  const { ctx, workspace } = await requireWorkspace("communications");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Communications"}
      cards={[
        { label: "Upcoming campaigns", value: "—" },
        { label: "Pending messages", value: "—" },
        { label: "Scheduled emails", value: "—" },
        { label: "WhatsApp", value: "—" },
      ]}
      actions={[
        { href: "/communications/campaigns", label: "Create campaign", primary: true },
        { href: "/communications/messages", label: "Send reminder" },
      ]}
    />
  );
}
