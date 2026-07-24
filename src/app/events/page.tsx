import type { Metadata } from "next";
import { EventsHub } from "@/components/events/EventsHub";
import { PublicPage } from "@/components/PublicPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upcoming Gatherings | Founder-Being",
  description:
    "Explore Founder-Being retreats, founder circles, investor dialogues and conscious leadership gatherings across India and the Middle East.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Upcoming Gatherings | Founder-Being",
    description:
      "Retreats, founder circles, investor dialogues and ecosystem gatherings across India and the Middle East.",
    url: `${siteConfig.url}/events`,
  },
};

export default function EventsHubPage() {
  return (
    <PublicPage mainClassName="pb-24 pt-28">
      <EventsHub />
    </PublicPage>
  );
}
