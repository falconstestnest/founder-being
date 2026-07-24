"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import type { WorkspaceDef } from "@/lib/iam/workspaces";

export function WorkspaceShell({
  workspace,
  userName,
  roleLabel,
  children,
}: {
  workspace: WorkspaceDef;
  userName?: string;
  /** Discreet — never shown as a status symbol in the header */
  roleLabel?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

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
            <form action="/admin/logout" method="post">
              <button type="submit" className="admin-nav-link w-full text-left">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="admin-main">
          {/* Consistent workspace header controls */}
          <header className="mb-6 flex flex-wrap items-center justify-end gap-2 border-b border-[var(--admin-border)] pb-4">
            <button
              type="button"
              className="admin-btn text-xs"
              title="Search (coming soon)"
              disabled
            >
              Search
            </button>
            <button
              type="button"
              className="admin-btn text-xs"
              title="Notifications (coming soon)"
              disabled
            >
              Notifications
            </button>
            <Link href="/admin/help" className="admin-btn text-xs">
              Help
            </Link>
            <div className="relative">
              <button
                type="button"
                className="admin-btn text-xs"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                onClick={() => setProfileOpen((o) => !o)}
              >
                {userName?.split(/\s+/)[0] || "Profile"}
              </button>
              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-56 border border-[var(--admin-border)] bg-[var(--admin-panel,#131313)] p-3 shadow-lg"
                >
                  {userName && (
                    <p className="text-sm font-medium text-white">{userName}</p>
                  )}
                  {roleLabel && (
                    <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--admin-muted)]">
                      {roleLabel}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[var(--admin-muted)]">
                    {workspace.title}
                  </p>
                  <div className="mt-3 space-y-1 border-t border-[var(--admin-border)] pt-3">
                    <Link
                      href="/workspace"
                      className="admin-nav-link block text-sm"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                    >
                      Switch workspace
                    </Link>
                    <form action="/admin/logout" method="post">
                      <button
                        type="submit"
                        className="admin-nav-link w-full text-left text-sm"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
