import { FadeIn } from "@/components/FadeIn";
import { impactAreas } from "@/lib/data";
import { ImpactIcon } from "@/components/ImpactIcon";

export function Impact() {
  return (
    <section
      id="community"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="impact-heading"
    >
      <div className="container-site">
        <FadeIn>
          <p className="section-label">04 — Impact</p>
          <h2
            id="impact-heading"
            className="editorial-h max-w-2xl text-4xl text-fb-text md:text-5xl"
          >
            How We Create Impact
          </h2>
        </FadeIn>

        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {impactAreas.map((item, i) => (
            <FadeIn key={item.title} as="li" delayMs={i * 40}>
              <article className="group h-full border border-white/10 p-7 transition-colors duration-300 hover:border-[#FFAB33]/40">
                <div className="mb-6 text-[#FFAB33]" aria-hidden>
                  <ImpactIcon name={item.icon} />
                </div>
                <h3 className="text-base font-normal leading-snug tracking-wide text-fb-text">
                  {item.title}
                </h3>
              </article>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
