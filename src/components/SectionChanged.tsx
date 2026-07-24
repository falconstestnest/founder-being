import { FadeIn } from "@/components/FadeIn";

export function SectionChanged() {
  return (
    <section
      id="changed"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="changed-heading"
    >
      <div className="container-site">
        <FadeIn>
          <p className="section-label">01 — Context</p>
        </FadeIn>

        <div className="grid gap-12 md:grid-cols-2 md:gap-20 lg:gap-28">
          <FadeIn>
            <h2
              id="changed-heading"
              className="editorial-h text-4xl text-fb-text md:text-5xl lg:text-[3.25rem]"
            >
              Entrepreneurship Has Changed
            </h2>
          </FadeIn>

          <FadeIn delayMs={80}>
            <div className="space-y-6 text-base leading-relaxed text-fb-body md:text-lg">
              <p>
                The startup ecosystem has transformed how companies are built.
                Capital cycles move faster. Markets shift overnight. The path
                from idea to scale asks more of founders than ever before.
              </p>
              <p>
                Fundraising, scaling, uncertainty, loneliness, and relentless
                pressure have become ordinary conditions of the journey—often
                carried in silence.
              </p>
              <p className="font-serif text-2xl leading-snug text-fb-text md:text-3xl">
                Founder wellbeing is no longer optional.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
