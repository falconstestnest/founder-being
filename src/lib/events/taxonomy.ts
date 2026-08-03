/**
 * Founder-Being Events domain — locked enums (never free-text in CMS).
 * Single Events architecture for retreats, meetups, dialogues, summits.
 */

/** Public / operational badge shown on cards */
export const EVENT_STATUS_BADGES = [
  "applications_open",
  "interest_list",
  "invitation_only",
  "planning",
  "sold_out",
  "waitlist",
  "completed",
  "draft",
] as const;

export type EventStatusBadge = (typeof EVENT_STATUS_BADGES)[number];

export const EVENT_STATUS_LABELS: Record<EventStatusBadge, string> = {
  applications_open: "Applications Open",
  interest_list: "Interest List",
  invitation_only: "Invitation Only",
  planning: "Planning",
  sold_out: "Sold Out",
  waitlist: "Waitlist",
  completed: "Completed",
  draft: "Draft",
};

/** Full operational lifecycle (CMS) */
export const EVENT_LIFECYCLE = [
  "draft",
  "planning",
  "published",
  "interest_collection",
  "applications_open",
  "selection",
  "confirmed",
  "live",
  "completed",
  "archived",
] as const;

export type EventLifecycle = (typeof EVENT_LIFECYCLE)[number];

export const EVENT_LIFECYCLE_LABELS: Record<EventLifecycle, string> = {
  draft: "Draft",
  planning: "Planning",
  published: "Published",
  interest_collection: "Interest Collection",
  applications_open: "Applications Open",
  selection: "Selection",
  confirmed: "Confirmed",
  live: "Live",
  completed: "Completed",
  archived: "Archived",
};

/** Locked event types */
export const EVENT_TYPES = [
  "retreat",
  "community_meetup",
  "reflection_circle",
  "leadership_dialogue",
  "founder_dinner",
  "founder_walk",
  "investor_dialogue",
  "conference_side_event",
  "workshop",
  "summit",
  "online_session",
  "founder_investor_retreat",
  "ecosystem_gathering",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  retreat: "Retreat",
  community_meetup: "Community Meetup",
  reflection_circle: "Reflection Circle",
  leadership_dialogue: "Leadership Dialogue",
  founder_dinner: "Founder Dinner",
  founder_walk: "Founder Walk",
  investor_dialogue: "Investor Dialogue",
  conference_side_event: "Conference Side Event",
  workshop: "Workshop",
  summit: "Summit",
  online_session: "Online Session",
  founder_investor_retreat: "Founder–Investor Retreat",
  ecosystem_gathering: "Ecosystem Gathering",
};

/** Registration workflow (how people join) */
export const REGISTRATION_WORKFLOWS = [
  "interest",
  "interest_list",
  "application",
  "invitation",
  "invitation_application",
  "community_signup",
] as const;

export type RegistrationWorkflow = (typeof REGISTRATION_WORKFLOWS)[number];

export const REGISTRATION_WORKFLOW_LABELS: Record<RegistrationWorkflow, string> = {
  interest: "Interest Registration",
  interest_list: "Interest List",
  application: "Application",
  invitation: "Invitation Request",
  invitation_application: "Invitation Application",
  community_signup: "Community Signup",
};

/** Themes for discovery & analytics */
export const EVENT_THEMES = [
  "founder_wellbeing",
  "leadership",
  "capital",
  "fundraising",
  "mindfulness",
  "purpose",
  "growth",
  "community",
  "investor_relations",
  "resilience",
] as const;

export type EventTheme = (typeof EVENT_THEMES)[number];

export const EVENT_THEME_LABELS: Record<EventTheme, string> = {
  founder_wellbeing: "Founder Wellbeing",
  leadership: "Leadership",
  capital: "Capital",
  fundraising: "Fundraising",
  mindfulness: "Mindfulness",
  purpose: "Purpose",
  growth: "Growth",
  community: "Community",
  investor_relations: "Investor Relations",
  resilience: "Resilience",
};

/** Hub filters (public) */
export const HUB_TABS = [
  "upcoming",
  "applications_open",
  "interest_list",
  "past",
  "coming_soon",
] as const;

export type HubTab = (typeof HUB_TABS)[number];

export const HUB_TAB_LABELS: Record<HubTab, string> = {
  upcoming: "Upcoming",
  applications_open: "Applications Open",
  interest_list: "Interest List",
  past: "Past Gatherings",
  coming_soon: "Coming Soon",
};

export type EventCapacity = {
  capacity: number | null;
  applications: number;
  invited: number;
  confirmed: number;
  paid: number;
  waitlisted: number;
  declined: number;
  attended: number;
  noShow: number;
};

export const emptyCapacity = (): EventCapacity => ({
  capacity: null,
  applications: 0,
  invited: 0,
  confirmed: 0,
  paid: 0,
  waitlisted: 0,
  declined: 0,
  attended: 0,
  noShow: 0,
});

export type EventLocation = {
  country: string;
  state?: string;
  city: string;
  venue?: string;
  venuePublic?: string;
  timezone: string;
};

export type FounderEvent = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  /** Short meta line for cards */
  summaryLine: string;
  description: string;
  bullets?: string[];
  footnotes?: string[];
  format?: string;
  audience?: string;
  eventType: EventType;
  registrationWorkflow: RegistrationWorkflow;
  /** Public-facing status badge */
  statusBadge: EventStatusBadge;
  /** Full CMS lifecycle */
  lifecycle: EventLifecycle;
  themes: EventTheme[];
  location: EventLocation;
  /** ISO dates when known */
  startsOn?: string;
  endsOn?: string;
  /** Optional clock time for public display (local to location.timezone) */
  startsAtTime?: string;
  endsAtTime?: string;
  cta: string;
  /** Path under /events or absolute path for legacy deep pages */
  path: string;
  capacity: EventCapacity;
  /** Hub grouping overrides */
  hubTabs: HubTab[];
  featured?: boolean;
  /** External registration (e.g. Luma) — never invent URLs */
  registrationProvider?: "luma" | "internal" | "none";
  /** Trusted HTTPS embed URL (iframe src) */
  registrationEmbedUrl?: string;
  /** Public registration page for fallback (new tab) */
  registrationUrl?: string;
  registrationProviderEventId?: string;
};
