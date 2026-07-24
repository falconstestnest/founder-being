import Link from "next/link";
import { listAdminEvents } from "@/lib/events/adminData";
import {
  EVENT_LIFECYCLE_LABELS,
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
  REGISTRATION_WORKFLOW_LABELS,
} from "@/lib/events/taxonomy";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await listAdminEvents();

  return (
    <div>
      <div className="admin-primary-row">
        <div>
          <h1 className="admin-page-title">Events</h1>
          <p className="admin-page-desc">
            Single Events domain — retreats, meetups, dialogues, and side events.
            One record per programme. Counts are derived from participation when
            available.
          </p>
        </div>
        <Link href="/admin/events/new" className="admin-btn admin-btn-primary">
          Create event
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 text-xs text-[var(--admin-muted)]">
        <span className="admin-badge">All Events</span>
        <Link href="/admin/applications" className="admin-btn">
          Applications
        </Link>
        <span className="admin-btn opacity-60" title="Coming with participation data">
          Interest
        </span>
        <span className="admin-btn opacity-60" title="Coming with participation data">
          Participants
        </span>
      </div>

      <div className="admin-card overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Lifecycle</th>
              <th className="px-5 py-3 font-medium">Badge</th>
              <th className="px-5 py-3 font-medium">Workflow</th>
              <th className="px-5 py-3 font-medium">Capacity</th>
              <th className="px-5 py-3 font-medium">City</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                className="border-b border-[var(--admin-border)] last:border-0"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{e.title}</p>
                  <p className="font-mono text-xs text-[var(--admin-muted)]">
                    {e.id}
                  </p>
                </td>
                <td className="px-5 py-4 text-[var(--admin-muted)]">
                  {EVENT_TYPE_LABELS[e.eventType]}
                </td>
                <td className="px-5 py-4 text-[var(--admin-muted)]">
                  {EVENT_LIFECYCLE_LABELS[e.lifecycle]}
                </td>
                <td className="px-5 py-4">
                  <span className="admin-badge">
                    {EVENT_STATUS_LABELS[e.statusBadge]}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-[var(--admin-muted)]">
                  {REGISTRATION_WORKFLOW_LABELS[e.registrationWorkflow]}
                </td>
                <td className="px-5 py-4 font-mono text-[var(--admin-muted)]">
                  {e.derived.capacity ?? "—"}
                  <span className="text-[var(--admin-muted)]">
                    {" "}
                    · {e.derived.interested + e.derived.applied} in
                  </span>
                </td>
                <td className="px-5 py-4 text-[var(--admin-muted)]">
                  {e.location.city}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/events/${e.id}`}
                    className="admin-btn admin-btn-primary"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-[var(--admin-muted)]">
        Legacy labels “Retreats” and “Gatherings” resolve here as filtered views
        of the same Events catalogue — not parallel data models.
      </p>
    </div>
  );
}
