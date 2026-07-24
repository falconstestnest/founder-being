export const dynamic = "force-dynamic";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspace } from "@/lib/workspace/guard";
import "../admin/admin.css";

export default async function CommunicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ctx, workspace, roleLabel } = await requireWorkspace("communications");
  return (
    <WorkspaceShell workspace={workspace} userName={ctx.fullName} roleLabel={roleLabel}>
      {children}
    </WorkspaceShell>
  );
}
