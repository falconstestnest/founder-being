import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { GatheringInterestForm } from "@/components/GatheringInterestForm";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { prefillFromEventSlug } from "@/lib/events/prefill";

type PageProps = {
  searchParams: Promise<{ event?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { event } = await searchParams;
  const resolved = prefillFromEventSlug(event);
  const title =
    resolved.kind === "event"
      ? `${resolved.prefill.cta} · ${resolved.prefill.eventName}`
      : resolved.kind === "community"
        ? "Express Interest · Founder-Being Events"
        : "Event not found · Founder-Being";
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function EventInterestPage({ searchParams }: PageProps) {
  const { event: raw } = await searchParams;
  // No query → general community form (safe default)
  const resolved = prefillFromEventSlug(raw ?? null);

  if (resolved.kind === "not_found") {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] bg-[#0B0B0B] px-6 py-28 text-fb-text">
          <div className="container-site max-w-xl">
            <h1 className="type-h2">Event not found</h1>
            <p className="mt-4 type-body">
              This event link is invalid or has ended. You can still join the
              general community interest list.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/events" className="btn btn-secondary inline-flex">
                Events Hub
              </Link>
              <Link
                href="/events/interest?event=community"
                className="btn btn-primary inline-flex"
              >
                Community interest
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const prefill = resolved.prefill;
  const isCommunity = resolved.kind === "community";
  const event = resolved.kind === "event" ? resolved.event : undefined;

  return (
    <>
      <Header />
      <main className="bg-[#0B0B0B] text-fb-text">
        <div className="container-site max-w-2xl py-28">
          <p className="section-label">Events</p>
          <h1 className="type-h1 section-heading">{prefill.cta}</h1>
          <p className="section-lead mt-4">
            {isCommunity
              ? "Share a few details. Submissions are tagged for the community list so the team can route you correctly."
              : "Share a few details. Your submission is tagged with this event's ID, type, and city for the CMS—not a generic waitlist."}
          </p>
          <div className="mt-12">
            <GatheringInterestForm prefill={prefill} />
          </div>
          <p className="mt-10 type-small">
            {event ? (
              <Link href={event.path} className="link-inline">
                ← {event.title}
              </Link>
            ) : (
              <Link href="/events" className="link-inline">
                ← Events Hub
              </Link>
            )}
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
