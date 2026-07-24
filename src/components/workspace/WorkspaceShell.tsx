"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import type { WorkspaceDef } from "@/lib/iam/workspaces";

export function WorkspaceShell({
  workspace,
  userName,
  children,
}: {
  workspace: WorkspaceDef;
  userName?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-root min-h-screen">
      <div className="admin-shell">
        <aside className="admin-sidebar" aria-label={`${workspace.title} navigation`}>
          <Link href={workspace.path} className="inline-flex items-center gap-2 px-2">
            <Logo variant="monogram-white" height={28} />
            <span className="text-sm font-semibold tracking-tight text-white">
              Founder-Being
            </span>
          </Link>
          <p className="mt-4 px-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--admin-muted)]">
            {workspace.title}
          </p>

          <nav className="admin-sidebar-nav" aria-label="Primary">
            {workspace.nav.map((item) => {
              const active =
                item.href === workspace.path
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="admin-nav-link"
                  data-active={active}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            {userName && (
              <p className="px-3 py-2 text-xs text-[var(--admin-muted)]">
                {userName}
              </p>
            )}
            <form action="/admin/logout" method="post">
              <button type="submit" className="admin-nav-link w-full text-left">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="admin-main">{children}</div>
      </div>
    </div>
  );
}
