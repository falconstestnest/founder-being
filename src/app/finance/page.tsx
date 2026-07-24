import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function FinanceHomePage() {
  const { ctx, workspace } = await requireWorkspace("finance");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Finance"}
      cards={[
        { label: "Outstanding payments", value: "—" },
        { label: "Refunds", value: "—" },
        { label: "Deposits", value: "—" },
        { label: "Revenue", value: "—" },
      ]}
      actions={[
        { href: "/finance/payments", label: "Record payment", primary: true },
        { href: "/finance/reports", label: "Export report" },
      ]}
    />
  );
}
