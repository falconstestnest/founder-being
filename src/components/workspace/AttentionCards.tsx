export type AttentionCard = {
  label: string;
  /** Prefer emptyState over "—" when data is not connected */
  value?: string;
  /** Shown instead of a dash when there is nothing to count yet */
  emptyState?: string;
  hint?: string;
};

export function AttentionCards({ cards }: { cards: AttentionCard[] }) {
  return (
    <section className="admin-kpi-grid" aria-label="Attention">
      {cards.map((c) => {
        const hasValue =
          c.value != null && c.value !== "" && c.value !== "—";
        return (
          <article key={c.label} className="admin-card">
            <p className="admin-kpi-label">{c.label}</p>
            {hasValue ? (
              <p className="admin-kpi-value">{c.value}</p>
            ) : (
              <p className="mt-2 text-sm leading-snug text-[var(--admin-muted)]">
                {c.emptyState ||
                  "Not available yet. This will update once data is connected."}
              </p>
            )}
            {c.hint && hasValue && (
              <p className="mt-2 text-xs text-[var(--admin-muted)]">{c.hint}</p>
            )}
          </article>
        );
      })}
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

export function SetupState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="admin-card">
      <h2 className="admin-section-title">{title}</h2>
      <p className="text-sm text-[var(--admin-muted)]">{body}</p>
    </div>
  );
}
