export const siteConfig = {
  name: "Founder-Being",
  tagline: "Building Healthier Founders. Building Better Companies.",
  url: "https://www.foundrbeing.com",
  description:
    "Founder-Being is a founder wellbeing and conscious leadership initiative supporting entrepreneurs through gatherings, reflection circles, wellness experiences, and meaningful conversations across India and the Middle East.",
  ogTitle: "Founder-Being | Building Healthier Founders",
  ogDescription:
    "Helping founders build meaningful companies without sacrificing their wellbeing.",
  email: "hello@founderbeing.org",
  social: {
    instagram: "https://instagram.com/founderbeing",
    linkedin: "https://www.linkedin.com/company/founderbeing",
  },
} as const;

/** Primary public navigation — real routes only (no hash URLs). */
export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/mission", label: "Mission" },
  { href: "/events", label: "Events" },
  { href: "/impact", label: "Impact" },
  { href: "/patrons", label: "Patrons" },
  { href: "/community", label: "Community" },
  { href: "/contact", label: "Contact" },
] as const;

/** Legacy homepage hashes → real routes (client-side migration). */
export const legacyHashRoutes: Record<string, string> = {
  "#about": "/about",
  "#vision": "/mission",
  "#mission": "/mission",
  "#community": "/community",
  "#impact": "/impact",
  "#events": "/events",
  "#patron": "/patrons",
  "#patrons": "/patrons",
  "#contact": "/contact",
  "#join": "/contact",
  "#changed": "/about",
  "#top": "/",
};
