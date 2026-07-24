export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  dividerBefore?: boolean;
};

/** Primary sidebar — Team & Access is IAM, not a simple Users page. */
export const adminNavPrimary: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "What requires attention today",
  },
  {
    href: "/admin/community",
    label: "Community",
    description: "Founder community overview",
  },
  {
    href: "/admin/retreats",
    label: "Retreats",
    description: "Residential retreat programmes",
  },
  {
    href: "/admin/applications",
    label: "Applications",
    description: "Review and select founders",
  },
  {
    href: "/admin/gatherings",
    label: "Gatherings",
    description: "Events and circles",
  },
  {
    href: "/admin/patrons",
    label: "Patrons",
    description: "Founding Patron CRM",
  },
  {
    href: "/admin/communications",
    label: "Communications",
    description: "Calls, email, WhatsApp, notes",
  },
  {
    href: "/admin/content",
    label: "Content",
    description: "Site and programme content",
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    description: "Numbers-first metrics",
  },
  {
    href: "/admin/team",
    label: "Team & Access",
    description: "Identity & access management",
    dividerBefore: true,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Workspace configuration",
  },
];

export const adminNavFooter: AdminNavItem[] = [
  {
    href: "/admin/help",
    label: "Help",
    description: "Guides and support",
  },
  {
    href: "/admin/profile",
    label: "Profile",
    description: "Your account",
  },
];
