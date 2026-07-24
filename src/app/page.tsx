import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HomePathways } from "@/components/HomePathways";
import { LegacyHashRedirect } from "@/components/LegacyHashRedirect";
import { RouteFocusMain } from "@/components/RouteFocusMain";
import { SkipToContent } from "@/components/SkipToContent";
import { Voices } from "@/components/Voices";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export default function HomePage() {
  return (
    <>
      <LegacyHashRedirect />
      <SkipToContent />
      <RouteFocusMain />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HomePathways />

        <section className="section border-t border-white/10">
          <div className="container-site max-w-3xl text-center">
            <FadeIn>
              <p className="section-label">Context</p>
              <h2 className="type-h2 section-heading">
                Entrepreneurship has changed
              </h2>
              <p className="section-lead mx-auto">
                Capital cycles move faster. Uncertainty and loneliness have
                become ordinary conditions of the journey. Founder wellbeing is
                no longer optional.
              </p>
              <Link href="/about" className="btn btn-secondary mt-10 inline-flex">
                Read why Founder-Being exists
              </Link>
            </FadeIn>
          </div>
        </section>

        <Voices />

        <section className="section border-t border-white/10">
          <div className="container-site max-w-2xl text-center">
            <FadeIn>
              <p className="section-label">Begin</p>
              <h2 className="type-h2 section-heading">
                Start a conversation
              </h2>
              <p className="section-lead mx-auto">
                Programme enquiries, partnerships, patron conversations, and
                general contact—each through a structured form.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/contact" className="btn btn-primary">
                  Contact Founder-Being
                </Link>
                <Link href="/events" className="btn btn-secondary">
                  View upcoming gatherings
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
