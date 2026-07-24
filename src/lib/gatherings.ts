/**
 * @deprecated Use `src/lib/events/*` — single Events domain model.
 * Compatibility bridge for older imports.
 */

import {
  eventsCatalog,
  eventsIntro,
  getEventById,
  getEventBySlug,
  interestPath,
} from "@/lib/events/catalog";
import {
  EVENT_TYPE_LABELS,
  REGISTRATION_WORKFLOW_LABELS,
} from "@/lib/events/taxonomy";

export const gatheringsIntro = eventsIntro;

export const gatherings = eventsCatalog.map((e) => ({
  id: e.id,
  slug: e.slug,
  title: e.title,
  subtitle: e.subtitle,
  meta: e.summaryLine,
  description: e.description,
  bullets: e.bullets,
  footnotes: e.footnotes,
  format: e.format,
  audience: e.audience,
  capacity:
    e.capacity.capacity != null ? String(e.capacity.capacity) : undefined,
  status: e.statusBadge,
  eventType: EVENT_TYPE_LABELS[e.eventType],
  registrationWorkflow:
    REGISTRATION_WORKFLOW_LABELS[e.registrationWorkflow],
  city: e.location.city,
  region: e.location.state,
  cta: e.cta,
  detailHref: e.path,
}));

export function getGatheringBySlug(slug: string) {
  return getEventBySlug(slug);
}

export function getGatheringById(id: string) {
  return getEventById(id);
}

export function interestFormPath(g: { slug: string }) {
  const event = getEventBySlug(g.slug);
  if (event) return interestPath(event);
  return `/events/interest?event=${encodeURIComponent(g.slug)}`;
}

export const communityCta = {
  id: "evt_community_general",
  slug: "community",
  title: "More Gatherings Coming Soon",
  description:
    "Founder circles, investor conversations, conscious-leadership retreats and ecosystem gatherings are being developed across India and the Middle East.",
  eventType: "Community",
  registrationWorkflow: "Community Signup",
  city: "Multiple",
  cta: "Join the Founder-Being Community",
  status: "Open",
};

export const residentialHighlight = {
  id: "evt_kodaikanal_full_moon_2026",
  slug: "kodaikanal-full-moon-retreat-2026",
  title: "Kodaikanal Full Moon Retreat",
  meta: "26–31 August 2026 · Kodaikanal, Tamil Nadu",
  description:
    "A six-day residential immersion for 15 selected founders—application only.",
  eventType: "Retreat",
  registrationWorkflow: "Application",
  city: "Kodaikanal",
  status: "Applications Open",
  cta: "Apply to Attend",
  href: "/events/kodaikanal-full-moon-retreat-2026",
};
