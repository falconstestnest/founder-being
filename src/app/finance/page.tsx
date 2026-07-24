import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function FinanceHomePage() {
  const { ctx, workspace } = await requireWorkspace("finance");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Finance"}
      cards={[
        {
          label: "Outstanding payments",
          emptyState: "Payment workflows are not connected yet.",
        },
        {
          label: "Refunds",
          emptyState: "No refunds require attention.",
        },
        {
          label: "Deposits",
          emptyState: "Deposits will appear once payment data is connected.",
        },
        {
          label: "Reports",
          emptyState: "Financial reports are not available yet.",
        },
      ]}
      actions={[
        { href: "/finance/payments", label: "Record payment", primary: true },
        { href: "/finance/reports", label: "Export report" },
      ]}
    >
      <section className="mt-10 admin-card max-w-xl">
        <h2 className="admin-section-title">Access boundary</h2>
        <p className="text-sm text-[var(--admin-muted)]">
          This workspace covers payments and refunds. Sensitive reflection
          answers and internal programme notes are not available here.
        </p>
      </section>
    </WorkspaceHome>
  );
}
