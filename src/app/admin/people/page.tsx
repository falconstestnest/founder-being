import Link from "next/link";
import { listPeople } from "@/lib/people/loadPersonRecord";

export const dynamic = "force-dynamic";

/**
 * v0.2.1 — People list (canonical humans).
 * profiles remain under Team & Access.
 */
export default async function AdminPeoplePage() {
  const people = await listPeople(100);

  return (
    <div>
      <div className="admin-primary-row">
        <div>
          <h1 className="admin-page-title">People</h1>
          <p className="admin-page-desc">
            Canonical human records for the institution. Access identities live
            under Team &amp; Access (profiles). One person may have interest,
            applications, relationships, and a linked login — without
            duplication.
          </p>
        </div>
      </div>

      {!people.length ? (
        <div className="admin-card max-w-xl">
          <p className="text-sm font-semibold text-white">
            No people records yet
          </p>
          <p className="mt-2 text-sm text-[var(--admin-muted)]">
            Apply the v0.2.1 migration and connect Supabase. New event interest
            and retreat applications create or link people automatically.
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">WhatsApp</th>
                <th className="px-5 py-3 font-medium">First source</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[var(--admin-border)] last:border-0"
                >
                  <td className="px-5 py-4 font-medium text-white">
                    {p.display_name}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[var(--admin-muted)]">
                    {p.email_normalized ?? "—"}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[var(--admin-muted)]">
                    {p.whatsapp_normalized ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-[var(--admin-muted)]">
                    {p.first_source ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/people/${p.id}`}
                      className="admin-btn admin-btn-primary"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
