import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section
      className="noise relative flex min-h-[100svh] items-center justify-center bg-[#0B0B0B]"
      aria-labelledby="hero-heading"
    >
      <div className="container-site flex w-full flex-col items-center py-28 text-center">
        <div className="mb-12 md:mb-14">
          <Logo
            variant="lockup-white"
            height={130}
            priority
            className="mx-auto"
          />
        </div>

        <h1 id="hero-heading" className="type-display max-w-3xl">
          Building Healthier Founders.
          <span className="mt-3 block">Building Better Companies.</span>
        </h1>

        <p className="section-lead mx-auto mt-10 text-center">
          Founder-Being is a founder wellbeing and conscious leadership
          initiative creating meaningful spaces where entrepreneurs can reflect,
          reconnect, and build resilient companies without sacrificing themselves
          in the process.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/patrons" className="btn btn-primary min-w-[15rem]">
            Become a Founding Patron
          </Link>
          <Link href="/about" className="btn btn-secondary min-w-[15rem]">
            Learn about Founder-Being
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/events" className="type-small link-inline">
            View upcoming gatherings
          </Link>
          <span className="text-fb-meta" aria-hidden>
            ·
          </span>
          <Link href="/mission" className="type-small link-inline">
            Explore our mission
          </Link>
        </div>
      </div>
    </section>
  );
}
