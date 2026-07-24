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
            <h2 id="changed-heading" className="type-h2 section-heading">
              Entrepreneurship Has Changed
            </h2>
          </FadeIn>

          <FadeIn delayMs={80}>
            <div className="prose-editorial">
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
              <p className="key-statement mt-8">
                Founder wellbeing is no longer optional.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
