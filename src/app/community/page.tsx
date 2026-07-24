import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "@/components/PublicPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community | Founder-Being",
  description:
    "Who can join Founder-Being, community principles, and the founder journey from interest to lasting relationship.",
  alternates: { canonical: "/community" },
  openGraph: {
    title: "Community | Founder-Being",
    description:
      "Principles and pathways for founders, ecosystem leaders, and long-term community members.",
    url: `${siteConfig.url}/community`,
  },
};

const principles = [
  "Respect confidentiality of personal and group conversations.",
  "Show up with honesty—not performance.",
  "Ambition is welcome; harm is not.",
  "Peer support over transactional networking.",
  "Participation is voluntary; pressure has no place.",
];

const journey = [
  "Visitor — discovers Founder-Being",
  "Interested — expresses interest in gatherings",
  "Community member — stays connected",
  "Event attendee — joins a gathering",
  "Retreat applicant / participant — goes deeper",
  "Volunteer, mentor, or patron — gives back",
];

export default function CommunityPage() {
  return (
    <PublicPage>
      <div className="container-site max-w-3xl py-28">
        <p className="section-label">Community</p>
        <h1 className="type-h1 section-heading">Join the community</h1>
        <p className="section-lead">
          Founder-Being is for founders and selected ecosystem leaders willing
          to build trusted relationships—and for those who steward the work over
          time.
        </p>

        <section className="mt-16">
          <h2 className="type-h2 section-heading">Who can join</h2>
          <ul className="list-intentional">
            {[
              "Startup founders and co-founders at any stage",
              "Founder-operators carrying pressure, uncertainty, or major decisions",
              "Ecosystem leaders and investors who engage respectfully",
              "Volunteers and patrons who strengthen the institution",
            ].map((item) => (
              <li key={item}>
                <span className="list-mark" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="type-h2 section-heading">Principles</h2>
          <ul className="list-intentional">
            {principles.map((p) => (
              <li key={p}>
                <span className="list-mark" aria-hidden>
                  —
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="type-h2 section-heading">Founder journey</h2>
          <ol className="mt-8 space-y-4">
            {journey.map((step, i) => (
              <li key={step} className="flex gap-4 type-body">
                <span className="font-mono text-sm text-[#FFAB33]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/events/interest?event=community"
            className="btn btn-primary"
          >
            Join the Founder-Being community
          </Link>
          <Link href="/events" className="btn btn-secondary">
            View upcoming gatherings
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </PublicPage>
  );
}
