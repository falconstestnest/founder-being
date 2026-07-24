"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import {
  communityInterestPath,
  eventsCatalog,
  eventsForHubTab,
  eventsIntro,
} from "@/lib/events/catalog";
import {
  HUB_TAB_LABELS,
  HUB_TABS,
  type HubTab,
} from "@/lib/events/taxonomy";

export function EventsHub({ compact = false }: { compact?: boolean }) {
  const [tab, setTab] = useState<HubTab>("upcoming");

  const list = useMemo(() => {
    const items = eventsForHubTab(tab);
    // Prefer featured first within tab
    return [...items].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [tab]);

  return (
    <div>
      <div className={compact ? "" : "container-site"}>
        {!compact && (
          <>
            <p className="section-label">Events</p>
            <h1 className="type-h1 section-heading">Events Hub</h1>
            <p className="section-lead">{eventsIntro}</p>
          </>
        )}

        <div
          className={`flex flex-wrap gap-2 ${compact ? "mt-8" : "mt-10"}`}
          role="tablist"
          aria-label="Event filters"
        >
          {HUB_TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFAB33] ${
                tab === t
                  ? "border-[#FFAB33] bg-[#FFAB33]/10 text-fb-text"
                  : "border-white/15 text-fb-secondary hover:border-white/30 hover:text-fb-text"
              }`}
              onClick={() => setTab(t)}
            >
              {HUB_TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-12 type-body text-fb-secondary">
            No events in this view yet. Check Upcoming or Coming Soon.
          </p>
        ) : (
          <ul className="mt-10 grid gap-8 lg:grid-cols-1">
            {list.map((event) => (
              <li key={event.id}>
                <EventCard event={event} featured={event.featured} />
              </li>
            ))}
          </ul>
        )}

        <article className="mt-10 border border-white/10 p-8 md:flex md:items-end md:justify-between md:gap-10 md:p-10">
          <div className="max-w-2xl">
            <h2 className="type-h3">More Gatherings Coming Soon</h2>
            <p className="mt-4 type-body">
              Founder circles, investor conversations, conscious-leadership
              retreats and ecosystem gatherings are being developed across India
              and the Middle East.
            </p>
          </div>
          <Link
            href={communityInterestPath()}
            className="btn btn-secondary mt-8 shrink-0 md:mt-0"
          >
            Join the Founder-Being Community
          </Link>
        </article>

        {!compact && (
          <p className="mt-8 type-small">
            {eventsCatalog.length} events in the catalogue · Single Events
            domain model
          </p>
        )}
      </div>
    </div>
  );
}
