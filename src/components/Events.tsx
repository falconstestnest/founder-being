import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { EventCard } from "@/components/events/EventCard";
import {
  communityInterestPath,
  eventsCatalog,
  eventsIntro,
} from "@/lib/events/catalog";

/** Homepage section — preview of Events Hub */
export function Events() {
  const preview = [...eventsCatalog]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);

  return (
    <section
      id="events"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="events-heading"
    >
      <div className="container-site">
        <FadeIn>
          <p className="section-label">06 — Events</p>
          <h2 id="events-heading" className="type-h2 section-heading max-w-2xl">
            Upcoming Gatherings
          </h2>
          <p className="section-lead">{eventsIntro}</p>
        </FadeIn>

        <ul className="mt-12 space-y-8">
          {preview.map((event, i) => (
            <FadeIn key={event.id} as="li" delayMs={i * 40}>
              <EventCard event={event} featured={event.featured} />
            </FadeIn>
          ))}
        </ul>

        <FadeIn className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/events" className="btn btn-primary">
            Open Events Hub
          </Link>
          <Link href={communityInterestPath()} className="btn btn-secondary">
            Join the Community
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
