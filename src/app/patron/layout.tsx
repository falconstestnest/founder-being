export const dynamic = "force-dynamic";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { requireWorkspace } from "@/lib/workspace/guard";
import "../admin/admin.css";

export default async function PatronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ctx, workspace } = await requireWorkspace("patron");
  return (
    <WorkspaceShell workspace={workspace} userName={ctx.fullName}>
      {children}
    </WorkspaceShell>
  );
}
