import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "@/components/PublicPage";
import { SectionChanged } from "@/components/SectionChanged";
import { WhatIs } from "@/components/WhatIs";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Founder-Being",
  description:
    "What Founder-Being is—and is not. A founder wellbeing and conscious leadership initiative for healthier founders and better companies.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Founder-Being",
    description:
      "Cultivating extraordinary ambition without compromising wellbeing, relationships, identity, or inner peace.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <PublicPage>
      <div className="container-site pt-28 pb-8">
        <p className="section-label">About</p>
        <h1 className="type-h1 section-heading max-w-3xl">
          About Founder-Being
        </h1>
        <p className="section-lead">
          An institutional initiative for founder wellbeing and conscious
          leadership—creating spaces to reflect, reconnect, and build without
          self-sacrifice.
        </p>
      </div>

      <WhatIs />
      <SectionChanged />

      <section className="section border-t border-white/10">
        <div className="container-site max-w-3xl">
          <h2 className="type-h2 section-heading">What we are not</h2>
          <ul className="list-intentional">
            {[
              "Not a pitch event or accelerator demo day",
              "Not medical or psychological treatment",
              "Not networking for its own sake",
              "Not a productivity workshop that ignores the human cost of building",
            ].map((item) => (
              <li key={item}>
                <span className="list-mark" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-12 type-body max-w-2xl">
            Geographic vision stretches from Kerala and India through the Middle
            East and Southeast Asia—always with local integrity and institutional
            care.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/mission" className="btn btn-primary">
              Explore our mission
            </Link>
            <Link href="/events" className="btn btn-secondary">
              View upcoming gatherings
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
