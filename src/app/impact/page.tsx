import type { Metadata } from "next";
import Link from "next/link";
import { Impact } from "@/components/Impact";
import { PublicPage } from "@/components/PublicPage";
import { Stats } from "@/components/Stats";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impact | Founder-Being",
  description:
    "How Founder-Being creates impact through gatherings, reflection, leadership, and community—without inventing unverified metrics.",
  alternates: { canonical: "/impact" },
  openGraph: {
    title: "Impact | Founder-Being",
    description:
      "Programme areas and intended outcomes for healthier founders and ecosystems.",
    url: `${siteConfig.url}/impact`,
  },
};

export default function ImpactPage() {
  return (
    <PublicPage>
      <div className="container-site pt-28 pb-4">
        <p className="section-label">Impact</p>
        <h1 className="type-h1 section-heading max-w-3xl">
          How we create impact
        </h1>
        <p className="section-lead">
          Through programmes that treat wellbeing and leadership as
          foundational—not decorative. We publish verified numbers only.
        </p>
      </div>

      <Impact />
      <Stats />

      <section className="section border-t border-white/10">
        <div className="container-site max-w-3xl">
          <h2 className="type-h2 section-heading">Intended outcomes</h2>
          <ul className="list-intentional">
            {[
              "Founders leave with clearer priorities and reduced isolation.",
              "Cohorts form trusted peer relationships beyond transactional networking.",
              "Leaders practice regulation, reflection, and responsible ambition.",
              "Ecosystems treat founder health as infrastructure for better companies.",
            ].map((item) => (
              <li key={item}>
                <span className="list-mark" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-12 type-small max-w-2xl">
            Future impact reporting will follow transparent methods. Until
            figures are verified, statistics remain placeholders rather than
            marketing claims.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/events" className="btn btn-primary">
              View upcoming gatherings
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
