import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { patronBenefits } from "@/lib/data";

export function Patron() {
  return (
    <section
      id="patron"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="patron-heading"
    >
      <div className="container-site">
        <FadeIn>
          <p className="section-label">07 — Patronage</p>
          <h2
            id="patron-heading"
            className="editorial-h max-w-3xl text-4xl text-fb-text md:text-5xl lg:text-[3.25rem]"
          >
            Founding Patron Circle
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fb-body">
            A small circle of visionary leaders helping establish Founder-Being
            from its very beginning.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-20">
          <FadeIn>
            <div>
              <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
                Purpose
              </h3>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-fb-body md:text-lg">
                <p>
                  Founding Patrons provide the early stewardship that allows
                  Founder-Being to grow with integrity—quietly, deliberately,
                  and with long-term care for the people it serves.
                </p>
                <p>
                  This is not a membership programme. It is a commitment to
                  building an institution that treats founder wellbeing as
                  foundational to better companies and healthier ecosystems.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delayMs={80}>
            <div>
              <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
                Benefits
              </h3>
              <ul className="mt-6 space-y-6">
                {patronBenefits.map((item) => (
                  <li
                    key={item.title}
                    className="border-b border-white/10 pb-6 last:border-0"
                  >
                    <p className="font-serif text-xl text-fb-text">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-fb-body">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-12">
          <Link href="/contact" className="btn btn-gold">
            Become a Founding Patron
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
