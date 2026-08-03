import {
  emptyCapacity,
  type FounderEvent,
  type HubTab,
} from "@/lib/events/taxonomy";

export const eventsIntro =
  "Founder-Being creates intentional spaces where founders can slow down, think clearly, reflect honestly and build trusted relationships with fellow founders, investors and ecosystem leaders.";

/**
 * Single Events catalogue — retreats, meetups, dialogues, side events.
 * Public URLs: /events/{slug}
 */
export const eventsCatalog: FounderEvent[] = [
  {
    id: "evt_kodaikanal_full_moon_2026",
    slug: "kodaikanal-full-moon-retreat-2026",
    title: "Kodaikanal Full Moon Retreat",
    summaryLine: "26–31 August 2026 · Kodaikanal, Tamil Nadu",
    description:
      "A six-day residential immersion for 15 selected founders to rest, reflect, reconnect and return with greater clarity. Application only—no online checkout.",
    eventType: "retreat",
    registrationWorkflow: "application",
    statusBadge: "applications_open",
    lifecycle: "applications_open",
    themes: ["founder_wellbeing", "mindfulness", "leadership", "resilience"],
    location: {
      country: "India",
      state: "Tamil Nadu",
      city: "Kodaikanal",
      venuePublic:
        "A carefully selected premium nature resort. Exact property shared with confirmed participants.",
      timezone: "Asia/Kolkata",
    },
    startsOn: "2026-08-26",
    endsOn: "2026-08-31",
    cta: "Apply to Attend",
    path: "/events/kodaikanal-full-moon-retreat-2026",
    capacity: {
      ...emptyCapacity(),
      capacity: 15,
    },
    hubTabs: ["upcoming", "applications_open"],
    featured: true,
    format: "Six days / five nights residential",
    audience: "15 selected founders",
  },
  {
    id: "evt_trivandrum_meetup_2026_08",
    slug: "trivandrum-meetup-2026",
    title: "Founder-Being Gathering | Trivandrum Edition",
    summaryLine:
      "Monday, 17 August 2026 · 2:00–4:00 PM · Kerala Startup Mission, Thiruvananthapuram",
    description:
      "An intimate Founder-Being gathering for founders to connect beyond pitches, business cards and conventional networking. The afternoon combines guided reflection, small-group conversation and relaxed connection—intentionally small by design.",
    format: "Two-hour in-person gathering",
    audience: "Founders and selected ecosystem leaders",
    eventType: "community_meetup",
    registrationWorkflow: "interest",
    statusBadge: "applications_open",
    lifecycle: "published",
    themes: ["community", "founder_wellbeing", "leadership"],
    location: {
      country: "India",
      state: "Kerala",
      city: "Thiruvananthapuram",
      venuePublic: "Kerala Startup Mission",
      timezone: "Asia/Kolkata",
    },
    startsOn: "2026-08-17",
    startsAtTime: "14:00",
    endsAtTime: "16:00",
    cta: "View details & register",
    path: "/events/trivandrum-meetup-2026",
    capacity: { ...emptyCapacity(), capacity: 30 },
    hubTabs: ["upcoming", "applications_open"],
    featured: true,
    registrationProvider: "luma",
    registrationProviderEventId: "evt-K0tHGdJ3FsGRnNX",
    registrationEmbedUrl:
      "https://luma.com/embed/event/evt-K0tHGdJ3FsGRnNX/simple",
    /** Public Luma event page (verified) */
    registrationUrl: "https://luma.com/tttzwisa",
    bullets: [
      "Founder-to-founder conversation beyond networking theatre",
      "Guided reflection in a calm, institutional setting",
      "Hosted with Kerala Startup Mission, Thiruvananthapuram",
    ],
  },
  {
    id: "evt_capital_clarity_2026_09",
    slug: "capital-and-clarity-2026",
    title: "Capital & Clarity",
    subtitle: "Founder–Investor Retreat",
    summaryLine: "September 2026 · Weekend retreat · Location to be announced",
    description:
      "A private retreat bringing founders and values-aligned investors together for honest conversations about capital, growth, leadership pressure and responsible ambition.",
    bullets: [
      "Facilitated founder–investor dialogues",
      "Mindfulness and clarity sessions",
      "Nature walks and unstructured conversations",
      "Optional one-to-one investor meetings",
      "Quiet spaces for personal reflection",
    ],
    footnotes: [
      "There will be no stage pitches, crowded networking sessions or transactional introductions.",
      "Limited to 15–20 participants · Application only",
    ],
    eventType: "founder_investor_retreat",
    registrationWorkflow: "invitation_application",
    statusBadge: "invitation_only",
    lifecycle: "planning",
    themes: ["capital", "investor_relations", "leadership", "growth"],
    location: {
      country: "India",
      city: "To be announced",
      timezone: "Asia/Kolkata",
    },
    startsOn: "2026-09-01",
    cta: "Apply for an Invitation",
    path: "/events/capital-and-clarity-2026",
    capacity: { ...emptyCapacity(), capacity: 20 },
    hubTabs: ["upcoming", "coming_soon", "applications_open"],
    audience: "Founders and values-aligned investors",
  },
  {
    id: "evt_huddle_week_reset_2026_11",
    slug: "founder-reset-huddle-2026",
    title: "Huddle Week Founder Reset",
    summaryLine: "12–14 November 2026 · Kovalam–Trivandrum, Kerala",
    description:
      "An independent Founder-Being gathering planned alongside Huddle Global 2026. It will offer founders, investors and ecosystem leaders a restorative space away from the pace and noise of the main conference.",
    bullets: [
      "A guided founder reset session",
      "Curated peer and investor conversations",
      "Kerala startup ecosystem connections",
      "Mindfulness and relaxation experiences",
      "An informal evening gathering near Kovalam",
    ],
    footnotes: [
      "Huddle Global 2026 is officially scheduled for 12–14 November 2026 at The Leela Raviz Kovalam, Trivandrum. Founder-Being is not affiliated with or organising the official conference.",
    ],
    eventType: "conference_side_event",
    registrationWorkflow: "interest_list",
    statusBadge: "interest_list",
    lifecycle: "interest_collection",
    themes: ["founder_wellbeing", "community", "mindfulness", "resilience"],
    location: {
      country: "India",
      state: "Kerala",
      city: "Kovalam–Trivandrum",
      timezone: "Asia/Kolkata",
    },
    startsOn: "2026-11-12",
    endsOn: "2026-11-14",
    cta: "Join the Interest List",
    path: "/events/founder-reset-huddle-2026",
    capacity: emptyCapacity(),
    hubTabs: ["upcoming", "interest_list"],
  },
  {
    id: "evt_uae_ecosystem_day_2026_12",
    slug: "dubai-ecosystem-day-2026",
    title: "Founder-Being UAE Ecosystem Day",
    subtitle: "Ahead of Expand North Star 2026",
    summaryLine: "7 December 2026 · Dubai, UAE · Venue to be announced",
    description:
      "An independent, full-day gathering taking place one day before Expand North Star 2026. The programme will connect selected founders with investors, corporate stakeholders and ecosystem leaders from India, the Middle East and international markets.",
    bullets: [
      "Curated founder–investor meetings",
      "India–MENA market-entry conversations",
      "Investor and stakeholder roundtables",
      "Founder stories and learning circles",
      "Structured but low-pressure networking",
      "A closing mindfulness and reflection experience",
    ],
    footnotes: [
      "Expand North Star 2026 is officially scheduled for 8–10 December 2026 at the Dubai Exhibition Centre, Expo City Dubai. Founder-Being is not affiliated with or organising Expand North Star.",
      "Invitation-led · Limited capacity",
    ],
    eventType: "ecosystem_gathering",
    registrationWorkflow: "invitation",
    statusBadge: "invitation_only",
    lifecycle: "planning",
    themes: ["investor_relations", "growth", "community", "capital"],
    location: {
      country: "United Arab Emirates",
      city: "Dubai",
      venuePublic: "Venue to be announced",
      timezone: "Asia/Dubai",
    },
    startsOn: "2026-12-07",
    endsOn: "2026-12-07",
    cta: "Request an Invitation",
    path: "/events/dubai-ecosystem-day-2026",
    capacity: emptyCapacity(),
    hubTabs: ["upcoming", "coming_soon"],
  },
];

export function getEventBySlug(slug: string): FounderEvent | undefined {
  return eventsCatalog.find((e) => e.slug === slug);
}

export function getEventById(id: string): FounderEvent | undefined {
  return eventsCatalog.find((e) => e.id === id);
}

export function eventsForHubTab(tab: HubTab): FounderEvent[] {
  return eventsCatalog.filter((e) => e.hubTabs.includes(tab));
}

export function interestPath(event: FounderEvent) {
  return `/events/interest?event=${encodeURIComponent(event.slug)}`;
}

export function communityInterestPath() {
  return "/events/interest?event=community";
}

/** Map legacy interest slugs → new event slugs */
export const LEGACY_SLUG_MAP: Record<string, string> = {
  "trivandrum-meetup-august-2026": "trivandrum-meetup-2026",
  "capital-and-clarity-september-2026": "capital-and-clarity-2026",
  "huddle-week-founder-reset-2026": "founder-reset-huddle-2026",
  "uae-ecosystem-day-december-2026": "dubai-ecosystem-day-2026",
  "kodaikanal-full-moon-2026": "kodaikanal-full-moon-retreat-2026",
  "founder-being-community": "community",
};
