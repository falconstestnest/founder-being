/**
 * Guarded event lifecycle transitions.
 * Arbitrary status changes are not allowed.
 */

import type { EventLifecycle, FounderEvent } from "@/lib/events/taxonomy";
import { EVENT_LIFECYCLE } from "@/lib/events/taxonomy";

/** Allowed next states from each lifecycle stage */
export const LIFECYCLE_TRANSITIONS: Record<EventLifecycle, EventLifecycle[]> = {
  draft: ["planning", "archived"],
  planning: ["published", "draft", "archived"],
  published: ["interest_collection", "applications_open", "planning", "archived"],
  interest_collection: ["selection", "confirmed", "published", "archived"],
  applications_open: ["selection", "published", "archived"],
  selection: ["confirmed", "applications_open", "interest_collection", "archived"],
  confirmed: ["live", "selection", "archived"],
  live: ["completed", "confirmed"],
  completed: ["archived"],
  archived: [],
};

export type TransitionValidation = {
  ok: boolean;
  errors: string[];
};

/** Validate event has minimum data to publish */
export function validateForPublish(event: FounderEvent): TransitionValidation {
  const errors: string[] = [];
  if (!event.title?.trim()) errors.push("Title is required.");
  if (!event.summaryLine?.trim() && !event.description?.trim()) {
    errors.push("Public copy is required.");
  }
  if (!event.registrationWorkflow) errors.push("Registration workflow is required.");
  if (!event.location?.city) errors.push("Location (city) is required.");
  if (!event.location?.country) errors.push("Country is required.");
  if (!event.cta?.trim()) errors.push("Public CTA label is required.");
  if (!event.startsOn) errors.push("Start date is required to publish.");
  return { ok: errors.length === 0, errors };
}

export function validateForApplicationsOpen(
  event: FounderEvent,
): TransitionValidation {
  const base = validateForPublish(event);
  const errors = [...base.errors];
  if (
    event.registrationWorkflow !== "application" &&
    event.registrationWorkflow !== "invitation_application"
  ) {
    errors.push(
      "Applications Open requires an application or invitation-application workflow.",
    );
  }
  // Form configuration flag — catalog events are considered configured
  if (!event.path) errors.push("Public route / form configuration is required.");
  return { ok: errors.length === 0, errors };
}

export function validateForInterestCollection(
  event: FounderEvent,
): TransitionValidation {
  const base = validateForPublish(event);
  const errors = [...base.errors];
  const interestWorkflows = ["interest", "interest_list", "invitation", "community_signup"];
  if (!interestWorkflows.includes(event.registrationWorkflow)) {
    errors.push(
      "Interest Collection requires an interest, invitation, or list workflow.",
    );
  }
  return { ok: errors.length === 0, errors };
}

export function validateForLive(
  event: FounderEvent,
  opts?: { allowOverride?: boolean },
): TransitionValidation {
  const errors: string[] = [];
  if (!opts?.allowOverride && event.startsOn) {
    const start = new Date(event.startsOn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start > today) {
      errors.push(
        "Cannot mark Live before the start date without an authorized override.",
      );
    }
  }
  return { ok: errors.length === 0, errors };
}

export function validateForArchive(opts?: {
  unresolvedRefunds?: number;
  activeFollowUps?: number;
}): TransitionValidation {
  const errors: string[] = [];
  if (opts?.unresolvedRefunds && opts.unresolvedRefunds > 0) {
    errors.push("Cannot archive with unresolved refunds.");
  }
  if (opts?.activeFollowUps && opts.activeFollowUps > 0) {
    errors.push("Cannot archive with active follow-ups.");
  }
  return { ok: errors.length === 0, errors };
}

export function canTransition(
  from: EventLifecycle,
  to: EventLifecycle,
): boolean {
  return LIFECYCLE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateTransition(
  event: FounderEvent,
  to: EventLifecycle,
  opts?: { allowLiveOverride?: boolean; unresolvedRefunds?: number; activeFollowUps?: number },
): TransitionValidation {
  const from = event.lifecycle;
  if (!canTransition(from, to)) {
    return {
      ok: false,
      errors: [`Transition from ${from} to ${to} is not allowed.`],
    };
  }

  switch (to) {
    case "published":
      return validateForPublish(event);
    case "applications_open":
      return validateForApplicationsOpen(event);
    case "interest_collection":
      return validateForInterestCollection(event);
    case "live":
      return validateForLive(event, { allowOverride: opts?.allowLiveOverride });
    case "archived":
      return validateForArchive(opts);
    default:
      return { ok: true, errors: [] };
  }
}

export function allowedNextStages(from: EventLifecycle): EventLifecycle[] {
  return LIFECYCLE_TRANSITIONS[from] ?? [];
}

export function lifecycleIndex(stage: EventLifecycle) {
  return EVENT_LIFECYCLE.indexOf(stage);
}
