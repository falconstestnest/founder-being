import Link from "next/link";
import { WorkspaceHome } from "@/components/workspace/WorkspaceHome";
import { requireWorkspace } from "@/lib/workspace/guard";

export default async function FounderHomePage() {
  const { ctx, workspace } = await requireWorkspace("founder");

  return (
    <WorkspaceHome
      workspace={workspace}
      fullName={ctx.fullName || "Founder"}
      cards={[
        {
          label: "Upcoming events",
          emptyState: "No upcoming events are connected yet.",
        },
        {
          label: "Your applications",
          emptyState: "No applications are connected yet.",
        },
        {
          label: "Past participation",
          emptyState: "Past events will appear after you attend.",
        },
        {
          label: "Messages",
          emptyState: "Messages are not available yet.",
        },
      ]}
      actions={[
        {
          href: "/events/kodaikanal-full-moon-retreat-2026",
          label: "Apply for retreat",
          primary: true,
        },
        { href: "/events", label: "Browse events" },
        { href: "/founder/profile", label: "Update profile" },
        { href: "/founder/resources", label: "Resources" },
      ]}
    >
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="admin-card">
          <h2 className="admin-section-title">Resources</h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Articles, meditations and leadership notes will appear here once
            programme content is connected.
          </p>
        </div>
        <div className="admin-card">
          <h2 className="admin-section-title">Recommended experiences</h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Personalised event suggestions based on your journey.
          </p>
          <Link href="/events" className="admin-btn mt-4 inline-flex">
            Browse events
          </Link>
        </div>
      </section>
    </WorkspaceHome>
  );
}
