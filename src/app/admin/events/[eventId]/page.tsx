import Link from "next/link";
import { notFound } from "next/navigation";
import { adminTabsForEvent } from "@/lib/events/adminTabs";
import { getAdminEvent } from "@/lib/events/adminData";
import { allowedNextStages } from "@/lib/events/lifecycle";
import {
  EVENT_LIFECYCLE_LABELS,
  EVENT_STATUS_LABELS,
  EVENT_THEME_LABELS,
  EVENT_TYPE_LABELS,
  REGISTRATION_WORKFLOW_LABELS,
} from "@/lib/events/taxonomy";
import { WORKFLOW_STATUSES } from "@/lib/events/participation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function AdminEventDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { eventId } = await params;
  const { tab: tabParam } = await searchParams;
  const event = await getAdminEvent(eventId);
  if (!event) notFound();

  const tabs = adminTabsForEvent(event);
  const activeTab =
    tabs.find((t) => t.id === tabParam)?.id ?? tabs[0]?.id ?? "overview";
  const nextStages = allowedNextStages(event.lifecycle);
  const d = event.derived;
  const validStatuses = WORKFLOW_STATUSES[event.registrationWorkflow];

  return (
    <div>
      <Link
        href="/admin/events"
        className="text-sm text-[var(--admin-muted)] hover:text-white"
      >
        ← All Events
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="admin-badge">
              {EVENT_STATUS_LABELS[event.statusBadge]}
            </span>
            <span className="font-mono text-xs text-[var(--admin-muted)]">
              {EVENT_TYPE_LABELS[event.eventType]}
            </span>
          </div>
          <h1 className="admin-page-title mt-3">{event.title}</h1>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">
            {event.summaryLine}
          </p>
          <p className="mt-2 font-mono text-xs text-[var(--admin-muted)]">
            {event.id} · {REGISTRATION_WORKFLOW_LABELS[event.registrationWorkflow]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={event.path} className="admin-btn" target="_blank">
            Public page
          </Link>
          <Link
            href={`/admin/events/${event.id}?tab=settings`}
            className="admin-btn"
          >
            Duplicate (settings)
          </Link>
        </div>
      </div>

      {/* Workflow-aware tabs */}
      <nav
        className="mt-8 flex flex-wrap gap-1 border-b border-[var(--admin-border)]"
        aria-label="Event sections"
      >
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`/admin/events/${event.id}?tab=${t.id}`}
            className="admin-nav-link rounded-none border-b-2 border-transparent px-3 py-2"
            data-active={activeTab === t.id}
            style={
              activeTab === t.id
                ? { borderBottomColor: "var(--admin-gold)" }
                : undefined
            }
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {activeTab === "overview" && (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="admin-section-title">
              What needs attention for this event?
            </h2>
            <div className="admin-kpi-grid">
              {[
                { label: "Lifecycle", value: EVENT_LIFECYCLE_LABELS[event.lifecycle] },
                {
                  label: "Capacity",
                  value: d.capacity != null ? String(d.capacity) : "—",
                },
                { label: "Interested", value: String(d.interested) },
                { label: "Applied", value: String(d.applied) },
                { label: "Invited", value: String(d.invited) },
                { label: "Confirmed", value: String(d.confirmed) },
                { label: "Paid", value: String(d.paid) },
                { label: "Waitlisted", value: String(d.waitlisted) },
                { label: "Declined", value: String(d.declined) },
                { label: "Attended", value: String(d.attended) },
                { label: "Open tasks", value: String(event.openTasks) },
              ].map((c) => (
                <article key={c.label} className="admin-card">
                  <p className="admin-kpi-label">{c.label}</p>
                  <p className="admin-kpi-value text-lg">{c.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="admin-card">
              <h3 className="admin-section-title">Location</h3>
              <dl className="space-y-2 text-sm text-[var(--admin-muted)]">
                <div className="flex justify-between gap-4">
                  <dt>Country</dt>
                  <dd className="text-white">{event.location.country}</dd>
                </div>
                {event.location.state && (
                  <div className="flex justify-between gap-4">
                    <dt>State</dt>
                    <dd className="text-white">{event.location.state}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt>City</dt>
                  <dd className="text-white">{event.location.city}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Timezone</dt>
                  <dd className="font-mono text-white">
                    {event.location.timezone}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="admin-card">
              <h3 className="admin-section-title">Lifecycle transitions</h3>
              <p className="mb-3 text-xs text-[var(--admin-muted)]">
                Current:{" "}
                <span className="text-white">
                  {EVENT_LIFECYCLE_LABELS[event.lifecycle]}
                </span>
                . Only guarded next stages are listed (validation + audit on
                change).
              </p>
              {nextStages.length === 0 ? (
                <p className="text-sm text-[var(--admin-muted)]">
                  No further transitions from archived.
                </p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {nextStages.map((s) => (
                    <li key={s} className="admin-btn text-xs">
                      → {EVENT_LIFECYCLE_LABELS[s]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {event.upcomingDeadlines.length > 0 && (
            <section className="admin-card">
              <h3 className="admin-section-title">Upcoming deadlines</h3>
              <ul className="space-y-2 text-sm">
                {event.upcomingDeadlines.map((dl) => (
                  <li
                    key={dl.label}
                    className="flex justify-between gap-4 text-[var(--admin-muted)]"
                  >
                    <span>{dl.label}</span>
                    <span className="font-mono text-white">{dl.date}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="admin-card">
            <h3 className="admin-section-title">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {event.themes.map((t) => (
                <span key={t} className="admin-badge">
                  {EVENT_THEME_LABELS[t]}
                </span>
              ))}
            </div>
          </section>

          <section className="admin-card">
            <h3 className="admin-section-title">Recent activity</h3>
            {event.recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--admin-muted)]">
                You&apos;re all caught up. Activity will appear as participation
                and transitions are recorded.
              </p>
            ) : (
              <ul className="space-y-2 text-sm text-[var(--admin-muted)]">
                {event.recentActivity.map((a, i) => (
                  <li key={i}>{a.label}</li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {activeTab === "participation" && (
        <div className="mt-8 admin-card">
          <h2 className="admin-section-title">Participation model</h2>
          <p className="mb-4 text-sm text-[var(--admin-muted)]">
            One <code className="text-[var(--admin-gold)]">event_participation</code>{" "}
            table. Statuses valid for this workflow:
          </p>
          <ul className="flex flex-wrap gap-2">
            {validStatuses.map((s) => (
              <li key={s} className="admin-badge">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[var(--admin-muted)]">
            Aggregate counts are derived from participation records — never stored
            as the primary source of truth.
          </p>
        </div>
      )}

      {(activeTab === "applications" ||
        activeTab === "interest" ||
        activeTab === "invitations" ||
        activeTab === "participants" ||
        activeTab === "payments" ||
        activeTab === "communications" ||
        activeTab === "operations" ||
        activeTab === "documents") && (
        <div className="mt-8 admin-card">
          <h2 className="admin-section-title">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-sm text-[var(--admin-muted)]">
            You&apos;re all caught up. Records for this tab will appear when
            people participate and operational data is connected. Tab is shown
            because it is valid for workflow{" "}
            <strong className="text-white">
              {REGISTRATION_WORKFLOW_LABELS[event.registrationWorkflow]}
            </strong>
            .
          </p>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="mt-8 space-y-4">
          <div className="admin-card">
            <h2 className="admin-section-title">Duplicate event</h2>
            <p className="mb-4 text-sm text-[var(--admin-muted)]">
              Copies configuration only. Never copies participants, applications,
              payments, audit history, sent communications, or analytics.
            </p>
            <ul className="mb-4 space-y-1 text-sm text-[var(--admin-muted)]">
              <li>✓ Public content, agenda, form, capacity, checklist</li>
              <li>✗ Participants, payments, audit, sent messages, analytics</li>
            </ul>
            <p className="text-xs text-[var(--admin-muted)]">
              Guided create/duplicate flow ships next; draft builder is in{" "}
              <code className="text-[var(--admin-gold)]">
                buildDuplicateDraft()
              </code>
              .
            </p>
          </div>
          <div className="admin-card">
            <h2 className="admin-section-title">Public path</h2>
            <p className="font-mono text-sm text-white">{event.path}</p>
          </div>
        </div>
      )}
    </div>
  );
}
