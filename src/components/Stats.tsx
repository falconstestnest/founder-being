import { FadeIn } from "@/components/FadeIn";
import { statistics } from "@/lib/data";

export function Stats() {
  return (
    <section
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="stats-heading"
    >
      <div className="container-site">
        <FadeIn>
          <p className="section-label">05 — Evidence</p>
          <h2
            id="stats-heading"
            className="editorial-h max-w-2xl text-4xl text-fb-text md:text-5xl"
          >
            Why Founder Wellbeing Matters
          </h2>
        </FadeIn>

        <ul className="mt-16 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-3 md:gap-8">
          {statistics.map((stat, i) => (
            <FadeIn key={stat.headline} as="li" delayMs={i * 60}>
              <article>
                <p className="font-mono text-5xl tracking-tight text-[#FFAB33] md:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-6 font-serif text-2xl leading-snug text-fb-text md:text-[1.75rem]">
                  {stat.headline}
                </p>
                <p className="mt-4 text-xs tracking-wide text-fb-meta">
                  {stat.source}
                </p>
              </article>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
