import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { LumaEventEmbed } from "@/components/events/LumaEventEmbed";
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

function formatWhen(event: {
  summaryLine: string;
  startsOn?: string;
  startsAtTime?: string;
  endsAtTime?: string;
  location: { timezone: string };
}) {
  if (event.startsOn && event.startsAtTime) {
    const time =
      event.endsAtTime != null
        ? `${event.startsAtTime}–${event.endsAtTime}`
        : event.startsAtTime;
    return `${event.startsOn} · ${time} (${event.location.timezone})`;
  }
  return event.summaryLine;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const event = getEventBySlug(slug);
  if (!event) notFound();

  // Kodaikanal is served via rewrite to the full residential programme page
  if (slug === "kodaikanal-full-moon-retreat-2026") {
    notFound();
  }

  const c = event.capacity;
  const hasLuma =
    event.registrationProvider === "luma" && Boolean(event.registrationEmbedUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startsOn
      ? `${event.startsOn}${event.startsAtTime ? `T${event.startsAtTime}:00` : ""}`
      : undefined,
    endDate: event.startsOn
      ? `${event.startsOn}${event.endsAtTime ? `T${event.endsAtTime}:00` : ""}`
      : undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location.venuePublic || event.location.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        addressCountry: event.location.country,
      },
    },
    organizer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url: `${siteConfig.url}${event.path}`,
  };

  return (
    <>
      <Header />
      <main className="bg-[#0B0B0B] text-fb-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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

          <section className="content-group mt-12 border-t border-white/10 pt-10">
            <h2 className="type-h4">When &amp; where</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2 type-body">
              <div>
                <dt className="type-meta">Date &amp; time</dt>
                <dd className="mt-1">{formatWhen(event)}</dd>
              </div>
              <div>
                <dt className="type-meta">Venue</dt>
                <dd className="mt-1">
                  {event.location.venuePublic ||
                    event.location.venue ||
                    event.location.city}
                </dd>
              </div>
              <div>
                <dt className="type-meta">City</dt>
                <dd className="mt-1">
                  {event.location.city}
                  {event.location.state ? `, ${event.location.state}` : ""}
                </dd>
              </div>
              <div>
                <dt className="type-meta">Timezone</dt>
                <dd className="mt-1 font-mono text-sm">
                  {event.location.timezone}
                </dd>
              </div>
            </dl>
          </section>

          {event.bullets && event.bullets.length > 0 && (
            <section className="content-group mt-12 border-t border-white/10 pt-10">
              <h2 className="type-h4">Who this is for</h2>
              {event.audience && (
                <p className="mt-4 type-body text-fb-secondary">
                  {event.audience}
                </p>
              )}
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
            </section>
          )}

          {hasLuma && event.registrationEmbedUrl ? (
            <section
              id="register"
              className="content-group mt-12 border-t border-white/10 pt-10"
              aria-labelledby="register-heading"
            >
              <p className="section-label">Registration</p>
              <h2 id="register-heading" className="type-h3 section-heading">
                Join the gathering
              </h2>
              <p className="section-lead mt-4 max-w-xl">
                Founder-Being gatherings are intentionally small. Review the
                details below and reserve your place through Luma.
              </p>
              <div className="mt-10">
                <LumaEventEmbed
                  embedUrl={event.registrationEmbedUrl}
                  publicEventUrl={event.registrationUrl}
                  title={event.title}
                  eventId={
                    event.registrationProviderEventId ?? event.id
                  }
                />
              </div>
            </section>
          ) : (
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Link href={interestPath(event)} className="btn btn-primary">
                {event.cta}
              </Link>
              <Link href="/events" className="btn btn-secondary">
                All events
              </Link>
            </div>
          )}

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

          <section className="content-group mt-12 border-t border-white/10 pt-10">
            <h2 className="type-h4">Programme notes</h2>
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
                <dd className="mt-1 text-fb-body">{c.capacity ?? "—"}</dd>
              </div>
            </dl>
            {event.footnotes?.map((n) => (
              <p key={n} className="mt-6 type-small">
                {n}
              </p>
            ))}
          </section>

          {hasLuma && (
            <div className="mt-12">
              <Link href="/events" className="btn btn-secondary">
                All events
              </Link>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
