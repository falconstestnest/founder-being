type EmptyStateProps = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="admin-card">
      <div className="admin-empty">
        <strong>{title}</strong>
        {body}
      </div>
    </div>
  );
}
