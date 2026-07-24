export const dynamic = "force-dynamic";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspace } from "@/lib/workspace/guard";
import "../admin/admin.css";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ctx, workspace, roleLabel } = await requireWorkspace("member");
  return (
    <WorkspaceShell workspace={workspace} userName={ctx.fullName} roleLabel={roleLabel}>
      {children}
    </WorkspaceShell>
  );
}
