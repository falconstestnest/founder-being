import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { sectionMeta } from "@/lib/admin/sectionMeta";

const emptyCopy: Record<string, { title: string; body: string }> = {
  community: {
    title: "Community is quiet",
    body: "Founders and cohorts will surface here as the platform grows.",
  },
  retreats: {
    title: "Deprecated — use Events",
    body: "Retreats are Events with type=retreat. Open /admin/events (filter coming). Do not create a parallel data model.",
  },
  applications: {
    title: "No applications yet",
    body: "Applications will appear here once founders begin applying. Prefer event-scoped Applications tab under each Event.",
  },
  gatherings: {
    title: "Deprecated — use Events",
    body: "Gatherings are Events with meetup/dialogue types. Open /admin/events. Temporary compatibility pointer only.",
  },
  events: {
    title: "Events",
    body: "Use /admin/events for the operational list.",
  },
  patrons: {
    title: "No patrons on record",
    body: "Patron organisation, contribution, status, meetings and recognition will live in this simple CRM.",
  },
  communications: {
    title: "No timeline yet",
    body: "Every call, email, WhatsApp and note will appear chronologically.",
  },
  content: {
    title: "Content workspace",
    body: "Programme copy and public flags (e.g. facilitatorPublic) will be editable here without code deploys.",
  },
  people: {
    title: "No people loaded",
    body: "Search any founder in under five seconds once the directory is connected.",
  },
  analytics: {
    title: "Metrics pending data",
    body: "Applications, conversion, selection, attendance, revenue, geography and source—numbers first.",
  },
  settings: {
    title: "Settings",
    body: "Roles: Owner, Programme Lead, Finance, Reviewer, Volunteer. Auth ships with Supabase.",
  },
  help: {
    title: "Operator help",
    body: "Design source of truth: docs/ADMIN_DASHBOARD_DESIGN_PRD.md. Retreat product: docs/RETREAT_PLATFORM_MVP.md.",
  },
  profile: {
    title: "Your profile",
    body: "Account and notification preferences will appear after authentication is enabled.",
  },
};

type PageProps = { params: Promise<{ section: string }> };

export default async function AdminSectionPage({ params }: PageProps) {
  const { section } = await params;
  // Dedicated routes — not the generic [section] shell
  if (
    section === "team" ||
    section === "people" ||
    section === "events"
  ) {
    // Dedicated routes: /admin/team, /admin/people, /admin/events
    notFound();
  }
  const meta = sectionMeta[section];
  if (!meta) notFound();

  const empty = emptyCopy[section] ?? {
    title: "Nothing here yet",
    body: "This section will fill as the operational console matures.",
  };

  return (
    <>
      <AdminPageHeader
        title={meta.title}
        description={meta.description}
        primaryAction={
          section === "help" || section === "profile"
            ? undefined
            : section === "retreats" || section === "gatherings"
              ? { label: meta.primary, href: "/admin/events" }
              : section === "applications"
                ? { label: meta.primary }
                : { label: meta.primary }
        }
      />

      {section === "applications" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <EmptyState
            title="Application list"
            body="Search, filters, sorting, bulk actions and keyboard navigation belong here. Prefer event-scoped Applications under each Event."
          />
          <EmptyState
            title="Application detail"
            body="Progressive disclosure: profile → intent → reflection → notes → payment → history. Sticky bar: Approve · Waitlist · Reject."
          />
        </div>
      )}

      {/* Deprecated programme modules — temporary pointers only */}
      {(section === "retreats" || section === "gatherings") && (
        <div className="admin-card max-w-lg space-y-4">
          <p className="text-sm text-[var(--admin-muted)]">
            {section === "retreats"
              ? "Retreats are Events with type = retreat. This route is a compatibility pointer only — do not add features or a parallel data model."
              : "Gatherings are Events (meetup, dialogue, side event). This route is a compatibility pointer only."}
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/events" className="admin-btn admin-btn-primary">
              Open Events
            </a>
            {section === "retreats" && (
              <a
                href="/admin/events/evt_kodaikanal_full_moon_2026"
                className="admin-btn"
              >
                Kodaikanal retreat
              </a>
            )}
          </div>
          <p className="font-mono text-xs text-[var(--admin-muted)]">
            deprecated → /admin/events
          </p>
        </div>
      )}

      {section !== "applications" &&
        section !== "retreats" &&
        section !== "gatherings" && (
        <EmptyState title={empty.title} body={empty.body} />
      )}

      {section === "help" && (
        <div className="mt-4 admin-card max-w-xl text-sm text-[var(--admin-muted)]">
          <p className="text-white font-medium mb-2">Design PRD</p>
          <p>
            Full UI/UX requirements live in the repository at{" "}
            <code className="text-[var(--admin-gold)]">
              docs/ADMIN_DASHBOARD_DESIGN_PRD.md
            </code>
            . This shell implements navigation, Calm Operations tokens, ⌘K, and
            attention-first home layout.
          </p>
        </div>
      )}
    </>
  );
}
