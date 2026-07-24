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
        { label: "Upcoming gatherings", value: "—", hint: "From Events catalogue" },
        { label: "Your applications", value: "—", hint: "In progress" },
        { label: "Past retreats", value: "—" },
        { label: "Messages", value: "—" },
      ]}
      actions={[
        { href: "/events/kodaikanal-full-moon-retreat-2026", label: "Apply for retreat", primary: true },
        { href: "/events", label: "Register interest" },
        { href: "/founder/profile", label: "Update profile" },
        { href: "/founder/resources", label: "Resources" },
      ]}
    >
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="admin-card">
          <h2 className="admin-section-title">Reflection library</h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Articles, meditations and leadership notes will appear here.
          </p>
        </div>
        <div className="admin-card">
          <h2 className="admin-section-title">Recommended experiences</h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Personalised gathering suggestions based on your journey.
          </p>
          <Link href="/events" className="admin-btn mt-4 inline-flex">
            Browse events
          </Link>
        </div>
      </section>
    </WorkspaceHome>
  );
}
