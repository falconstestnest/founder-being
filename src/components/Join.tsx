import { FadeIn } from "@/components/FadeIn";
import { JoinForm } from "@/components/JoinForm";

export function Join() {
  return (
    <section
      id="contact"
      className="section border-t border-white/10 bg-[#0B0B0B]"
      aria-labelledby="join-heading"
    >
      <div className="container-site">
        <FadeIn className="text-center">
          <p className="section-label">09 — Join</p>
          <h2
            id="join-heading"
            className="editorial-h text-4xl text-fb-text md:text-5xl"
          >
            Join Founder-Being
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-fb-body">
            Share a few details. We will follow up thoughtfully when the next
            gathering or conversation is right.
          </p>
        </FadeIn>

        <FadeIn delayMs={60}>
          <JoinForm />
        </FadeIn>
      </div>
    </section>
  );
}
