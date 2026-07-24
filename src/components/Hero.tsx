import { Logo } from "@/components/Logo";

export function Hero() {
  return (
    <section
      id="top"
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

        <h1
          id="hero-heading"
          className="editorial-h max-w-3xl text-4xl text-fb-text sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        >
          Building Healthier Founders.
          <span className="mt-3 block text-fb-text">
            Building Better Companies.
          </span>
        </h1>

        <p className="muted mt-10 max-w-[36rem] text-base leading-relaxed md:text-lg">
          Founder-Being is a founder wellbeing and conscious leadership
          initiative creating meaningful spaces where entrepreneurs can reflect,
          reconnect, and build resilient companies without sacrificing themselves
          in the process.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <a href="#patron" className="btn btn-primary min-w-[15rem]">
            Become a Founding Patron
          </a>
          <a href="#about" className="btn btn-secondary min-w-[15rem]">
            Explore Founder-Being
          </a>
        </div>
      </div>

      <a
        href="#changed"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-fb-meta transition-colors duration-300 hover:text-[#FFAB33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFAB33]"
        aria-label="Scroll to content"
      >
        <span aria-hidden>↓</span>
      </a>
    </section>
  );
}
