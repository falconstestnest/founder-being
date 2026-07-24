import { FadeIn } from "@/components/FadeIn";
import { pillars } from "@/lib/data";

export function WhatIs() {
  return (
    <section
      id="about"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="about-heading"
    >
      <div className="container-site">
        <FadeIn>
          <p className="section-label">02 — About</p>
          <h2
            id="about-heading"
            className="editorial-h max-w-3xl text-4xl text-[#F8F8F8] md:text-5xl lg:text-[3.5rem]"
          >
            What is Founder-Being?
          </h2>
        </FadeIn>

        <FadeIn delayMs={60}>
          <p className="mt-10 max-w-[40rem] text-lg leading-relaxed text-[#F8F8F8]/72 md:text-xl">
            Founder-Being exists to cultivate a culture where ambitious
            individuals can pursue extraordinary ambition without compromising
            their wellbeing, relationships, identity, or inner peace.
          </p>
        </FadeIn>

        <ul className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} as="li" delayMs={i * 50}>
              <article className="flex h-full flex-col bg-[#0B0B0B] p-8 md:p-10">
                <span
                  className="mb-8 font-mono text-xs tracking-[0.2em] text-[#FFAB33]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-2xl text-[#F8F8F8] md:text-3xl">
                  {pillar.title}
                </h3>
                <hr className="rule my-6 w-10" />
                <p className="text-sm leading-relaxed text-[#F8F8F8]/65 md:text-base">
                  {pillar.description}
                </p>
              </article>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
