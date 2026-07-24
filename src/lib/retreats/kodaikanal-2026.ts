/**
 * Kodaikanal Full Moon Retreat 2026 — public configuration.
 * Operational values should eventually load from Supabase `retreats` row;
 * this module is the single frontend source until CMS wiring is complete.
 */

export const kodaikanalRetreat = {
  slug: "kodaikanal-full-moon-2026",
  path: "/retreats/kodaikanal-full-moon-2026",
  title: "Kodaikanal Full Moon Retreat",
  organisation: "Founder-Being",
  eyebrow: "Founder-Being presents",
  headline: "Kodaikanal Full Moon Retreat",
  subheadline:
    "A six-day residential immersion for 15 founders to rest, reflect, reconnect and return with greater clarity.",
  datesLabel: "26–31 August 2026",
  startsAt: "2026-08-26",
  endsAt: "2026-08-31",
  durationLabel: "Six days / five nights",
  locationPublic: "Kodaikanal, Tamil Nadu",
  venuePublic:
    "A carefully selected premium nature resort in Kodaikanal. The exact property and arrival details will be shared with confirmed participants.",
  departurePoint: "Kochi",
  capacity: 15,
  minimumPaid: 12,
  earlyBirdCapacity: 5,
  earlyBirdPriceInr: 54500,
  standardPriceInr: 57500,
  depositInr: 15000,
  contactDeadlineLabel: "3 August 2026",
  goNoGoDateLabel: "10 August 2026",
  balanceDueLabel: "14 August 2026",
  /** Admin flag: publish Anjaan only after written confirmation. */
  facilitatorPublic: false,
  facilitator: {
    name: "Anjaan",
    role: "Lead Guru and Facilitator",
    bio: "Yoga, breathwork, meditation, founder-focused reflective immersions, full-moon practice, and Yoga Nidra.",
    roles: [
      "Yoga and mindful movement",
      "Breathwork and evening meditation",
      "Founder-focused reflective immersions",
      "Full-moon meditation",
      "Mindfulness and deep relaxation",
      "Yoga Nidra and nervous-system regulation practices",
      "Closing integration circle",
    ],
  },
  status: "open" as "draft" | "open" | "closed" | "confirmed" | "postponed" | "cancelled" | "completed",
  seo: {
    title: "Founder Being Full Moon Retreat, Kodaikanal | 26–31 August 2026",
    description:
      "Apply for a six-day Founder Being retreat in Kodaikanal for 15 selected founders—mindfulness, meditation, reflection, focused work and honest founder conversations.",
  },
  supportEmail: "hello@founderbeing.org",
  supportWhatsapp: "",
} as const;

export const retreatFacts = [
  { label: "Dates", value: kodaikanalRetreat.datesLabel },
  { label: "Location", value: kodaikanalRetreat.locationPublic },
  { label: "Duration", value: kodaikanalRetreat.durationLabel },
  { label: "Format", value: "Application and approval required" },
  {
    label: "Fee from",
    value: `₹${kodaikanalRetreat.earlyBirdPriceInr.toLocaleString("en-IN")}`,
  },
] as const;

export const whyExists = {
  intro:
    "Founders are taught to raise capital, build teams, ship products and scale companies. Very few are taught how to carry uncertainty, responsibility, loneliness and ambition without losing themselves.",
  /** Full intro string — UI may split for pull-quote treatment */
  lead:
    "Founders are taught to raise capital, build teams, ship products and scale companies.",
  pullQuote:
    "Very few are taught how to carry uncertainty, responsibility, loneliness and ambition without losing themselves.",
  points: [
    "Step away from operational noise.",
    "Recover from sustained pressure.",
    "Examine identity, ambition, fear and responsibility.",
    "Develop practical mindfulness and relaxation tools.",
    "Work quietly when required.",
    "Build honest relationships with other founders.",
  ],
} as const;

export const whoShouldApply = [
  "Startup founders and co-founders",
  "Founder-operators carrying business pressure, uncertainty or major decisions",
  "Founders willing to participate respectfully in reflection, mindfulness and peer conversation",
  "Founders comfortable with a curated cohort and twin-sharing accommodation",
] as const;

export const programme = [
  {
    day: "Day 1",
    date: "Wednesday, 26 August",
    title: "Journey, arrival and grounding",
    items: [
      "Depart Kochi at approximately 6:30 AM.",
      "Breakfast and lunch during the journey.",
      "Arrive and check in during the afternoon.",
      "Rest and welcome tea.",
      "Opening circle.",
      "Gentle grounding meditation.",
      "Group dinner and early rest.",
    ],
  },
  {
    day: "Day 2",
    date: "Thursday, 27 August",
    title: "Rest and decompression",
    items: [
      "Unstructured morning and breakfast.",
      "Optional nature walk.",
      "Rest, journalling and quiet work.",
      "Free afternoon.",
      "Evening breathwork and guided meditation.",
      "Group dinner and reflection.",
    ],
  },
  {
    day: "Day 3",
    date: "Friday, 28 August",
    title: "Founder immersion and full-moon practice",
    items: [
      "Morning yoga and reflective practice.",
      "Founder immersion exploring pressure, identity, ambition, fear and responsibility.",
      "Lunch and rest.",
      "Free time for work, journalling or one-to-one conversations.",
      "Full-moon meditation led by the facilitator.",
      "Silent or reflective dinner.",
    ],
  },
  {
    day: "Day 4",
    date: "Saturday, 29 August",
    title: "Mindfulness and inner regulation",
    items: [
      "Morning mindful movement or meditation.",
      "Mindfulness and attention session.",
      "Deep-relaxation and nervous-system regulation practice.",
      "Lunch and free work/rest time.",
      "Optional nature walk.",
      "Evening Yoga Nidra and meditation.",
    ],
  },
  {
    day: "Day 5",
    date: "Sunday, 30 August",
    title: "Founder connection and integration",
    items: [
      "Slow, unstructured morning.",
      "Founder networking and peer conversations.",
      "Free time, optional local activity or quiet work.",
      "Personal reflection.",
      "Closing circle.",
      "Final evening meditation.",
      "Prepare for departure.",
    ],
  },
  {
    day: "Day 6",
    date: "Monday, 31 August",
    title: "Return",
    items: [
      "Breakfast and short morning grounding.",
      "Check out and depart at approximately 8:00 AM.",
      "Lunch during the return journey.",
      "Expected Kochi arrival between 4:00 PM and 6:00 PM.",
    ],
  },
] as const;

export const included = [
  "Round-trip group transportation from Kochi to Kodaikanal",
  "Five nights of twin-sharing accommodation",
  "Breakfast, lunch, dinner, tea and planned travel refreshments",
  "All scheduled yoga, meditation, mindfulness and founder-immersion sessions",
  "Access to the indoor retreat/work space",
  "Retreat journal or participant kit",
  "Founder networking and facilitated group conversations",
] as const;

export const excluded = [
  "Travel to and from Kochi",
  "Personal purchases",
  "Spa treatments or optional paid resort activities",
  "Private-room supplements, unless separately offered",
  "Personal travel or medical insurance",
  "Medical or psychological treatment",
] as const;

export const applicationSteps = [
  {
    title: "Apply",
    body: "Share who you are, why you want to join, and practical logistics. No payment is taken on this website.",
  },
  {
    title: "Review",
    body: "Every application is reviewed personally by the Founder-Being team.",
  },
  {
    title: "Selection",
    body: "A curated cohort of up to 15 founders is selected based on fit, intent and balance—not funding or fame alone.",
  },
  {
    title: "Personal contact",
    body: `If selected in the first round, we contact you by phone or WhatsApp by ${kodaikanalRetreat.contactDeadlineLabel}.`,
  },
  {
    title: "Private payment",
    body: `A reservation deposit of ₹${kodaikanalRetreat.depositInr.toLocaleString("en-IN")} is shared privately. Full payment follows after go/no-go confirmation.`,
  },
  {
    title: "Confirmation",
    body: "Your seat is confirmed only after selection and receipt of the required payment.",
  },
] as const;

export const importantDates = [
  { label: "Applications open", value: "Now" },
  { label: "Selected founders contacted by", value: kodaikanalRetreat.contactDeadlineLabel },
  { label: "Minimum cohort target (deposits)", value: "8 August 2026" },
  { label: "Go / no-go decision", value: kodaikanalRetreat.goNoGoDateLabel },
  { label: "Remaining balance due", value: kodaikanalRetreat.balanceDueLabel },
  { label: "Retreat", value: kodaikanalRetreat.datesLabel },
] as const;

export const faqs = [
  {
    q: "Is this a ticket I can buy online?",
    a: "No. This is an application-based retreat. Applying does not reserve a seat. Payment instructions are shared privately only after selection.",
  },
  {
    q: "How many founders will attend?",
    a: `Up to ${kodaikanalRetreat.capacity} paying founders. The retreat proceeds only if a minimum of ${kodaikanalRetreat.minimumPaid} paid founders is achieved.`,
  },
  {
    q: "Where will we stay?",
    a: kodaikanalRetreat.venuePublic,
  },
  {
    q: "Do I need to travel from Kochi?",
    a: "Group transport runs from Kochi. You may indicate if you will join that journey or make your own arrangements when you apply.",
  },
  {
    q: "Is accommodation twin-sharing?",
    a: "Yes. Twin-sharing is the default. You must be comfortable with twin-sharing to apply.",
  },
  {
    q: "What is the early-bird fee?",
    a: `₹${kodaikanalRetreat.earlyBirdPriceInr.toLocaleString("en-IN")} for the first five selected founders whose reservation deposits clear. Standard fee is ₹${kodaikanalRetreat.standardPriceInr.toLocaleString("en-IN")}.`,
  },
  {
    q: "Is this medical or therapeutic treatment?",
    a: "No. Founder-Being is a wellbeing and reflective community experience. It is not a medical, psychiatric or psychological treatment programme. All practices are voluntary.",
  },
  {
    q: "What if the retreat is postponed or cancelled?",
    a: "If Founder-Being cancels, payments are refunded in full. If the minimum cohort is not achieved, applicants may choose a full refund or transfer to a rescheduled retreat. Final policy details are confirmed before payment.",
  },
] as const;

export const startupStages = [
  "Idea / pre-launch",
  "Early revenue",
  "Growing",
  "Scaling",
  "Mature / established",
  "Between ventures",
] as const;

export const dietaryOptions = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Jain",
  "Other (we will ask later if selected)",
] as const;

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
