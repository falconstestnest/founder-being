type AdminPageHeaderProps = {
  title: string;
  description: string;
  primaryAction?: { label: string; onClick?: () => void; href?: string };
};

export function AdminPageHeader({
  title,
  description,
  primaryAction,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-primary-row">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        <p className="admin-page-desc">{description}</p>
      </div>
      {primaryAction &&
        (primaryAction.href ? (
          <a href={primaryAction.href} className="admin-btn admin-btn-primary">
            {primaryAction.label}
          </a>
        ) : (
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </button>
        ))}
    </div>
  );
}
