"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  EVENT_LIFECYCLE_LABELS,
  type EventLifecycle,
} from "@/lib/events/taxonomy";

export function LifecycleTransitionControls({
  eventId,
  current,
  nextStages,
}: {
  eventId: string;
  current: EventLifecycle;
  nextStages: EventLifecycle[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");

  async function transition(to: EventLifecycle) {
    setBusy(to);
    setError("");
    try {
      const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/lifecycle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          reason: reason.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        errors?: string[];
      };
      if (!res.ok) {
        setError(
          [data.error, ...(data.errors ?? [])].filter(Boolean).join(" "),
        );
        return;
      }
      setReason("");
      router.refresh();
    } catch {
      setError("Could not apply transition. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <p className="mb-3 text-xs text-[var(--admin-muted)]">
        Current:{" "}
        <span className="text-white">{EVENT_LIFECYCLE_LABELS[current]}</span>
        . Transitions are validated and audited. Participation is not modified.
      </p>

      {nextStages.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted)]">
          No further transitions from this stage.
        </p>
      ) : (
        <>
          <label className="mb-3 block">
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--admin-muted)]">
              Reason (optional)
            </span>
            <input
              className="mt-1 w-full border border-[var(--admin-border)] bg-transparent px-3 py-2 text-sm text-white"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              placeholder="Why this change?"
            />
          </label>
          <ul className="flex flex-wrap gap-2">
            {nextStages.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary text-xs"
                  disabled={busy !== null}
                  onClick={() => void transition(s)}
                >
                  {busy === s ? "…" : `→ ${EVENT_LIFECYCLE_LABELS[s]}`}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
