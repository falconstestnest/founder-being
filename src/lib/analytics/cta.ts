/**
 * CTA analytics taxonomy — consistent event format for journey abandon analysis.
 */

export const CTA_EVENTS = [
  "cta_clicked",
  "cta_started",
  "cta_submitted",
  "cta_completed",
  "cta_failed",
] as const;

export type CtaEventName = (typeof CTA_EVENTS)[number];

export type CtaProps = {
  cta_name: string;
  source_page?: string;
  event_id?: string | null;
  event_type?: string | null;
  registration_workflow?: string | null;
  authenticated?: boolean;
  workspace?: string | null;
  error_code?: string | null;
  /** Extra dimensions (keep small) */
  meta?: Record<string, string | number | boolean | null | undefined>;
};

export type CtaEventPayload = CtaProps & {
  event: CtaEventName;
  at: string;
};

/** Server or client: build a payload (does not send). */
export function buildCtaEvent(
  event: CtaEventName,
  props: CtaProps,
): CtaEventPayload {
  return {
    event,
    at: new Date().toISOString(),
    ...props,
  };
}

/**
 * Fire-and-forget client tracker.
 * Posts to /api/analytics/cta when available; no-ops on failure.
 */
export async function trackCta(
  event: CtaEventName,
  props: CtaProps,
): Promise<void> {
  const payload = buildCtaEvent(event, props);
  try {
    if (typeof window === "undefined") {
      // Server: structured log until warehouse is connected
      console.info("[cta]", JSON.stringify(payload));
      return;
    }
    await fetch("/api/analytics/cta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Never block the user journey
  }
}
