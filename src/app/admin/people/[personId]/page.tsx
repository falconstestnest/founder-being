import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPersonRecord } from "@/lib/people/loadPersonRecord";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ personId: string }> };

/**
 * Completion test surface for v0.2.1:
 * one person → auth identity, interest, applications, relationships, source history.
 */
export default async function AdminPersonDetailPage({ params }: PageProps) {
  const { personId } = await params;
  const record = await loadPersonRecord(personId);
  if (!record) notFound();

  const { person, profile, relationships, interest, applications, sourceHistory } =
    record;

  return (
    <div>
      <Link
        href="/admin/people"
        className="text-sm text-[var(--admin-muted)] hover:text-white"
      >
        ← All people
      </Link>

      <h1 className="admin-page-title mt-4">{person.displayName}</h1>
      <p className="mt-1 font-mono text-xs text-[var(--admin-muted)]">
        {person.id} · {person.status}
        {person.firstSource ? ` · first: ${person.firstSource}` : ""}
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="admin-card">
          <h2 className="admin-section-title">Identity</h2>
          <dl className="space-y-2 text-sm text-[var(--admin-muted)]">
            <div className="flex justify-between gap-4">
              <dt>Email (normalized)</dt>
              <dd className="font-mono text-white">
                {person.emailNormalized ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>WhatsApp (normalized)</dt>
              <dd className="font-mono text-white">
                {person.whatsappNormalized ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Created</dt>
              <dd className="font-mono text-white">
                {person.createdAt?.slice(0, 10)}
              </dd>
            </div>
          </dl>
        </section>

        <section className="admin-card">
          <h2 className="admin-section-title">Authenticated identity (profile)</h2>
          {profile ? (
            <dl className="space-y-2 text-sm text-[var(--admin-muted)]">
              <div className="flex justify-between gap-4">
                <dt>Name</dt>
                <dd className="text-white">{profile.fullName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Email</dt>
                <dd className="font-mono text-white">{profile.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Status</dt>
                <dd className="text-white">{profile.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Auth user</dt>
                <dd className="font-mono text-xs text-white">
                  {profile.authUserId ? "linked" : "not linked"}
                </dd>
              </div>
              {profile.isSuperAdmin && (
                <p className="mt-2 text-xs text-[var(--admin-gold)]">
                  Super Administrator (access identity — not a CRM field)
                </p>
              )}
            </dl>
          ) : (
            <p className="text-sm text-[var(--admin-muted)]">
              No login profile linked. This person may only have public
              submissions so far.
            </p>
          )}
        </section>

        <section className="admin-card">
          <h2 className="admin-section-title">Institutional relationships</h2>
          {relationships.length === 0 ? (
            <p className="text-sm text-[var(--admin-muted)]">
              No relationships recorded yet.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {relationships.map((r) => (
                <li
                  key={r.slug + r.startedAt}
                  className="flex justify-between gap-4 text-[var(--admin-muted)]"
                >
                  <span className="text-white">{r.slug}</span>
                  <span className="font-mono text-xs">{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <h2 className="admin-section-title">Event interest</h2>
          {interest.length === 0 ? (
            <p className="text-sm text-[var(--admin-muted)]">
              No interest registrations linked.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {interest.map((i) => (
                <li key={i.id} className="text-[var(--admin-muted)]">
                  <span className="text-white">{i.eventName}</span>
                  <span className="mt-0.5 block font-mono text-xs">
                    {i.eventId} · {i.createdAt?.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card">
          <h2 className="admin-section-title">Retreat applications</h2>
          {applications.length === 0 ? (
            <p className="text-sm text-[var(--admin-muted)]">
              No retreat applications linked.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {applications.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between gap-4 text-[var(--admin-muted)]"
                >
                  <span className="font-mono text-white">
                    {a.applicationCode}
                  </span>
                  <span className="text-xs">{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card lg:col-span-2">
          <h2 className="admin-section-title">Source history (audit)</h2>
          {sourceHistory.length === 0 ? (
            <p className="text-sm text-[var(--admin-muted)]">
              No migration or link audit rows yet.
            </p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
              {sourceHistory.map((h, i) => (
                <li
                  key={`${h.at}-${i}`}
                  className="flex flex-wrap justify-between gap-2 border-b border-[var(--admin-border)] pb-2 text-[var(--admin-muted)] last:border-0"
                >
                  <span className="text-white">{h.action}</span>
                  <span className="font-mono text-xs">
                    {h.matchMethod ?? "—"} · {h.objectType ?? "—"} ·{" "}
                    {h.at?.slice(0, 19)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
