/**
 * Guarded lifecycle transitions for the Event entity.
 * Does not touch Person graph or participation.
 */

import {
  validateTransition,
  type TransitionValidation,
} from "@/lib/events/lifecycle";
import { getEventById, getEventBySlug } from "@/lib/events/catalog";
import {
  EVENT_LIFECYCLE,
  type EventLifecycle,
  type FounderEvent,
} from "@/lib/events/taxonomy";
import { getServiceSupabase } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export type TransitionResult =
  | {
      ok: true;
      eventId: string;
      from: EventLifecycle;
      to: EventLifecycle;
      auditId: string | null;
    }
  | {
      ok: false;
      status: number;
      error: string;
      errors?: string[];
    };

function isLifecycle(value: string): value is EventLifecycle {
  return (EVENT_LIFECYCLE as readonly string[]).includes(value);
}

/** Merge catalogue definition with DB lifecycle override when present. */
export async function resolveEventForOps(
  eventIdOrSlug: string,
): Promise<FounderEvent | null> {
  const base =
    getEventById(eventIdOrSlug) || getEventBySlug(eventIdOrSlug) || null;
  if (!base) return null;

  const supabase = getServiceSupabase();
  if (!supabase) return base;

  const { data } = await supabase
    .from("events")
    .select("lifecycle, status_badge")
    .eq("id", base.id)
    .maybeSingle();

  if (!data?.lifecycle || !isLifecycle(data.lifecycle)) return base;

  return {
    ...base,
    lifecycle: data.lifecycle,
    statusBadge: (data.status_badge as FounderEvent["statusBadge"]) || base.statusBadge,
  };
}

function catalogToEventsRow(event: FounderEvent, lifecycle: EventLifecycle) {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle ?? null,
    summary_line: event.summaryLine,
    description: event.description,
    event_type: event.eventType,
    registration_workflow: event.registrationWorkflow,
    status_badge: event.statusBadge,
    lifecycle,
    themes: event.themes,
    country: event.location.country,
    state: event.location.state ?? null,
    city: event.location.city,
    venue: event.location.venue ?? null,
    venue_public: event.location.venuePublic ?? null,
    timezone: event.location.timezone,
    starts_on: event.startsOn ?? null,
    ends_on: event.endsOn ?? null,
    capacity: event.capacity.capacity,
    cta: event.cta,
    public_path: event.path,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Apply a guarded lifecycle transition.
 * Order: validate → write audit (ok or fail attempt optional) → update events row.
 * Failed validation still may write an audit with validation_ok=false when requested.
 */
export async function applyLifecycleTransition(input: {
  eventId: string;
  to: EventLifecycle;
  actorProfileId: string;
  reason?: string | null;
  allowLiveOverride?: boolean;
  unresolvedRefunds?: number;
  activeFollowUps?: number;
}): Promise<TransitionResult> {
  const event = await resolveEventForOps(input.eventId);
  if (!event) {
    return { ok: false, status: 404, error: "Event not found." };
  }

  const from = event.lifecycle;
  const validation: TransitionValidation = validateTransition(event, input.to, {
    allowLiveOverride: input.allowLiveOverride,
    unresolvedRefunds: input.unresolvedRefunds,
    activeFollowUps: input.activeFollowUps,
  });

  const supabase = getServiceSupabase();
  if (!supabase) {
    return {
      ok: false,
      status: 503,
      error: "Database is not configured. Lifecycle cannot be persisted.",
    };
  }

  if (!validation.ok) {
    await insertAudit(supabase, {
      eventId: event.id,
      from,
      to: input.to,
      actorProfileId: input.actorProfileId,
      validationOk: false,
      errors: validation.errors,
      reason: input.reason,
    });
    return {
      ok: false,
      status: 400,
      error: "Transition validation failed.",
      errors: validation.errors,
    };
  }

  // Ensure event row exists (catalogue-backed upsert), then update lifecycle
  const row = catalogToEventsRow(event, input.to);
  const { error: upsertError } = await supabase.from("events").upsert(row, {
    onConflict: "id",
  });

  if (upsertError) {
    console.error("[lifecycle:upsert]", upsertError.message);
    return {
      ok: false,
      status: 500,
      error: "Could not update event lifecycle.",
    };
  }

  const auditId = await insertAudit(supabase, {
    eventId: event.id,
    from,
    to: input.to,
    actorProfileId: input.actorProfileId,
    validationOk: true,
    errors: [],
    reason: input.reason,
  });

  return {
    ok: true,
    eventId: event.id,
    from,
    to: input.to,
    auditId,
  };
}

async function insertAudit(
  supabase: SupabaseClient,
  input: {
    eventId: string;
    from: EventLifecycle;
    to: EventLifecycle;
    actorProfileId: string;
    validationOk: boolean;
    errors: string[];
    reason?: string | null;
  },
): Promise<string | null> {
  const { data, error } = await supabase
    .from("event_lifecycle_audit")
    .insert({
      event_id: input.eventId,
      from_stage: input.from,
      to_stage: input.to,
      actor_profile_id: input.actorProfileId,
      validation_ok: input.validationOk,
      errors: input.errors.length ? input.errors : null,
      reason: input.reason?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[lifecycle:audit]", error.message);
    return null;
  }
  return (data?.id as string) ?? null;
}

export async function listLifecycleAudit(eventId: string, limit = 20) {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("event_lifecycle_audit")
    .select(
      "id, from_stage, to_stage, actor_profile_id, validation_ok, errors, reason, created_at",
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
