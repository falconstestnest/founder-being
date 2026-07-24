import { EmptyState } from "@/components/admin/EmptyState";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const kpis = [
  { label: "Applications", value: "—" },
  { label: "Pending review", value: "—" },
  { label: "Deposits received", value: "—" },
  { label: "Seats filled", value: "— / 15" },
  { label: "Upcoming events", value: "1" },
  { label: "Messages", value: "—" },
];

export default function AdminDashboardPage() {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <header className="mb-8">
        <h1 className="admin-greeting">{greeting()}.</h1>
        <p className="admin-date">{today}</p>
        <p className="mt-3 max-w-xl text-sm text-[var(--admin-muted)]">
          What requires attention today?
        </p>
      </header>

      <section aria-label="Key metrics" className="admin-kpi-grid mb-8">
        {kpis.map((k) => (
          <article key={k.label} className="admin-card">
            <p className="admin-kpi-label">{k.label}</p>
            <p className="admin-kpi-value">{k.value}</p>
          </article>
        ))}
      </section>

      <section className="admin-grid-2 mb-8" aria-label="Attention">
        <div>
          <h2 className="admin-section-title">Requires review</h2>
          <EmptyState
            title="No applications waiting"
            body="Applications requiring a decision will appear here. Primary action: Review Application."
          />
        </div>
        <div>
          <h2 className="admin-section-title">Upcoming calls</h2>
          <EmptyState
            title="No calls scheduled"
            body="Selected founders to contact will surface here ahead of the contact deadline."
          />
        </div>
        <div>
          <h2 className="admin-section-title">Today&apos;s tasks</h2>
          <EmptyState
            title="Inbox clear"
            body="Operational tasks for today will list here once the console is connected to live data."
          />
        </div>
      </section>

      <section className="admin-grid-2" aria-label="Context">
        <div>
          <h2 className="admin-section-title">Retreat timeline</h2>
          <div className="admin-card">
            <p className="text-sm font-semibold text-white">
              Kodaikanal Full Moon Retreat
            </p>
            <p className="mt-2 font-mono text-xs text-[var(--admin-muted)]">
              26–31 Aug 2026
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--admin-muted)]">
              <li>Contact selected · 3 Aug</li>
              <li>Min deposits · 8 Aug</li>
              <li>Go / no-go · 10 Aug</li>
            </ul>
            <a
              href="/admin/retreats"
              className="admin-btn admin-btn-primary mt-6"
            >
              Manage retreat
            </a>
          </div>
        </div>
        <div>
          <h2 className="admin-section-title">Founder activity</h2>
          <EmptyState
            title="No recent activity"
            body="New applications and status changes will stream here."
          />
        </div>
        <div>
          <h2 className="admin-section-title">Recent communications</h2>
          <EmptyState
            title="No communications yet"
            body="Calls, email and WhatsApp activity will appear in chronological order."
          />
        </div>
      </section>
    </>
  );
}
