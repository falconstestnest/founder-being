/**
 * Server-safe interest form prefill — pure functions only.
 * Do not add "use client", hooks, or browser APIs.
 */

import { getEventBySlug, LEGACY_SLUG_MAP } from "@/lib/events/catalog";
import {
  EVENT_TYPE_LABELS,
  REGISTRATION_WORKFLOW_LABELS,
  type FounderEvent,
} from "@/lib/events/taxonomy";

export type InterestPrefill = {
  eventId: string;
  eventName: string;
  eventType: string;
  city: string;
  registrationWorkflow: string;
  slug: string;
  cta: string;
};

export const COMMUNITY_INTEREST_PREFILL: InterestPrefill = {
  eventId: "evt_community_general",
  eventName: "Founder-Being Community",
  eventType: "Community",
  city: "Multiple",
  registrationWorkflow: "Community Signup",
  slug: "community",
  cta: "Join the Founder-Being Community",
};

export function prefillFromEvent(event: FounderEvent): InterestPrefill {
  return {
    eventId: event.id,
    eventName: event.title,
    eventType: EVENT_TYPE_LABELS[event.eventType],
    city: event.location.city,
    registrationWorkflow:
      REGISTRATION_WORKFLOW_LABELS[event.registrationWorkflow],
    slug: event.slug,
    cta: event.cta,
  };
}

/**
 * Resolve ?event= slug (including legacy aliases) to prefill data.
 * Returns community prefill when slug is missing/community.
 * Returns null when slug is present but unknown (caller shows not-found).
 */
export function prefillFromEventSlug(
  rawSlug?: string | null,
): { kind: "community" | "event"; prefill: InterestPrefill; event?: FounderEvent } | {
  kind: "not_found";
  slug: string;
} {
  if (!rawSlug || rawSlug === "community") {
    return { kind: "community", prefill: COMMUNITY_INTEREST_PREFILL };
  }

  const slug = LEGACY_SLUG_MAP[rawSlug] ?? rawSlug;
  if (slug === "community") {
    return { kind: "community", prefill: COMMUNITY_INTEREST_PREFILL };
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return { kind: "not_found", slug };
  }

  return {
    kind: "event",
    prefill: prefillFromEvent(event),
    event,
  };
}

/** @deprecated use prefillFromEvent */
export const prefillFromGathering = prefillFromEvent;
