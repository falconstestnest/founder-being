import { FadeIn } from "@/components/FadeIn";
import { events } from "@/lib/data";

export function Events() {
  return (
    <section
      id="events"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="events-heading"
    >
      <div className="container-site">
        <FadeIn>
          <p className="section-label">06 — Gatherings</p>
          <h2
            id="events-heading"
            className="editorial-h max-w-2xl text-4xl text-[#F8F8F8] md:text-5xl"
          >
            Upcoming Gatherings
          </h2>
        </FadeIn>

        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {events.map((event, i) => (
            <FadeIn key={event.title + event.location} as="li" delayMs={i * 50}>
              <article className="flex h-full flex-col border border-white/10 p-8">
                <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
                  {event.status}
                </p>
                <h3 className="mt-6 font-serif text-2xl text-[#F8F8F8] md:text-3xl">
                  {event.title}
                </h3>
                <dl className="mt-8 space-y-3 text-sm text-[#F8F8F8]/65">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <dt>Location</dt>
                    <dd className="text-right text-[#F8F8F8]">{event.location}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                    <dt>Date</dt>
                    <dd className="text-right text-[#F8F8F8]">{event.date}</dd>
                  </div>
                  <div className="flex justify-between gap-4 pb-1">
                    <dt>Seats</dt>
                    <dd className="text-right text-[#F8F8F8]">
                      {event.seatsRemaining}
                    </dd>
                  </div>
                </dl>
                <a href={event.href} className="btn btn-secondary mt-10 w-full">
                  Register Interest
                </a>
              </article>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
