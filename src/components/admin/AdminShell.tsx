"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { Logo } from "@/components/Logo";
import { adminNavFooter, adminNavPrimary } from "@/lib/admin/nav";

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);

  const isAuthSurface =
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/auth") ||
    pathname === "/admin/logout";

  useEffect(() => {
    if (isAuthSurface) return;
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAuthSurface]);

  if (isAuthSurface) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <aside className="admin-sidebar" aria-label="Admin navigation">
          <Link href="/admin" className="inline-flex items-center gap-2 px-2">
            <Logo variant="monogram-white" height={28} />
            <span className="text-sm font-semibold tracking-tight text-white">
              Founder-Being
            </span>
          </Link>

          <nav className="admin-sidebar-nav" aria-label="Primary">
            {adminNavPrimary.map((item) => (
              <div key={item.href}>
                {item.dividerBefore && (
                  <div
                    className="my-3 border-t border-[var(--admin-border)]"
                    role="separator"
                  />
                )}
                <Link
                  href={item.href}
                  className="admin-nav-link"
                  data-active={isActive(pathname, item.href)}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            {adminNavFooter.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="admin-nav-link"
                data-active={isActive(pathname, item.href)}
              >
                {item.label}
              </Link>
            ))}
            <form action="/admin/logout" method="post">
              <button type="submit" className="admin-nav-link w-full text-left">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-topbar">
            <div />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="admin-search-trigger"
                onClick={() => setCmdOpen(true)}
                aria-label="Open search"
              >
                <span>Search…</span>
                <span className="admin-kbd">⌘K</span>
              </button>
              <button type="button" className="admin-btn" aria-label="Notifications">
                Alerts
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
