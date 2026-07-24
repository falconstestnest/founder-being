import type { Metadata } from "next";
import Link from "next/link";
import { Patron } from "@/components/Patron";
import { PublicPage } from "@/components/PublicPage";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Founding Patron Circle | Founder-Being",
  description:
    "A small circle of visionary leaders helping establish Founder-Being—stewardship for healthier founders and better companies.",
  alternates: { canonical: "/patrons" },
  openGraph: {
    title: "Founding Patron Circle | Founder-Being",
    description:
      "Early stewardship for an institution that treats founder wellbeing as foundational.",
    url: `${siteConfig.url}/patrons`,
  },
};

export default function PatronsPage() {
  return (
    <PublicPage>
      <div className="container-site pt-28 pb-4">
        <p className="section-label">Patronage</p>
        <h1 className="type-h1 section-heading max-w-3xl">
          Founding Patron Circle
        </h1>
        <p className="section-lead">
          Visionary leaders helping establish Founder-Being from the beginning—not
          a membership product, but institutional stewardship.
        </p>
      </div>

      <Patron />

      <section className="section border-t border-white/10">
        <div className="container-site max-w-3xl">
          <h2 className="type-h2 section-heading">Recognition principles</h2>
          <p className="text-narrative mt-6">
            Recognition is quiet and intentional. We do not publish private
            contribution details or confidential patron documents without
            explicit approval. Legacy is measured in healthier founders and
            more durable companies—not volume of logos.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/contact" className="btn btn-primary">
              Request a patron conversation
            </Link>
            <Link href="/about" className="btn btn-secondary">
              Learn about Founder-Being
            </Link>
          </div>
        </div>
      </section>
    </PublicPage>
  );
}
