"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminNavFooter, adminNavPrimary } from "@/lib/admin/nav";

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo(() => {
    const all = [...adminNavPrimary, ...adminNavFooter];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q),
    );
  }, [query]);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery("");
    setActive(0);
  }, [onOpenChange]);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  useEffect(() => {
    if (!open) return;
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, Math.max(items.length - 1, 0)));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && items[active]) {
        e.preventDefault();
        go(items[active].href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, active, close, go]);

  if (!open) return null;

  return (
    <div
      className="admin-cmd-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="admin-cmd">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search founders, applications, events…"
          aria-label="Search Founder-Being"
        />
        <div className="admin-cmd-list" role="listbox">
          {items.length === 0 ? (
            <p className="admin-empty" style={{ padding: "12px" }}>
              No matches. Try a different term.
            </p>
          ) : (
            items.map((item, i) => (
              <button
                key={item.href}
                type="button"
                role="option"
                aria-selected={i === active}
                data-active={i === active}
                className="admin-cmd-item"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item.href)}
              >
                <span>{item.label}</span>
                <span className="admin-cmd-meta">{item.description}</span>
              </button>
            ))
          )}
        </div>
        <p
          className="admin-empty"
          style={{
            padding: "10px 16px 14px",
            borderTop: "1px solid var(--admin-border)",
            fontSize: "0.75rem",
          }}
        >
          Later: search founders, payments, notes, and communications without
          leaving the page.
        </p>
      </div>
    </div>
  );
}
