import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import {
  GatheringInterestForm,
  prefillFromGathering,
} from "@/components/GatheringInterestForm";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import {
  communityCta,
  getGatheringBySlug,
} from "@/lib/gatherings";

type PageProps = {
  searchParams: Promise<{ event?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { event } = await searchParams;
  const g = event ? getGatheringBySlug(event) : undefined;
  const title = g
    ? `${g.cta} · ${g.title}`
    : "Express Interest · Founder-Being Gatherings";
  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default async function GatheringInterestPage({ searchParams }: PageProps) {
  const { event: slug } = await searchParams;
  const gathering = slug ? getGatheringBySlug(slug) : undefined;
  const target =
    gathering ??
    (slug === communityCta.slug || !slug ? communityCta : null);

  if (!target) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] bg-[#0B0B0B] px-6 py-28 text-fb-text">
          <div className="container-site max-w-xl">
            <h1 className="editorial-h text-3xl">Gathering not found</h1>
            <p className="mt-4 text-fb-body">
              This event link is invalid or has ended.
            </p>
            <Link href="/#events" className="btn btn-secondary mt-8 inline-flex">
              View gatherings
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const prefill = prefillFromGathering(target);

  return (
    <>
      <Header />
      <main className="bg-[#0B0B0B] text-fb-text">
        <div className="container-site max-w-2xl py-28">
          <p className="section-label">Gatherings</p>
          <h1 className="editorial-h text-3xl md:text-4xl">{prefill.cta}</h1>
          <p className="mt-4 text-base leading-relaxed text-fb-body">
            Share a few details. Your submission is tagged to this gathering so
            our team can follow up in the right place—not a generic waitlist.
          </p>

          <div className="mt-12">
            <GatheringInterestForm prefill={prefill} />
          </div>

          <p className="mt-10 text-sm text-fb-secondary">
            <Link href="/#events" className="underline-offset-4 hover:underline">
              ← Back to Upcoming Gatherings
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
