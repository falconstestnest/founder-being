/**
 * Admin Events data layer — catalog is source of public event definitions.
 * Participation counts are derived when records exist (empty until DB wired).
 */

import { eventsCatalog, getEventById, getEventBySlug } from "@/lib/events/catalog";
import {
  deriveCapacity,
  emptyDerivedCapacity,
  type DerivedCapacity,
  type ParticipationStatus,
} from "@/lib/events/participation";
import type { FounderEvent } from "@/lib/events/taxonomy";
import { getServiceSupabase } from "@/lib/supabase/server";

export type EventOpsRecord = FounderEvent & {
  derived: DerivedCapacity;
  openTasks: number;
  upcomingDeadlines: { label: string; date: string }[];
  recentActivity: { at: string; label: string }[];
};

async function loadParticipationStatuses(
  eventId: string,
): Promise<ParticipationStatus[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("event_participation")
    .select("status")
    .eq("event_id", eventId);

  if (error || !data) return [];
  return data.map((r) => r.status as ParticipationStatus);
}

export async function listAdminEvents(): Promise<EventOpsRecord[]> {
  const rows: EventOpsRecord[] = [];
  for (const event of eventsCatalog) {
    const statuses = await loadParticipationStatuses(event.id);
    const derived = deriveCapacity(event.capacity.capacity, statuses);
    rows.push({
      ...event,
      derived,
      openTasks: 0,
      upcomingDeadlines: deadlinesForEvent(event),
      recentActivity: [],
    });
  }
  return rows;
}

export async function getAdminEvent(
  eventIdOrSlug: string,
): Promise<EventOpsRecord | null> {
  const event =
    getEventById(eventIdOrSlug) || getEventBySlug(eventIdOrSlug) || null;
  if (!event) return null;

  const statuses = await loadParticipationStatuses(event.id);
  const derived =
    statuses.length > 0
      ? deriveCapacity(event.capacity.capacity, statuses)
      : emptyDerivedCapacity(event.capacity.capacity);

  return {
    ...event,
    derived,
    openTasks: 0,
    upcomingDeadlines: deadlinesForEvent(event),
    recentActivity: [
      {
        at: new Date().toISOString(),
        label: "Event loaded from catalogue (participation empty until DB records exist)",
      },
    ],
  };
}

function deadlinesForEvent(event: FounderEvent) {
  const items: { label: string; date: string }[] = [];
  if (event.startsOn) {
    items.push({ label: "Event starts", date: event.startsOn });
  }
  if (event.endsOn) {
    items.push({ label: "Event ends", date: event.endsOn });
  }
  return items;
}

/** Safe duplicate of event config — never copies participants, payments, audit */
export function buildDuplicateDraft(
  source: FounderEvent,
  options: {
    public_content?: boolean;
    capacity?: boolean;
  } = { public_content: true, capacity: true },
): Partial<FounderEvent> {
  const draft: Partial<FounderEvent> = {
    id: `evt_copy_${Date.now()}`,
    slug: `${source.slug}-copy`,
    eventType: source.eventType,
    registrationWorkflow: source.registrationWorkflow,
    statusBadge: "draft",
    lifecycle: "draft",
    themes: [...source.themes],
    location: { ...source.location },
    path: `/events/${source.slug}-copy`,
    hubTabs: ["coming_soon"],
    featured: false,
    cta: source.cta,
  };

  if (options.public_content !== false) {
    draft.title = `${source.title} (Copy)`;
    draft.subtitle = source.subtitle;
    draft.summaryLine = source.summaryLine;
    draft.description = source.description;
    draft.bullets = source.bullets ? [...source.bullets] : undefined;
    draft.footnotes = source.footnotes ? [...source.footnotes] : undefined;
    draft.format = source.format;
    draft.audience = source.audience;
  }

  if (options.capacity !== false) {
    draft.capacity = {
      capacity: source.capacity.capacity,
      applications: 0,
      invited: 0,
      confirmed: 0,
      paid: 0,
      waitlisted: 0,
      declined: 0,
      attended: 0,
      noShow: 0,
    };
  }

  // Explicitly never copy: participants, applications, payments, audit, sent comms, analytics
  return draft;
}
