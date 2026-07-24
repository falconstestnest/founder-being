import { FadeIn } from "@/components/FadeIn";
import { missionTimeline } from "@/lib/data";

export function Mission() {
  return (
    <section
      id="vision"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="mission-heading"
    >
      <div className="container-site">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="section-label">03 — Mission</p>
          <h2
            id="mission-heading"
            className="editorial-h text-4xl text-[#F8F8F8] md:text-5xl lg:text-[3.5rem]"
          >
            Our Mission
          </h2>
          <p className="mt-10 text-lg leading-relaxed text-[#F8F8F8]/72 md:text-xl">
            To build a global movement advancing founder wellbeing, conscious
            leadership, and emotionally sustainable entrepreneurship.
          </p>
        </FadeIn>

        <FadeIn delayMs={80}>
          <ol className="mx-auto mt-20 flex max-w-4xl flex-col items-center gap-0 md:flex-row md:items-start md:justify-between">
            {missionTimeline.map((place, i) => (
              <li
                key={place}
                className="flex flex-col items-center text-center md:flex-1"
              >
                <span className="font-serif text-2xl text-[#F8F8F8] md:text-3xl">
                  {place}
                </span>
                {i < missionTimeline.length - 1 && (
                  <span
                    className="my-4 font-mono text-sm text-[#FFAB33] md:my-0 md:mt-6 md:hidden"
                    aria-hidden
                  >
                    ↓
                  </span>
                )}
                {i < missionTimeline.length - 1 && (
                  <span
                    className="mt-6 hidden font-mono text-sm text-[#FFAB33] md:block"
                    aria-hidden
                  >
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  );
}
