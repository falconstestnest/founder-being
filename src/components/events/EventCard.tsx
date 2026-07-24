import Link from "next/link";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { interestPath } from "@/lib/events/catalog";
import {
  EVENT_THEME_LABELS,
  EVENT_TYPE_LABELS,
  type FounderEvent,
} from "@/lib/events/taxonomy";

export function EventCard({
  event,
  featured = false,
}: {
  event: FounderEvent;
  featured?: boolean;
}) {
  const isKodaikanal = event.slug === "kodaikanal-full-moon-retreat-2026";
  const primaryHref = isKodaikanal
    ? event.path
    : interestPath(event);

  return (
    <article
      className={`flex h-full flex-col border p-8 md:p-10 ${
        featured
          ? "border-[#FFAB33]/35 bg-[#131313]"
          : "border-white/10"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <EventStatusBadge status={event.statusBadge} />
        <span className="font-mono text-[0.6875rem] tracking-wide text-fb-meta">
          {EVENT_TYPE_LABELS[event.eventType]}
        </span>
      </div>

      <h3 className="type-h3 mt-5">
        <Link
          href={event.path}
          className="transition-colors hover:text-[#FFAB33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFAB33]"
        >
          {event.title}
        </Link>
      </h3>
      {event.subtitle && (
        <p className="mt-2 type-h4 text-fb-secondary font-normal">{event.subtitle}</p>
      )}
      <p className="mt-3 type-small">{event.summaryLine}</p>

      <p className="mt-6 type-body max-w-3xl">{event.description}</p>

      {event.bullets && event.bullets.length > 0 && (
        <ul className="list-intentional mt-6">
          {event.bullets.map((b) => (
            <li key={b}>
              <span className="list-mark" aria-hidden>
                —
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {(event.format || event.audience || event.capacity.capacity != null) && (
        <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-3">
          {event.format && (
            <div>
              <dt className="type-meta">Format</dt>
              <dd className="mt-2 text-fb-body">{event.format}</dd>
            </div>
          )}
          {event.audience && (
            <div>
              <dt className="type-meta">Audience</dt>
              <dd className="mt-2 text-fb-body">{event.audience}</dd>
            </div>
          )}
          {event.capacity.capacity != null && (
            <div>
              <dt className="type-meta">Capacity</dt>
              <dd className="mt-2 font-mono text-fb-body">
                {event.capacity.capacity}
                {event.capacity.confirmed > 0 && (
                  <span className="text-fb-meta">
                    {" "}
                    · {event.capacity.confirmed} confirmed
                  </span>
                )}
              </dd>
            </div>
          )}
        </dl>
      )}

      {event.themes.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {event.themes.slice(0, 4).map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-fb-secondary"
            >
              {EVENT_THEME_LABELS[t]}
            </li>
          ))}
        </ul>
      )}

      {event.footnotes?.map((note) => (
        <p key={note} className="mt-4 max-w-3xl type-small">
          {note}
        </p>
      ))}

      <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
        <Link href={primaryHref} className="btn btn-primary">
          {event.cta}
        </Link>
        <Link
          href={event.path}
          className="btn btn-secondary"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
