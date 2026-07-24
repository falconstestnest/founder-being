import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

const pathways = [
  {
    href: "/about",
    label: "Learn about Founder-Being",
    desc: "Who we are, what we cultivate, and what we are not.",
  },
  {
    href: "/mission",
    label: "Explore our mission",
    desc: "Founder wellbeing, conscious leadership, and geographic vision.",
  },
  {
    href: "/events",
    label: "View upcoming gatherings",
    desc: "Retreats, meetups, investor dialogues, and ecosystem days.",
  },
  {
    href: "/impact",
    label: "Discover our impact",
    desc: "How we create change—without inventing unverified metrics.",
  },
  {
    href: "/patrons",
    label: "Learn about the Patron Circle",
    desc: "Stewardship for healthier founders and better companies.",
  },
  {
    href: "/community",
    label: "Join the community",
    desc: "Principles, journey, and how founders take part.",
  },
] as const;

export function HomePathways() {
  return (
    <section className="section border-t border-white/10" aria-labelledby="pathways-heading">
      <div className="container-site">
        <FadeIn>
          <p className="section-label">Explore</p>
          <h2 id="pathways-heading" className="type-h2 section-heading max-w-2xl">
            An institution for healthier founders
          </h2>
          <p className="section-lead">
            Choose a path. Each opens a full page—not a scroll of anchors.
          </p>
        </FadeIn>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((p, i) => (
            <FadeIn key={p.href} as="li" delayMs={i * 40}>
              <Link
                href={p.href}
                className="group flex h-full flex-col border border-white/10 p-7 transition-colors duration-300 hover:border-[#FFAB33]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFAB33]"
              >
                <span className="type-h4 group-hover:text-[#FFAB33] transition-colors">
                  {p.label}
                </span>
                <span className="mt-3 type-small grow">{p.desc}</span>
                <span className="mt-6 font-mono text-xs tracking-wide text-[#FFAB33]">
                  Open →
                </span>
              </Link>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
