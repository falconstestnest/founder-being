import Link from "next/link";

export const dynamic = "force-dynamic";

const steps = [
  "Basics",
  "Type and workflow",
  "Date and location",
  "Capacity",
  "Public content",
  "Form configuration",
  "Review",
  "Publish",
];

export default function AdminEventNewPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/events"
        className="text-sm text-[var(--admin-muted)] hover:text-white"
      >
        ← All Events
      </Link>
      <h1 className="admin-page-title mt-4">Create event</h1>
      <p className="admin-page-desc">
        Guided flow — not the full schema on one form. New events join the single
        Events catalogue with a locked type and workflow.
      </p>

      <ol className="mt-10 space-y-3">
        {steps.map((s, i) => (
          <li
            key={s}
            className="flex items-center gap-4 border border-[var(--admin-border)] px-4 py-3 text-sm"
          >
            <span className="font-mono text-xs text-[var(--admin-gold)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-white">{s}</span>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-[var(--admin-muted)]">
        You&apos;re all caught up for scaffolding. Persistence to Supabase{" "}
        <code className="text-[var(--admin-gold)]">events</code> table lands with
        the next write path; public catalogue remains the source until then.
      </p>
    </div>
  );
}
