import type { Metadata } from "next";
import Link from "next/link";
import { Mission } from "@/components/Mission";
import { PublicPage } from "@/components/PublicPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Mission | Founder-Being",
  description:
    "To build a global movement advancing founder wellbeing, conscious leadership, and emotionally sustainable entrepreneurship.",
  alternates: { canonical: "/mission" },
  openGraph: {
    title: "Our Mission | Founder-Being",
    description:
      "Founder wellbeing, conscious leadership, and emotionally sustainable entrepreneurship—from Kerala to the world.",
    url: `${siteConfig.url}/mission`,
  },
};

export default function MissionPage() {
  return (
    <PublicPage>
      <div className="container-site pt-28 pb-4">
        <p className="section-label">Mission</p>
        <h1 className="type-h1 section-heading max-w-3xl">Our mission</h1>
        <p className="section-lead">
          Advancing founder wellbeing, conscious leadership, and emotionally
          sustainable entrepreneurship as institutional priorities—not optional
          extras.
        </p>
      </div>

      <Mission />

      <section className="section border-t border-white/10">
        <div className="container-site max-w-3xl">
          <h2 className="type-h2 section-heading">Core beliefs</h2>
          <ul className="list-intentional">
            {[
              "Ambition and care for the self are not opposites.",
              "Loneliness and pressure are structural, not personal failures.",
              "Better companies require healthier leaders.",
              "Community and reflection are operating infrastructure.",
            ].map((b) => (
              <li key={b}>
                <span className="list-mark" aria-hidden>
                  —
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <h2 className="type-h2 section-heading mt-16">How we work</h2>
          <p className="text-narrative mt-6">
            Through retreats, gatherings, reflection circles, leadership
            dialogues, and long-term relationships—not one-off content blasts.
            Programmes move from interest to application to selection to
            participation with deliberate care.
          </p>

          <p className="key-statement mt-12">
            Building healthier founders. Building better companies.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/events" className="btn btn-primary">
              View upcoming gatherings
            </Link>
            <Link href="/impact" className="btn btn-secondary">
              Discover our impact
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
