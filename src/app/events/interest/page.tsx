import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import {
  GatheringInterestForm,
  prefillFromEvent,
} from "@/components/GatheringInterestForm";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import {
  LEGACY_SLUG_MAP,
  getEventBySlug,
} from "@/lib/events/catalog";

type PageProps = {
  searchParams: Promise<{ event?: string }>;
};

const communityPrefill = {
  eventId: "evt_community_general",
  eventName: "Founder-Being Community",
  eventType: "Community",
  city: "Multiple",
  registrationWorkflow: "Community Signup",
  slug: "community",
  cta: "Join the Founder-Being Community",
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { event } = await searchParams;
  const slug = event ? LEGACY_SLUG_MAP[event] ?? event : "community";
  const g = slug === "community" ? null : getEventBySlug(slug);
  const title = g
    ? `${g.cta} · ${g.title}`
    : "Express Interest · Founder-Being Events";
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function EventInterestPage({ searchParams }: PageProps) {
  const { event: raw } = await searchParams;
  const slug = raw ? LEGACY_SLUG_MAP[raw] ?? raw : "community";

  if (slug === "community" || !raw) {
    return (
      <>
        <Header />
        <main className="bg-[#0B0B0B] text-fb-text">
          <div className="container-site max-w-2xl py-28">
            <p className="section-label">Events</p>
            <h1 className="type-h1 section-heading">{communityPrefill.cta}</h1>
            <p className="section-lead mt-4">
              Share a few details. Submissions are tagged for the community list
              so the team can route you correctly.
            </p>
            <div className="mt-12">
              <GatheringInterestForm prefill={communityPrefill} />
            </div>
            <p className="mt-10 type-small">
              <Link href="/events" className="link-inline">
                ← Events Hub
              </Link>
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const event = getEventBySlug(slug);
  if (!event) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] bg-[#0B0B0B] px-6 py-28 text-fb-text">
          <div className="container-site max-w-xl">
            <h1 className="type-h2">Event not found</h1>
            <p className="mt-4 type-body">
              This event link is invalid or has ended.
            </p>
            <Link href="/events" className="btn btn-secondary mt-8 inline-flex">
              Events Hub
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const prefill = prefillFromEvent(event);

  return (
    <>
      <Header />
      <main className="bg-[#0B0B0B] text-fb-text">
        <div className="container-site max-w-2xl py-28">
          <p className="section-label">Events</p>
          <h1 className="type-h1 section-heading">{prefill.cta}</h1>
          <p className="section-lead mt-4">
            Share a few details. Your submission is tagged with this event&apos;s
            ID, type, and city for the CMS—not a generic waitlist.
          </p>
          <div className="mt-12">
            <GatheringInterestForm prefill={prefill} />
          </div>
          <p className="mt-10 type-small">
            <Link href={event.path} className="link-inline">
              ← {event.title}
            </Link>
          </p>
          <div className="mt-16 opacity-80">
            <Logo variant="nav-white" height={28} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
