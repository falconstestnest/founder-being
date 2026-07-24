import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import {
  getEventBySlug,
  interestPath,
} from "@/lib/events/catalog";
import {
  EVENT_THEME_LABELS,
  EVENT_TYPE_LABELS,
  REGISTRATION_WORKFLOW_LABELS,
  EVENT_LIFECYCLE_LABELS,
} from "@/lib/events/taxonomy";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Event" };
  return {
    title: `${event.title} | Founder-Being`,
    description: event.description,
    alternates: { canonical: event.path },
    openGraph: {
      title: event.title,
      description: event.description,
      url: `${siteConfig.url}${event.path}`,
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const event = getEventBySlug(slug);
  if (!event) notFound();

  // Kodaikanal is served via rewrite to the full programme page
  if (slug === "kodaikanal-full-moon-retreat-2026") {
    notFound();
  }

  const c = event.capacity;

  return (
    <>
      <Header />
      <main className="bg-[#0B0B0B] text-fb-text">
        <article className="container-site max-w-3xl py-28">
          <p className="section-label">Event</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <EventStatusBadge status={event.statusBadge} />
            <span className="font-mono text-xs text-fb-meta">
              {EVENT_TYPE_LABELS[event.eventType]}
            </span>
          </div>
          <h1 className="type-display mt-6">{event.title}</h1>
          {event.subtitle && (
            <p className="type-h3 mt-3 text-fb-secondary font-normal">
              {event.subtitle}
            </p>
          )}
          <p className="mt-4 type-small">{event.summaryLine}</p>

          <p className="section-lead mt-10">{event.description}</p>

          {event.bullets && (
            <ul className="list-intentional">
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

          <section className="content-group mt-12 border-t border-white/10 pt-10">
            <h2 className="type-h4">Location</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2 type-body">
              <div>
                <dt className="type-meta">Country</dt>
                <dd className="mt-1">{event.location.country}</dd>
              </div>
              {event.location.state && (
                <div>
                  <dt className="type-meta">State / region</dt>
                  <dd className="mt-1">{event.location.state}</dd>
                </div>
              )}
              <div>
                <dt className="type-meta">City</dt>
                <dd className="mt-1">{event.location.city}</dd>
              </div>
              <div>
                <dt className="type-meta">Timezone</dt>
                <dd className="mt-1 font-mono text-sm">
                  {event.location.timezone}
                </dd>
              </div>
              {(event.location.venuePublic || event.location.venue) && (
                <div className="sm:col-span-2">
                  <dt className="type-meta">Venue</dt>
                  <dd className="mt-1">
                    {event.location.venuePublic || event.location.venue}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="content-group mt-12 border-t border-white/10 pt-10">
            <h2 className="type-h4">Operations snapshot</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3 font-mono text-sm">
              <div>
                <dt className="type-meta">Lifecycle</dt>
                <dd className="mt-1 text-fb-body">
                  {EVENT_LIFECYCLE_LABELS[event.lifecycle]}
                </dd>
              </div>
              <div>
                <dt className="type-meta">Workflow</dt>
                <dd className="mt-1 text-fb-body">
                  {REGISTRATION_WORKFLOW_LABELS[event.registrationWorkflow]}
                </dd>
              </div>
              <div>
                <dt className="type-meta">Capacity</dt>
                <dd className="mt-1 text-fb-body">
                  {c.capacity ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="type-meta">Applications</dt>
                <dd className="mt-1 text-fb-body">{c.applications}</dd>
              </div>
              <div>
                <dt className="type-meta">Confirmed</dt>
                <dd className="mt-1 text-fb-body">{c.confirmed}</dd>
              </div>
              <div>
                <dt className="type-meta">Waitlisted</dt>
                <dd className="mt-1 text-fb-body">{c.waitlisted}</dd>
              </div>
            </dl>
          </section>

          {event.themes.length > 0 && (
            <section className="content-group mt-12 border-t border-white/10 pt-10">
              <h2 className="type-h4">Themes</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {event.themes.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-fb-secondary"
                  >
                    {EVENT_THEME_LABELS[t]}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {event.footnotes?.map((n) => (
            <p key={n} className="mt-6 type-small">
              {n}
            </p>
          ))}

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href={interestPath(event)} className="btn btn-primary">
              {event.cta}
            </Link>
            <Link href="/events" className="btn btn-secondary">
              All events
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
