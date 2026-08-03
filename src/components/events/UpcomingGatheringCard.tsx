import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import type { FounderEvent } from "@/lib/events/taxonomy";

/**
 * Homepage card for the next featured gathering.
 * CTA goes to the event detail page (Luma embed lives there — not on home).
 */
export function UpcomingGatheringCard({ event }: { event: FounderEvent }) {
  return (
    <FadeIn>
      <article className="border border-[#FFAB33]/30 bg-[#131313] p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <p className="section-label !mb-0">Upcoming gathering</p>
          <EventStatusBadge status={event.statusBadge} />
        </div>
        <h2 className="type-h2 section-heading mt-5 max-w-2xl">
          {event.title}
        </h2>
        <p className="mt-3 type-small text-fb-secondary">{event.summaryLine}</p>
        <p className="mt-6 type-body max-w-2xl">{event.description}</p>
        {(event.location.venuePublic || event.location.city) && (
          <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="type-meta">When</dt>
              <dd className="mt-2 text-fb-body">{event.summaryLine}</dd>
            </div>
            <div>
              <dt className="type-meta">Where</dt>
              <dd className="mt-2 text-fb-body">
                {[event.location.venuePublic, event.location.city]
                  .filter(Boolean)
                  .join(" · ")}
              </dd>
            </div>
          </dl>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={event.path} className="btn btn-primary">
            View details &amp; register
          </Link>
          <Link href="/events" className="btn btn-secondary">
            All events
          </Link>
        </div>
      </article>
    </FadeIn>
  );
}
