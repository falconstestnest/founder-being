/**
 * Public gatherings + CMS event classifications.
 * Each record maps to a future CMS event with registration workflow.
 */

export type EventType =
  | "Community Meetup"
  | "Founder–Investor Retreat"
  | "Conference-Side Gathering"
  | "Ecosystem Gathering"
  | "Residential Retreat"
  | "Community";

export type RegistrationWorkflow =
  | "Interest Registration"
  | "Invitation Application"
  | "Interest List"
  | "Invitation Request"
  | "Retreat Application"
  | "Community Signup";

export type GatheringStatus = "Planning" | "Open" | "Closed" | "Completed";

export type Gathering = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  /** When / where line under title */
  meta: string;
  description: string;
  bullets?: string[];
  footnotes?: string[];
  format?: string;
  audience?: string;
  capacity?: string;
  status: GatheringStatus;
  eventType: EventType;
  registrationWorkflow: RegistrationWorkflow;
  city: string;
  region?: string;
  cta: string;
  /** External detail page if any */
  detailHref?: string;
  featured?: boolean;
};

export const gatheringsIntro =
  "Founder-Being creates intentional spaces where founders can slow down, think clearly, reflect honestly and build trusted relationships with fellow founders, investors and ecosystem leaders.";

export const gatherings: Gathering[] = [
  {
    id: "evt_trivandrum_meetup_2026_08",
    slug: "trivandrum-meetup-august-2026",
    title: "Founder-Being Trivandrum Meetup",
    meta: "August 2026 · Trivandrum, Kerala · Venue to be announced",
    description:
      "An intimate gathering for founders to connect beyond pitches, business cards and conventional networking. The evening will combine guided reflection, small-group conversations and relaxed connection over tea.",
    format: "Two-hour community gathering",
    audience: "Founders and selected ecosystem leaders",
    capacity: "Approximately 25–30 participants",
    status: "Planning",
    eventType: "Community Meetup",
    registrationWorkflow: "Interest Registration",
    city: "Trivandrum",
    region: "Kerala",
    cta: "Express Interest",
  },
  {
    id: "evt_capital_clarity_2026_09",
    slug: "capital-and-clarity-september-2026",
    title: "Capital & Clarity",
    subtitle: "Founder–Investor Retreat",
    meta: "September 2026 · Weekend retreat · Location to be announced",
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
    status: "Planning",
    eventType: "Founder–Investor Retreat",
    registrationWorkflow: "Invitation Application",
    city: "To be announced",
    region: "India",
    cta: "Apply for an Invitation",
    capacity: "15–20 participants",
  },
  {
    id: "evt_huddle_week_reset_2026_11",
    slug: "huddle-week-founder-reset-2026",
    title: "Huddle Week Founder Reset",
    meta: "12–14 November 2026 · Kovalam–Trivandrum, Kerala",
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
    status: "Planning",
    eventType: "Conference-Side Gathering",
    registrationWorkflow: "Interest List",
    city: "Kovalam–Trivandrum",
    region: "Kerala",
    cta: "Join the Interest List",
  },
  {
    id: "evt_uae_ecosystem_day_2026_12",
    slug: "uae-ecosystem-day-december-2026",
    title: "Founder-Being UAE Ecosystem Day",
    subtitle: "Ahead of Expand North Star 2026",
    meta: "7 December 2026 · Dubai, UAE · Venue to be announced",
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
      "Expand North Star 2026 is officially scheduled for 8–10 December 2026 at the Dubai Exhibition Centre, Expo City Dubai. The Founder-Being UAE Ecosystem Day is proposed for Monday, 7 December 2026, one day before the official show begins. Founder-Being is not affiliated with or organising Expand North Star.",
      "Invitation-led · Limited capacity",
    ],
    status: "Planning",
    eventType: "Ecosystem Gathering",
    registrationWorkflow: "Invitation Request",
    city: "Dubai",
    region: "UAE",
    cta: "Request an Invitation",
  },
];

/** Residential retreat — separate product surface, linked from gatherings. */
export const residentialHighlight = {
  id: "evt_kodaikanal_full_moon_2026",
  slug: "kodaikanal-full-moon-2026",
  title: "Kodaikanal Full Moon Retreat",
  meta: "26–31 August 2026 · Kodaikanal, Tamil Nadu",
  description:
    "A six-day residential immersion for 15 selected founders—application only.",
  eventType: "Residential Retreat" as EventType,
  registrationWorkflow: "Retreat Application" as RegistrationWorkflow,
  city: "Kodaikanal",
  status: "Open" as GatheringStatus,
  cta: "Apply to Attend",
  href: "/retreats/kodaikanal-full-moon-2026",
};

export const communityCta = {
  id: "evt_community_general",
  slug: "founder-being-community",
  title: "More Gatherings Coming Soon",
  description:
    "Founder circles, investor conversations, conscious-leadership retreats and ecosystem gatherings are being developed across India and the Middle East.",
  eventType: "Community" as EventType,
  registrationWorkflow: "Community Signup" as RegistrationWorkflow,
  city: "Multiple",
  cta: "Join the Founder-Being Community",
  status: "Open" as GatheringStatus,
};

export function getGatheringBySlug(slug: string): Gathering | undefined {
  return gatherings.find((g) => g.slug === slug);
}

export function getGatheringById(id: string): Gathering | undefined {
  return gatherings.find((g) => g.id === id);
}

export function interestFormPath(gathering: Pick<Gathering, "slug">) {
  return `/gatherings/interest?event=${encodeURIComponent(gathering.slug)}`;
}

/** CMS classification table for ops docs */
export const gatheringCmsTable = gatherings.map((g) => ({
  event: g.title,
  eventType: g.eventType,
  registrationWorkflow: g.registrationWorkflow,
  status: g.status,
  eventId: g.id,
}));
