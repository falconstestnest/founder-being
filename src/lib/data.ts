export const pillars = [
  {
    title: "Reflection",
    description: "Thoughtful conversations and founder circles.",
  },
  {
    title: "Connection",
    description: "Authentic relationships beyond networking.",
  },
  {
    title: "Wellbeing",
    description: "Practices that support long-term resilience.",
  },
  {
    title: "Leadership",
    description: "Building healthier leaders alongside healthier companies.",
  },
] as const;

export const missionTimeline = [
  "Kerala",
  "India",
  "Middle East",
  "Southeast Asia",
  "Global",
] as const;

export const impactAreas = [
  { title: "Monthly Founder Gatherings", icon: "gatherings" },
  { title: "Founder Reflection Circles", icon: "circles" },
  { title: "Leadership Dialogues", icon: "dialogues" },
  { title: "Founder Retreats", icon: "retreats" },
  { title: "Wellbeing Workshops", icon: "workshops" },
  { title: "Research", icon: "research" },
  { title: "Podcast", icon: "podcast" },
  { title: "Institutional Partnerships", icon: "partnerships" },
] as const;

/** Placeholder structure only — replace with verified figures before launch. */
export const statistics = [
  {
    value: "—",
    headline: "of founders report mental health challenges.",
    source: "Source forthcoming — not published until verified.",
  },
  {
    value: "—",
    headline: "experience prolonged isolation during the journey.",
    source: "Source forthcoming — not published until verified.",
  },
  {
    value: "—",
    headline: "say wellbeing support would improve decision quality.",
    source: "Source forthcoming — not published until verified.",
  },
] as const;

export const events = [
  {
    title: "Kodaikanal Full Moon Retreat",
    location: "Kodaikanal, Tamil Nadu",
    date: "26–31 August 2026",
    seatsRemaining: "15 founders · Application only",
    status: "Next Event" as const,
    href: "/retreats/kodaikanal-full-moon-2026",
    cta: "Apply to Attend",
  },
  {
    title: "Founder Reflection Circle",
    location: "Kochi, Kerala",
    date: "Date to be announced",
    seatsRemaining: "Limited seats",
    status: "Upcoming" as const,
    href: "#contact",
    cta: "Register Interest",
  },
  {
    title: "Conscious Leadership Dialogue",
    location: "Dubai, UAE",
    date: "Date to be announced",
    seatsRemaining: "Registration opens soon",
    status: "Upcoming" as const,
    href: "#contact",
    cta: "Register Interest",
  },
] as const;

export const patronBenefits = [
  {
    title: "Recognition",
    description: "Acknowledgement as a Founding Patron of the initiative.",
  },
  {
    title: "Legacy",
    description: "A lasting role in shaping a healthier founder culture.",
  },
  {
    title: "Community",
    description: "Access to a trusted circle of visionary leaders.",
  },
  {
    title: "Impact",
    description: "Direct contribution to gatherings and programmes.",
  },
  {
    title: "Private Gatherings",
    description: "Invitations to intimate patron convenings.",
  },
  {
    title: "Thought Leadership",
    description: "Opportunities to contribute insight and perspective.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "A rare space where ambition and care for the self are not treated as opposites.",
    attribution: "Founder, early-stage venture",
  },
  {
    quote:
      "Quiet, intentional, and human. Exactly what the ecosystem has been missing.",
    attribution: "Ecosystem leader",
  },
  {
    quote:
      "I left with clearer priorities—and a sense that I did not have to build alone.",
    attribution: "Founder, growth-stage company",
  },
] as const;
