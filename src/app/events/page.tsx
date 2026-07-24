import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EventsHub } from "@/components/events/EventsHub";

export const metadata: Metadata = {
  title: "Events Hub | Founder-Being",
  description:
    "Upcoming Founder-Being retreats, meetups, investor dialogues and ecosystem gatherings across India and the Middle East.",
  alternates: { canonical: "/events" },
};

export default function EventsHubPage() {
  return (
    <>
      <Header />
      <main className="bg-[#0B0B0B] pb-24 pt-28 text-fb-text">
        <EventsHub />
      </main>
      <Footer />
    </>
  );
}
