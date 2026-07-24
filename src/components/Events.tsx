import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import {
  communityCta,
  gatherings,
  gatheringsIntro,
  interestFormPath,
  residentialHighlight,
} from "@/lib/gatherings";

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
          <h2 id="events-heading" className="type-h2 section-heading max-w-2xl">
            Upcoming Gatherings
          </h2>
          <p className="section-lead">{gatheringsIntro}</p>
        </FadeIn>

        {/* Residential retreat highlight */}
        <FadeIn className="mt-12">
          <article className="border border-[#FFAB33]/30 bg-[#131313] p-8 md:flex md:items-end md:justify-between md:gap-10">
            <div className="max-w-2xl">
              <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
                Residential · {residentialHighlight.status}
              </p>
              <h3 className="mt-4 font-serif text-2xl text-fb-text md:text-3xl">
                {residentialHighlight.title}
              </h3>
              <p className="mt-2 text-sm text-fb-secondary">
                {residentialHighlight.meta}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-fb-body">
                {residentialHighlight.description}
              </p>
            </div>
            <Link
              href={residentialHighlight.href}
              className="btn btn-primary mt-8 shrink-0 md:mt-0"
            >
              {residentialHighlight.cta}
            </Link>
          </article>
        </FadeIn>

        <ul className="mt-10 space-y-8">
          {gatherings.map((event, i) => (
            <FadeIn key={event.id} as="li" delayMs={i * 40}>
              <article className="border border-white/10 p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
                    {event.status}
                  </p>
                  <span className="font-mono text-xs tracking-wide text-fb-meta">
                    {event.eventType}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-2xl text-fb-text md:text-3xl">
                  {event.title}
                </h3>
                {event.subtitle && (
                  <p className="mt-2 font-serif text-xl text-fb-secondary">
                    {event.subtitle}
                  </p>
                )}
                <p className="mt-3 text-sm text-fb-secondary">{event.meta}</p>

                <p className="mt-6 max-w-3xl text-base leading-relaxed text-fb-body">
                  {event.description}
                </p>

                {event.bullets && event.bullets.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-fb-secondary">
                      The gathering may include:
                    </p>
                    <ul className="list-intentional mt-4">
                      {event.bullets.map((b) => (
                        <li key={b}>
                          <span className="list-mark" aria-hidden>
                            —
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(event.format || event.audience || event.capacity) && (
                  <dl className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-sm sm:grid-cols-3">
                    {event.format && (
                      <div>
                        <dt className="font-mono text-xs uppercase tracking-wider text-fb-meta">
                          Format
                        </dt>
                        <dd className="mt-1 text-fb-body">{event.format}</dd>
                      </div>
                    )}
                    {event.audience && (
                      <div>
                        <dt className="font-mono text-xs uppercase tracking-wider text-fb-meta">
                          Audience
                        </dt>
                        <dd className="mt-1 text-fb-body">{event.audience}</dd>
                      </div>
                    )}
                    {event.capacity && (
                      <div>
                        <dt className="font-mono text-xs uppercase tracking-wider text-fb-meta">
                          Capacity
                        </dt>
                        <dd className="mt-1 text-fb-body">{event.capacity}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {event.footnotes?.map((note) => (
                  <p
                    key={note}
                    className="mt-4 max-w-3xl text-sm leading-relaxed text-fb-secondary"
                  >
                    {note}
                  </p>
                ))}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={interestFormPath(event)}
                    className="btn btn-primary"
                  >
                    {event.cta}
                  </Link>
                  <span className="font-mono text-xs text-fb-meta">
                    {event.registrationWorkflow}
                  </span>
                </div>
              </article>
            </FadeIn>
          ))}
        </ul>

        {/* More coming soon */}
        <FadeIn className="mt-10">
          <article className="border border-white/10 p-8 md:p-10 md:flex md:items-end md:justify-between md:gap-10">
            <div className="max-w-2xl">
              <h3 className="font-serif text-2xl text-fb-text md:text-3xl">
                {communityCta.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-fb-body">
                {communityCta.description}
              </p>
            </div>
            <Link
              href={interestFormPath({ slug: communityCta.slug })}
              className="btn btn-secondary mt-8 shrink-0 md:mt-0"
            >
              {communityCta.cta}
            </Link>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
