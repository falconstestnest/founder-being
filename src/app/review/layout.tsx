export const dynamic = "force-dynamic";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspace } from "@/lib/workspace/guard";
import "../admin/admin.css";

export default async function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ctx, workspace, roleLabel } = await requireWorkspace("review");
  return (
    <WorkspaceShell workspace={workspace} userName={ctx.fullName} roleLabel={roleLabel}>
      {children}
    </WorkspaceShell>
  );
}
