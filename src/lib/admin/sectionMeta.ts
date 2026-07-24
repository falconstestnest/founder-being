export const sectionMeta: Record<
  string,
  { title: string; description: string; primary: string }
> = {
  community: {
    title: "Community",
    description: "The Founder-Being community at a glance—not a marketing CRM.",
    primary: "Invite founder",
  },
  events: {
    title: "Events",
    description:
      "Single Events domain: retreats, meetups, dialogues, side events—lifecycle, capacity, people.",
    primary: "Create event",
  },
  applications: {
    title: "Applications",
    description: "Review, select, waitlist, or decline—one primary action at a time.",
    primary: "Review application",
  },
  retreats: {
    title: "Retreats (deprecated)",
    description: "Compatibility pointer → Events (type = retreat). Do not add features here.",
    primary: "Open Events",
  },
  gatherings: {
    title: "Gatherings (deprecated)",
    description: "Compatibility pointer → Events. Temporary only.",
    primary: "Open Events",
  },
  patrons: {
    title: "Patrons",
    description: "Founding Patron Circle—simple CRM, not a sales funnel.",
    primary: "Add patron",
  },
  communications: {
    title: "Communications",
    description: "Chronological record of calls, email, WhatsApp, and notes.",
    primary: "Log interaction",
  },
  content: {
    title: "Content",
    description: "Public site and programme content under calm editorial control.",
    primary: "Edit content",
  },
  people: {
    title: "People",
    description: "Founder directory—everything important on one profile later.",
    primary: "Find founder",
  },
  analytics: {
    title: "Analytics",
    description: "Numbers first. No decorative charts.",
    primary: "View report",
  },
  settings: {
    title: "Settings",
    description: "Workspace, roles, and operational configuration.",
    primary: "Save changes",
  },
  help: {
    title: "Help",
    description: "Guides for operators. Calm, short, searchable.",
    primary: "Open design PRD",
  },
  profile: {
    title: "Profile",
    description: "Your operator identity and notification preferences.",
    primary: "Update profile",
  },
};
