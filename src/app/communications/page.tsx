import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function CommunicationsHomePage() {
  const { ctx, workspace } = await requireWorkspace("communications");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Communications"}
      cards={[
        {
          label: "Campaigns",
          emptyState: "No campaigns are connected yet.",
        },
        {
          label: "Pending messages",
          emptyState: "No messages need attention.",
        },
        {
          label: "Scheduled emails",
          emptyState: "Nothing is scheduled.",
        },
        {
          label: "WhatsApp",
          emptyState: "WhatsApp workflows are not connected yet.",
        },
      ]}
      actions={[
        {
          href: "/communications/campaigns",
          label: "Create campaign",
          primary: true,
        },
        { href: "/communications/messages", label: "Send reminder" },
      ]}
    />
  );
}
