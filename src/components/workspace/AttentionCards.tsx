export type AttentionCard = {
  label: string;
  value: string;
  hint?: string;
};

export function AttentionCards({ cards }: { cards: AttentionCard[] }) {
  return (
    <section className="admin-kpi-grid" aria-label="Attention">
      {cards.map((c) => (
        <article key={c.label} className="admin-card">
          <p className="admin-kpi-label">{c.label}</p>
          <p className="admin-kpi-value">{c.value}</p>
          {c.hint && (
            <p className="mt-2 text-xs text-[var(--admin-muted)]">{c.hint}</p>
          )}
        </article>
      ))}
    </section>
  );
}

export function CaughtUp({
  title = "You're all caught up",
  body = "New items will appear here when they need your attention.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="admin-card">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-[var(--admin-muted)]">{body}</p>
    </div>
  );
}
