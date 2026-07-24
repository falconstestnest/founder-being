import type { FounderEvent, RegistrationWorkflow } from "@/lib/events/taxonomy";

export type EventAdminTabId =
  | "overview"
  | "participation"
  | "applications"
  | "interest"
  | "invitations"
  | "participants"
  | "payments"
  | "communications"
  | "operations"
  | "documents"
  | "settings";

export type EventAdminTab = {
  id: EventAdminTabId;
  label: string;
};

const ALL_TABS: EventAdminTab[] = [
  { id: "overview", label: "Overview" },
  { id: "participation", label: "Participation" },
  { id: "applications", label: "Applications" },
  { id: "interest", label: "Interest" },
  { id: "invitations", label: "Invitations" },
  { id: "participants", label: "Participants" },
  { id: "payments", label: "Payments" },
  { id: "communications", label: "Communications" },
  { id: "operations", label: "Operations" },
  { id: "documents", label: "Documents" },
  { id: "settings", label: "Settings" },
];

/** Tabs supported by registration workflow */
export function tabsForWorkflow(
  workflow: RegistrationWorkflow,
): EventAdminTabId[] {
  const base: EventAdminTabId[] = [
    "overview",
    "participation",
    "communications",
    "operations",
    "documents",
    "settings",
  ];

  switch (workflow) {
    case "application":
      return [
        "overview",
        "applications",
        "participants",
        "payments",
        "communications",
        "operations",
        "documents",
        "settings",
      ];
    case "invitation_application":
      return [
        "overview",
        "applications",
        "invitations",
        "participants",
        "payments",
        "communications",
        "operations",
        "documents",
        "settings",
      ];
    case "invitation":
      return [
        "overview",
        "interest",
        "invitations",
        "participants",
        "communications",
        "operations",
        "documents",
        "settings",
      ];
    case "interest":
    case "interest_list":
      return [
        "overview",
        "interest",
        "invitations",
        "participants",
        "communications",
        "operations",
        "documents",
        "settings",
      ];
    case "community_signup":
      return [
        "overview",
        "interest",
        "participants",
        "communications",
        "settings",
      ];
    default:
      return base;
  }
}

export function adminTabsForEvent(event: FounderEvent): EventAdminTab[] {
  const allowed = new Set(tabsForWorkflow(event.registrationWorkflow));
  return ALL_TABS.filter((t) => allowed.has(t.id));
}

/** What may be copied when duplicating an event */
export const DUPLICATE_COPY_OPTIONS = [
  { id: "public_content", label: "Public content", defaultOn: true },
  { id: "agenda", label: "Agenda", defaultOn: true },
  { id: "form_questions", label: "Form questions", defaultOn: true },
  { id: "capacity", label: "Capacity settings", defaultOn: true },
  { id: "communications", label: "Communications templates", defaultOn: false },
  { id: "checklist", label: "Operational checklist", defaultOn: true },
  { id: "documents", label: "Document templates", defaultOn: false },
  { id: "team", label: "Team assignments", defaultOn: false },
] as const;

export const DUPLICATE_NEVER_COPY = [
  "participants",
  "applications",
  "payments",
  "audit_history",
  "sent_communications",
  "analytics",
] as const;
