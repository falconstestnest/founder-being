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
    title: "Retreats ready for operations",
    body: "Kodaikanal Full Moon Retreat is configured in product data. Connect Supabase to manage capacity and status live.",
  },
  applications: {
    title: "No applications yet",
    body: "Applications will appear here once founders begin applying. Use a split list/detail layout—never a new page for review.",
  },
  gatherings: {
    title: "No gatherings scheduled",
    body: "Reflection circles and dialogues will list here with filters and saved views.",
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
  // Dedicated IAM routes live under /admin/team/*
  if (section === "team" || section === "people") {
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
            : section === "retreats"
              ? { label: meta.primary, href: "/admin/applications" }
              : section === "applications"
                ? { label: meta.primary }
                : { label: meta.primary }
        }
      />

      {section === "applications" && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <EmptyState
            title="Application list"
            body="Search, filters, sorting, bulk actions and keyboard navigation belong here."
          />
          <EmptyState
            title="Application detail"
            body="Progressive disclosure: profile → intent → reflection → notes → payment → history. Sticky bar: Approve · Waitlist · Reject."
          />
        </div>
      )}

      {section === "retreats" && (
        <div className="admin-card max-w-md">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Kodaikanal Full Moon Retreat</p>
            <span className="admin-badge">Open</span>
          </div>
          <dl className="space-y-2 font-mono text-xs text-[var(--admin-muted)]">
            <div className="flex justify-between gap-4">
              <dt>Capacity</dt>
              <dd className="text-white">15</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Applications</dt>
              <dd className="text-white">—</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Revenue</dt>
              <dd className="text-white">—</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Timeline</dt>
              <dd className="text-white">26–31 Aug 2026</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href="/admin/applications" className="admin-btn admin-btn-primary">
              Manage
            </a>
            <a
              href="/retreats/kodaikanal-full-moon-2026"
              className="admin-btn"
              target="_blank"
              rel="noreferrer"
            >
              Public page
            </a>
          </div>
        </div>
      )}

      {section !== "applications" && section !== "retreats" && (
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
